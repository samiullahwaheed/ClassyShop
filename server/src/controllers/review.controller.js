import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function recalculateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { average = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    'rating.average': Math.round(average * 10) / 10,
    'rating.count': count,
  });
}

export const listReviewsForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: { reviews } });
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
  if (existing) {
    throw new ApiError(409, 'You have already reviewed this product');
  }
  const review = await Review.create({
    product: req.params.productId,
    user: req.user._id,
    rating,
    comment,
  });
  await recalculateProductRating(req.params.productId);
  res.status(201).json({ success: true, data: { review } });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (req.user.role !== 'admin' && !review.user.equals(req.user._id)) {
    throw new ApiError(403, 'You cannot delete this review');
  }
  await review.deleteOne();
  await recalculateProductRating(review.product);
  res.json({ success: true, data: null });
});
