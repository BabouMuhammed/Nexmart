const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ── @desc    Get user's cart
// ── @route   GET /api/cart
// ── @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name images price stock isActive'
  );

  if (!cart) {
    return res.json({ items: [], totalPrice: 0 });
  }

  res.json(cart);
});

// ── @desc    Add item to cart (or increase qty)
// ── @route   POST /api/cart
// ── @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increase quantity if already in cart
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items available`);
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
  }

  await cart.populate('items.product', 'name images price stock');
  res.json(cart);
});

// ── @desc    Update item quantity in cart
// ── @route   PUT /api/cart/:itemId
// ── @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name images price stock');
  res.json(cart);
});

// ── @desc    Remove item from cart
// ── @route   DELETE /api/cart/:itemId
// ── @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json({ message: 'Item removed from cart', cart });
});

// ── @desc    Clear entire cart
// ── @route   DELETE /api/cart
// ── @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };