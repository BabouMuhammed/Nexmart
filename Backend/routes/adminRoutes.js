const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  getAllOrders,
  updateOrderStatus,
  toggleFeaturedProduct,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { roleGuard } = require('../middleware/rolemiddleware');

// All admin routes require auth + admin role
router.use(protect, roleGuard('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/products/:id/feature', toggleFeaturedProduct);

module.exports = router;
