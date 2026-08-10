import { Router } from 'express';
import { z } from 'zod';
import * as reviewController from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
});

router.get('/product/:productId', reviewController.listReviewsForProduct);
router.post('/product/:productId', verifyToken, validate(reviewSchema), reviewController.createReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

export default router;
