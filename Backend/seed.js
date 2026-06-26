require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const sampleProducts = (sellerId) => [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Immersive sound quality with advanced active noise-canceling technology. Comfortable fit and 30-hour battery life.',
    price: 199.99,
    discountPrice: 149.99,
    category: 'Electronics',
    brand: 'AcousticPro',
    stock: 50,
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' }],
    isFeatured: true,
    ratings: { average: 4.8, count: 120 }
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Elegant minimalist wristwatch with a genuine leather strap and scratch-resistant sapphire crystal dial.',
    price: 120.00,
    category: 'Electronics',
    brand: 'Tempora',
    stock: 25,
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop' }],
    isFeatured: true,
    ratings: { average: 4.6, count: 85 }
  },
  {
    name: 'Ultra-Performance Running Shoes',
    description: 'Designed for athletes. Lightweight, breathable mesh upper with responsive cushioning for maximum energy return.',
    price: 85.00,
    discountPrice: 70.00,
    category: 'Clothing',
    brand: 'AeroStride',
    stock: 40,
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' }],
    isFeatured: true,
    ratings: { average: 4.7, count: 210 }
  },
  {
    name: 'Double-Walled Smart Thermos',
    description: 'Keeps drinks hot for 12 hours or cold for 24 hours. Built-in LED touch display shows current temperature.',
    price: 35.00,
    category: 'Home & Garden',
    brand: 'HydroSmart',
    stock: 100,
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop' }],
    isFeatured: false,
    ratings: { average: 4.4, count: 45 }
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back desk chair with lumbar support, adjustable headrest, and breathable mesh backing for all-day comfort.',
    price: 249.99,
    discountPrice: 199.99,
    category: 'Home & Garden',
    brand: 'ErgoComfort',
    stock: 15,
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&h=500&fit=crop' }],
    isFeatured: true,
    ratings: { average: 4.5, count: 62 }
  }
];

const seedData = async () => {
  await connectDB();

  try {
    // 1. Seed/Reset Admin User
    let admin = await User.findOne({ email: 'admin@nexmart.com' });
    if (!admin) {
      admin = await User.create({
        name: 'NexMart Admin',
        email: 'admin@nexmart.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      });
      console.log('Admin user created:', admin.email);
    } else {
      admin.password = 'admin123';
      admin.role = 'admin'; // Ensure the role is reset to admin
      await admin.save();
      console.log('Admin user reset (password: admin123, role: admin)');
    }

    // 2. Seed/Reset Seller User
    let seller = await User.findOne({ email: 'seller@nexmart.com' });
    if (!seller) {
      seller = await User.create({
        name: 'NexMart Seller',
        email: 'seller@nexmart.com',
        password: 'seller123',
        role: 'seller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
      });
      console.log('Seller user created:', seller.email);
    } else {
      seller.password = 'seller123';
      seller.role = 'seller'; // Ensure the role is reset to seller
      await seller.save();
      console.log('Seller user reset (password: seller123, role: seller)');
    }

    // 3. Seed/Reset Customer User
    let customer = await User.findOne({ email: 'customer@nexmart.com' });
    if (!customer) {
      customer = await User.create({
        name: 'John Doe',
        email: 'customer@nexmart.com',
        password: 'customer123',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop'
      });
      console.log('Customer user created:', customer.email);
    } else {
      customer.password = 'customer123';
      customer.role = 'customer'; // Ensure the role is reset to customer
      await customer.save();
      console.log('Customer user reset (password: customer123, role: customer)');
    }

    // 4. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = sampleProducts(seller._id);
      await Product.insertMany(products);
      console.log('Sample products seeded successfully!');
    } else {
      console.log('Products already exist in database. Skipping product seeding.');
    }

    console.log('Seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
