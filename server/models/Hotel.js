import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a hotel name'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide the city'],
    trim: true,
    index: true
  },
  country: {
    type: String,
    required: [true, 'Please provide the country'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide the address']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  amenities: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
