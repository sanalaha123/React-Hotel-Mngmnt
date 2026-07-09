import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import sampleRooms from '../data/sampleRooms.js';
import Booking from '../models/Booking.js';

// ... (existing imports)

// ... (existing methods)

// @desc    Get booked dates for a room
// @route   GET /api/rooms/:id/booked-dates
// @access  Public
export const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      room: req.params.id,
      status: { $ne: 'cancelled' },
      checkOut: { $gte: new Date() } // Only future/current bookings
    }).select('checkIn checkOut');

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


// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    // Check if rooms exist, if not seed them
    const count = await Room.countDocuments();
    if (count === 0) {
      console.log('No rooms found, seeding database...');
      await Room.insertMany(sampleRooms);
      console.log('Database seeded with sample rooms');
    }

    const { type, minPrice, maxPrice, capacity, search, city } = req.query;
    
    let query = {};
    
    // Filter by city (needs to look up hotels first)
    if (city) {
      const hotels = await Hotel.find({ city: { $regex: city, $options: 'i' } });
      const hotelIds = hotels.map(hotel => hotel._id);
      query.hotel = { $in: hotelIds };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Filter by capacity
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const rooms = await Room.find(query).sort('-createdAt').populate('hotel', 'name city country');
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
