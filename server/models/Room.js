import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a room name'],
    trim: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Please specify the hotel']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  type: {
    type: String,
    required: [true, 'Please specify room type'],
    enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify capacity'],
    min: 1
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
