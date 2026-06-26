const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { roleGuard } = require('../middleware/rolemiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  roleGuard('seller', 'admin'),
  upload.array('images', 5), // Max 5 images
  createProduct
);

router.put('/:id', protect, roleGuard('seller', 'admin'), updateProduct);
router.delete('/:id', protect, roleGuard('seller', 'admin'), deleteProduct);

module.exports = router;
