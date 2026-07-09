import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  icon: {
    type: String,
    default: 'FaConciergeBell'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
