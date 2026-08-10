import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, buildPaginatedResult } from '../utils/pagination.js';

async function generateOrderId() {
  const count = await Order.countDocuments();
  return `ORD-${String(count + 1).padStart(6, '0')}`;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress } = req.body;
  if (!items?.length) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.product);
    if (!product) throw new ApiError(404, `Product ${item.product} not found`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }
    subtotal += product.price * item.quantity;
    return {
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      weight: item.weight,
    };
  });

  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  const order = await Order.create({
    orderId: await generateOrderId(),
    user: req.user._id,
    items: orderItems,
    deliveryAddress,
    paymentMethod: 'COD',
    subtotal,
    shipping,
    total,
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sales: item.quantity },
      })
    )
  );

  res.status(201).json({ success: true, data: { order } });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { orders } });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (req.user.role !== 'admin' && !order.user.equals(req.user._id)) {
    throw new ApiError(403, 'You cannot view this order');
  }
  res.json({ success: true, data: { order } });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { orderId: { $regex: req.query.search, $options: 'i' } },
      { 'deliveryAddress.phone': { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const [data, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, ...buildPaginatedResult({ data, total, page, limit }) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: { order } });
});
