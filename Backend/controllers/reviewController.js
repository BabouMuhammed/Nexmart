const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Order = require('../models/Order');

// ── @desc    Get all reviews for a product
// ── @route   GET /api/reviews/:productId
// ── @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// ── @desc    Create a review
// ── @route   POST /api/reviews/:productId
// ── @access  Private (must have purchased the product)
const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  // Check user has actually ordered and received this product
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    orderStatus: 'delivered',
  });

  if (!hasPurchased) {
    res.status(403);
    throw new Error('You can only review products you have purchased and received');
  }

  // Check for existing review
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
  });

  await review.populate('user', 'name avatar');
  res.status(201).json(review);
});

// ── @desc    Delete a review
// ── @route   DELETE /api/reviews/:id
// ── @access  Private (owner or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

module.exports = { getProductReviews, createReview, deleteReview };
