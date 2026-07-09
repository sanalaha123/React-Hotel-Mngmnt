import Review from '../models/Review.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { room, rating, comment } = req.body;
    
    // Check if user has booked this room
    const booking = await Booking.findOne({
      user: req.user._id,
      room,
      status: 'completed'
    });
    
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review rooms you have stayed in'
      });
    }
    
    // Check if user already reviewed this room
    const existingReview = await Review.findOne({
      user: req.user._id,
      room
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this room'
      });
    }
    
    // Create review
    const review = await Review.create({
      user: req.user._id,
      room,
      rating,
      comment
    });
    
    // Update room rating
    const reviews = await Review.find({ room });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Room.findByIdAndUpdate(room, {
      rating: avgRating,
      numReviews: reviews.length
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');
    
    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
export const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    const roomId = review.room;
    await review.deleteOne();
    
    // Update room rating
    const reviews = await Review.find({ room: roomId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;
    
    await Room.findByIdAndUpdate(roomId, {
      rating: avgRating,
      numReviews: reviews.length
    });
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // Recalculate average rating for room
    const roomId = review.room;
    const reviews = await Review.find({ room: roomId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Room.findByIdAndUpdate(roomId, {
      rating: avgRating
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
