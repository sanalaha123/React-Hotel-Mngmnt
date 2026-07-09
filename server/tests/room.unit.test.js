import mongoose from 'mongoose';
import Room from '../models/Room.js';

describe('Room Model Unit Test', () => {
  it('should validate a valid room', () => {
    const room = new Room({
      name: 'Test Room',
      description: 'Test Description',
      type: 'Single',
      price: 100,
      capacity: 1,
      hotel: new mongoose.Types.ObjectId()
    });
    
    const err = room.validateSync();
    expect(err).toBeUndefined();
  });

  it('should require name', () => {
    const room = new Room({
      description: 'Test Description'
    });
    
    const err = room.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  it('should require valid type enum', () => {
    const room = new Room({
      name: 'Test Room',
      type: 'InvalidType'
    });
    
    const err = room.validateSync();
    expect(err.errors.type).toBeDefined();
  });
});
