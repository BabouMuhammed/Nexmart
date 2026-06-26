const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ── @desc    Create a new order + Stripe payment intent
// ── @route   POST /api/orders
// ── @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Validate stock for each item
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${item.product.name}"`);
    }
  }

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100; // 8% tax
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0]?.url || '',
    price: item.price,
    quantity: item.quantity,
  }));

  let paymentResult = {};
  let clientSecret = null;

  // Create Stripe payment intent if paying by card
  if (paymentMethod === 'stripe') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { userId: req.user._id.toString() },
    });
    clientSecret = paymentIntent.client_secret;
    paymentResult.id = paymentIntent.id;
    paymentResult.status = paymentIntent.status;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: paymentMethod === 'cash_on_delivery' ? false : false,
  });

  // Deduct stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear the cart after placing order
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({ order, clientSecret });
});

// ── @desc    Confirm order as paid (after Stripe success)
// ── @route   PUT /api/orders/:id/pay
// ── @access  Private
const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    email_address: req.body.email_address,
  };

  const updated = await order.save();
  res.json(updated);
});

// ── @desc    Get logged-in user's orders
// ── @route   GET /api/orders/my
// ── @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// ── @desc    Get single order by ID
// ── @route   GET /api/orders/:id
// ── @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only order owner or admin can view
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

module.exports = { createOrder, markOrderAsPaid, getMyOrders, getOrderById };