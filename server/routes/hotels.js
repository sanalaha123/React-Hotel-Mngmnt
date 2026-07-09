import express from 'express';
import { getHotels, getHotelById, getHotelRooms, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getHotels)
  .post(protect, admin, createHotel);

router.route('/:id')
  .get(getHotelById)
  .put(protect, admin, updateHotel)
  .delete(protect, admin, deleteHotel);

router.get('/:id/rooms', getHotelRooms);

export default router;
