const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ── @desc    Get logged-in user's wishlist (populated with product data)
// ── @route   GET /api/wishlist
// ── @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist || []);
});

// ── @desc    Add a product to the wishlist
// ── @route   POST /api/wishlist/:productId
// ── @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  const alreadyInWishlist = user.wishlist.some(
    (id) => id.toString() === productId
  );

  if (!alreadyInWishlist) {
    user.wishlist.push(productId);
    await user.save();
  }

  const populated = await user.populate('wishlist');
  res.status(200).json(populated.wishlist);
});

// ── @desc    Remove a product from the wishlist
// ── @route   DELETE /api/wishlist/:productId
// ── @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId
  );
  await user.save();

  const populated = await user.populate('wishlist');
  res.status(200).json(populated.wishlist);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
