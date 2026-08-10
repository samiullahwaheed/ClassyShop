import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalProducts, totalCategories] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
  ]);
  res.json({ success: true, data: { totalUsers, totalOrders, totalProducts, totalCategories } });
});

export const getSalesChart = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  const [salesByMonth, usersByMonth] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$total' } } },
    ]),
    User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: 1 } } },
    ]),
  ]);

  const salesMap = new Map(salesByMonth.map((s) => [s._id, s.total]));
  const usersMap = new Map(usersByMonth.map((u) => [u._id, u.total]));

  const months = [
    'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const series = months.map((month, index) => ({
    month,
    totalSales: salesMap.get(index + 1) || 0,
    totalUsers: usersMap.get(index + 1) || 0,
  }));

  res.json({ success: true, data: { year, series } });
});
