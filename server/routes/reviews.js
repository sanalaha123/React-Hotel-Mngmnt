import express from 'express';
import {
  createReview,
  getRoomReviews,
  deleteReview,
  updateReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/room/:roomId', getRoomReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
