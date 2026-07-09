import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a promotion code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercent: {
    type: Number,
    required: [true, 'Please provide a discount percentage'],
    min: 1,
    max: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  validFrom: {
    type: Date,
    required: [true, 'Please provide a start date'],
    default: Date.now
  },
  validTo: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
