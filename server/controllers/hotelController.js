import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
  try {
    const { city, search, country } = req.query;
    
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    const hotels = await Hotel.find(query);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get rooms for a specific hotel
// @route   GET /api/hotels/:id/rooms
// @access  Public
export const getHotelRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.id });

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

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
