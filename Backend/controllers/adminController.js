const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ── @desc    Get dashboard stats
// ── @route   GET /api/admin/stats
// ── @access  Private (admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueData,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),

    // Total revenue from paid orders
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),

    // Last 5 orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email'),

    // Orders grouped by status
    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueData[0]?.total || 0,
    recentOrders,
    ordersByStatus,
    monthlyRevenue,
  });
});

// ── @desc    Get all users
// ── @route   GET /api/admin/users
// ── @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// ── @desc    Update user role or status
// ── @route   PUT /api/admin/users/:id
// ── @access  Private (admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive ?? user.isActive;

  const updated = await user.save();
  res.json(updated);
});

// ── @desc    Get all orders
// ── @route   GET /api/admin/orders
// ── @access  Private (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// ── @desc    Update order status
// ── @route   PUT /api/admin/orders/:id/status
// ── @access  Private (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = req.body.orderStatus;

  if (req.body.orderStatus === 'delivered') {
    order.deliveredAt = Date.now();
  }

  const updated = await order.save();
  res.json(updated);
});

// ── @desc    Toggle product featured status
// ── @route   PUT /api/admin/products/:id/feature
// ── @access  Private (admin)
const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.json({ message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'}`, product });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  getAllOrders,
  updateOrderStatus,
  toggleFeaturedProduct,
};