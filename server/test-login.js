import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Exists' : 'Missing');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@hotel.com';
    const password = 'admin123';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User found:', user.email);
    console.log('Hashed Password in DB:', user.password);

    const isMatch = await user.comparePassword(password);
    console.log('Password Match:', isMatch);

    if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        console.log('Token generated successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
