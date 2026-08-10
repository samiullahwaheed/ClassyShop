import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

export const listCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.level !== undefined) filter.level = Number(req.query.level);
  if (req.query.parent) filter.parentCategory = req.query.parent;
  const categories = await Category.find(filter).sort({ order: 1, name: 1 });
  res.json({ success: true, data: { categories } });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: { category } });
});

export const createCategory = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.name);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: { category } });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name);
  const category = await Category.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: { category } });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: null });
});
