const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// ── @desc    Get all products (with search, filter, pagination)
// ── @route   GET /api/products
// ── @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  // Search by keyword
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Filter by min rating
  if (req.query.minRating) {
    filter['ratings.average'] = { $gte: Number(req.query.minRating) };
  }

  // Sorting
  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    top_rated: { 'ratings.average': -1 },
  };
  const sort = sortOptions[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).populate('seller', 'name'),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// ── @desc    Get single product by ID
// ── @route   GET /api/products/:id
// ── @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name email');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// ── @desc    Get featured products
// ── @route   GET /api/products/featured
// ── @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json(products);
});

// ── @desc    Create a product
// ── @route   POST /api/products
// ── @access  Private (seller, admin)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    badge,
  } = req.body;

  // Handle uploaded images from Cloudinary
  const images = req.files
    ? req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }))
    : [];

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    badge,
    stock,
    images,
    seller: req.user._id,
  });

  res.status(201).json(product);
});

// ── @desc    Update a product
// ── @route   PUT /api/products/:id
// ── @access  Private (seller who owns it, admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Only the seller who owns it or admin can update
  if (
    product.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedProduct);
});

// ── @desc    Delete a product (soft delete)
// ── @route   DELETE /api/products/:id
// ── @access  Private (seller who owns it, admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (
    product.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  // Soft delete — keeps data for order history integrity
  product.isActive = false;
  await product.save();

  res.json({ message: 'Product removed successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
