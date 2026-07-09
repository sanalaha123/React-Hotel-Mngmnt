import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import sampleRooms from './sampleRooms.js';
import sampleHotels from './sampleHotels.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Room.deleteMany();
    await Hotel.deleteMany();
    console.log('Cleared existing rooms and hotels');

    // Reset admin user to ensure known credentials
    await User.deleteOne({ email: 'admin@hotel.com' });
    
    await User.create({
        name: 'Admin User',
        email: 'admin@hotel.com',
        password: 'admin123',
        role: 'admin'
    });
    console.log('Created/Reset admin user (email: admin@hotel.com, password: admin123)');

    // Insert sample hotels
    const createdHotels = await Hotel.insertMany(sampleHotels);
    console.log(`✅ Inserted ${createdHotels.length} sample hotels`);

    // Assign rooms to hotels (distribute them)
    const roomsWithHotels = sampleRooms.map((room, index) => {
        // Simple distribution: 5 hotels, loop through them
        const hotelIndex = index % createdHotels.length;
        return { ...room, hotel: createdHotels[hotelIndex]._id };
    });

    // Insert sample rooms
    await Room.insertMany(roomsWithHotels);
    console.log(`✅ Inserted ${roomsWithHotels.length} sample rooms`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('- Browse rooms at /rooms');
    console.log('- Login as admin: admin@hotel.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
