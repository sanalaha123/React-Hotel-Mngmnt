import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/', protect, admin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.delete('/:id', protect, admin, deleteBooking);

export default router;
