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
    description: 'Lightweight, breathable mesh upper with responsive cushioning for maximum energy return.',
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
    // 1. Admin User
    let admin = await User.findOne({ email: 'admin@nexmart.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Mamadou Babou',
        email: 'admin@nexmart.com',
        password: 'admin123',
        role: 'admin',
        avatar: '',
      });
      console.log('Admin user created:', admin.email);
    } else {
      admin.name = 'Mamadou Babou';
      admin.password = 'admin123';
      admin.role = 'admin';
      admin.avatar = '';
      await admin.save();
      console.log('Admin user reset (password: admin123, role: admin)');
    }

    // 2. Seller User
    let seller = await User.findOne({ email: 'seller@nexmart.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Fatou Fofana',
        email: 'seller@nexmart.com',
        password: 'seller123',
        role: 'seller',
        avatar: '',
      });
      console.log('Seller user created:', seller.email);
    } else {
      seller.name = 'Fatou Fofana';
      seller.password = 'seller123';
      seller.role = 'seller';
      seller.avatar = '';
      await seller.save();
      console.log('Seller user reset (password: seller123, role: seller)');
    }

    // 3. Customer Users with Gambian names
    const customers = [
      { name: 'Madi Bah', email: 'madi.bah@nexmart.com', password: 'customer123' },
      { name: 'Awa Kah', email: 'awa.kah@nexmart.com', password: 'customer123' },
      { name: 'Binta Babou', email: 'binta.babou@nexmart.com', password: 'customer123' },
      { name: 'Mamadou Fofana', email: 'mamadou.fofana@nexmart.com', password: 'customer123' },
      { name: 'Fatou Jallow', email: 'fatou.jallow@nexmart.com', password: 'customer123' },
    ];

    for (const c of customers) {
      let user = await User.findOne({ email: c.email });
      if (!user) {
        await User.create({ ...c, role: 'customer', avatar: '' });
        console.log('Customer created:', c.email);
      } else {
        user.name = c.name;
        user.password = c.password;
        user.avatar = '';
        await user.save();
        console.log('Customer reset:', c.email);
      }
    }

    // 4. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = sampleProducts(seller._id);
      await Product.insertMany(products);
      console.log('Sample products seeded successfully!');
    } else {
      console.log('Products already exist. Skipping product seeding.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();