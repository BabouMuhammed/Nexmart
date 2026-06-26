require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:3003'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'NexMart API is running' });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NexMart server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors()); 
