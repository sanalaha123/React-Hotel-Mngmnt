import Promotion from '../models/Promotion.js';

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    await promotion.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate promotion code
// @route   POST /api/promotions/validate
// @access  Public
export const validatePromotion = async (req, res) => {
  try {
    const { code } = req.body;
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    });
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promotion code'
      });
    }

    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
