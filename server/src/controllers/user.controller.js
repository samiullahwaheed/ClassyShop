import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, buildPaginatedResult } from '../utils/pagination.js';

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, countryCode } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...(name && { name }), ...(phone && { phone }), ...(countryCode && { countryCode }) } },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { user: user.toSafeObject() } });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});

export const listAddresses = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { addresses: req.user.addresses } });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, data: { addresses: user.addresses } });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, 'Address not found');
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  address.set(req.body);
  await user.save();
  res.json({ success: true, data: { addresses: user.addresses } });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.id(req.params.addressId)?.deleteOne();
  await user.save();
  res.json({ success: true, data: { addresses: user.addresses } });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: { wishlist: user.wishlist } });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.params.productId } });
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: { wishlist: user.wishlist } });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: { wishlist: user.wishlist } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { role: 'customer' };
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, ...buildPaginatedResult({ data, total, page, limit }) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: { user: user.toSafeObject() } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: null });
});
