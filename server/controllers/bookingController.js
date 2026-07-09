import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guests, totalPrice, specialRequests } = req.body;
    
    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }
    
    // Check if room exists and is available
    const roomDoc = await Room.findById(room);
    
    if (!roomDoc) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    if (!roomDoc.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available'
      });
    }
    
    // Check if room is already booked for these dates
    const existingBooking = await Booking.findOne({
      room,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
        { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
        { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the selected dates'
      });
    }
    
    // Check capacity
    if (guests > roomDoc.capacity) {
      return res.status(400).json({
        success: false,
        message: `Room capacity is ${roomDoc.capacity} guests`
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests: specialRequests || ''
    });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name type price images')
      .populate('user', 'name email');
    
    // Notify admin and update availability
    if (req.io) {
      req.io.emit('new-booking', populatedBooking);
      req.io.emit('room-availability-update', { roomId: room });
    }
    
    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name type price images')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name type price')
      .populate('user', 'name email')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'name type price images amenities')
      .populate('user', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();
    
    const updatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name type price')
      .populate('user', 'name email');
    
    if (req.io) {
        req.io.emit('booking-updated', updatedBooking);
        
        // If status changed to something that affects availability (e.g. cancelled), notify
        if (status === 'cancelled' || status === 'completed') {
             req.io.emit('room-availability-update', { roomId: booking.room });
        }
    }
    
    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${booking.status} booking`
      });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    if (req.io) {
        req.io.emit('booking-updated', booking);
        req.io.emit('room-availability-update', { roomId: booking.room });
    }

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check room availability
// @route   POST /api/bookings/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
        { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
        { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
      ]
    });
    
    res.status(200).json({
      success: true,
      available: !existingBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
