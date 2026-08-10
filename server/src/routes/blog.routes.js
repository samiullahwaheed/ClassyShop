import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { blogs } });
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) throw new ApiError(404, 'Blog post not found');
    res.json({ success: true, data: { blog } });
  })
);

router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.title);
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: { blog } });
  })
);

router.patch(
  '/:id',
  verifyToken,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const update = { ...req.body };
    if (update.title) update.slug = slugify(update.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!blog) throw new ApiError(404, 'Blog post not found');
    res.json({ success: true, data: { blog } });
  })
);

router.delete(
  '/:id',
  verifyToken,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) throw new ApiError(404, 'Blog post not found');
    res.json({ success: true, data: null });
  })
);

export default router;
