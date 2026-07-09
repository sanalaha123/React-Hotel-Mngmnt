import mongoose from 'mongoose';
import Booking from '../models/Booking.js';

describe('Booking Model Unit Test', () => {
    it('should validate a valid booking', () => {
        const booking = new Booking({
            user: new mongoose.Types.ObjectId(),
            room: new mongoose.Types.ObjectId(),
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000), // +1 day
            guests: 2,
            totalPrice: 200,
            status: 'pending',
            paymentStatus: 'pending'
        });

        const err = booking.validateSync();
        expect(err).toBeUndefined();
    });

    it('should require core fields', () => {
        const booking = new Booking({});
        const err = booking.validateSync();
        
        expect(err.errors.user).toBeDefined();
        expect(err.errors.room).toBeDefined();
        expect(err.errors.checkIn).toBeDefined();
        expect(err.errors.checkOut).toBeDefined();
        expect(err.errors.totalPrice).toBeDefined();
    });

    it('should enforce status enums', () => {
        const booking = new Booking({
            user: new mongoose.Types.ObjectId(),
            room: new mongoose.Types.ObjectId(),
            checkIn: new Date(),
            checkOut: new Date(),
            guests: 1,
            totalPrice: 100,
            status: 'invalid_status',
            paymentStatus: 'invalid_payment'
        });

        const err = booking.validateSync();
        expect(err.errors.status).toBeDefined();
        expect(err.errors.paymentStatus).toBeDefined();
    });
});
