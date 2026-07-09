import express from 'express';
import {
  getPromotions,
  createPromotion,
  deletePromotion,
  validatePromotion,
  updatePromotion
} from '../controllers/promotionController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion);

router.post('/validate', validatePromotion);

router.route('/:id')
  .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion);

export default router;
