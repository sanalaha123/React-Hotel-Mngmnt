import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

const router = express.Router();

// Get admin stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRooms = await Room.countDocuments();
    const bookings = await Booking.find();
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0);
    
    // Get recent bookings with user and room details
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('room', 'name type');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        totalBookings,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }

    await user.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings (admin)
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete booking (admin)
router.delete('/bookings/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    await booking.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get analytics data
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    // 1. Daily Revenue (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Bookings by Room Type
    const bookingsByType = await Booking.aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      { $unwind: '$roomData' },
      {
        $group: {
          _id: '$roomData.type',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        dailyRevenue,
        bookingsByType
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
