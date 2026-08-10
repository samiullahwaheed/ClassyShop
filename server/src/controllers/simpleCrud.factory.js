import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Shared list/create/update/delete for the simple ordered-content models (Banner, HomeSlide, Blog).
export function createSimpleCrudController(Model, notFoundMessage) {
  const list = asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: { items } });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: { item } });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, notFoundMessage);
    res.json({ success: true, data: { item } });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, notFoundMessage);
    res.json({ success: true, data: null });
  });

  return { list, create, update, remove };
}
