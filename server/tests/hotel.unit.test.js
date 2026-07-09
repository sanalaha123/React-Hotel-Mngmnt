import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js';

describe('Hotel Model Unit Test', () => {
    it('should validate a valid hotel', () => {
        const hotel = new Hotel({
            name: 'Grand Hotel',
            city: 'Paris',
            country: 'France',
            address: '1 Champs Elysees',
            description: 'Luxury hotel',
            rating: 4.5
        });

        const err = hotel.validateSync();
        expect(err).toBeUndefined();
    });

    it('should require core fields', () => {
        const hotel = new Hotel({});
        const err = hotel.validateSync();
        
        expect(err.errors.name).toBeDefined();
        expect(err.errors.city).toBeDefined();
        expect(err.errors.country).toBeDefined();
        expect(err.errors.address).toBeDefined();
        expect(err.errors.description).toBeDefined();
    });

    it('should enforce rating min/max', () => {
        const hotel = new Hotel({
            name: 'Grand Hotel',
            city: 'Paris',
            country: 'France',
            address: '1 Champs Elysees',
            description: 'Luxury hotel',
            rating: 6 // Invalid > 5
        });

        const err = hotel.validateSync();
        expect(err.errors.rating).toBeDefined();
    });
});
