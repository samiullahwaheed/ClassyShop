import { Product } from '../models/Product.js';
import { ProductRam, ProductWeight, ProductSize } from '../models/ProductVariantLookups.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, buildPaginatedResult } from '../utils/pagination.js';
import { slugify } from '../utils/slugify.js';

const SORT_MAP = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  newest: { createdAt: -1 },
  rating: { 'rating.average': -1 },
  'name-asc': { name: 1 },
};

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isActive: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.subCategory) filter.subCategory = req.query.subCategory;
  if (req.query.thirdLevelCategory) filter.thirdLevelCategory = req.query.thirdLevelCategory;
  if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.rating) filter['rating.average'] = { $gte: Number(req.query.rating) };

  if (req.query.priceMin || req.query.priceMax) {
    filter.price = {};
    if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
    if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
  }

  const sort = SORT_MAP[req.query.sort] || { createdAt: -1 };

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate('category subCategory thirdLevelCategory', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, ...buildPaginatedResult({ data, total, page, limit }) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'category subCategory thirdLevelCategory',
    'name slug'
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: { product } });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  }).limit(8);
  res.json({ success: true, data: { products: related } });
});

export const createProduct = asyncHandler(async (req, res) => {
  const baseSlug = slugify(req.body.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: { product } });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name);
  const product = await Product.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: { product } });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: null });
});

const LOOKUP_MODELS = { rams: ProductRam, weights: ProductWeight, sizes: ProductSize };

function getLookupModel(type) {
  const model = LOOKUP_MODELS[type];
  if (!model) throw new ApiError(404, 'Unknown lookup type');
  return model;
}

export const listLookup = asyncHandler(async (req, res) => {
  const Model = getLookupModel(req.params.type);
  const items = await Model.find().sort({ value: 1 });
  res.json({ success: true, data: { items } });
});

export const createLookup = asyncHandler(async (req, res) => {
  const Model = getLookupModel(req.params.type);
  const item = await Model.create({ value: req.body.value });
  res.status(201).json({ success: true, data: { item } });
});

export const deleteLookup = asyncHandler(async (req, res) => {
  const Model = getLookupModel(req.params.type);
  const item = await Model.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Lookup value not found');
  res.json({ success: true, data: null });
});
