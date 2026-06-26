import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ArrowRight,
  Sparkles,
  Bolt,
  Lock,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { ProductCard } from '../components/ProductCard';
import { LuxuryHero } from '../components/LuxuryHero';
import { FeatureCard } from '../components/FeatureCard';
import { SectionDivider } from '../components/SectionDivider';
import { getProducts, getCategories } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    const loadData = async () => {
      const prods = await getProducts();
      const cats = await getCategories();
      setProducts(prods.slice(0, 6));
      setCategories(cats);
    };
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={0} />

      {/* Hero Section */}
      <LuxuryHero
        badge="Next Generation Shopping"
        title="Shop Beyond Tomorrow"
        subtitle="Experience the future of e-commerce"
        description="Discover curated collections of premium products with cutting-edge technology, exclusive designs, and seamless shopping experience."
        primaryCTA={{
          label: 'Explore Shop',
          onClick: () => navigate('/shop'),
        }}
        secondaryCTA={{
          label: 'Featured Drops',
          onClick: () => navigate('/shop'),
        }}
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
        className="pt-32 pb-20"
      />

      <SectionDivider variant="gradient" className="my-8" />

      {/* Categories Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#A855F7] font-semibold text-sm tracking-widest uppercase mb-4">
              Collections
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Explore Our Collections
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Handpicked categories featuring the finest products in every segment
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                onClick={() => navigate('/shop')}
                className="cursor-pointer"
              >
                <GlassCard variant="elevated" hover>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                    <motion.div
                      whileHover={{ rotate: 45, scale: 1.2 }}
                      className="w-10 h-10 rounded-lg bg-[#A855F7]/20 flex items-center justify-center"
                    >
                      <ArrowRight className="w-5 h-5 text-[#A855F7]" />
                    </motion.div>
                  </div>
                  <p className="text-white/60 text-sm">
                    {category.productCount} products
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="line" className="my-8" />

      {/* Featured Products Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16"
          >
            <div>
              <p className="text-[#A855F7] font-semibold text-sm tracking-widest uppercase mb-4">
                Curated Selection
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                Featured Products
              </h2>
            </div>
            <NeonButton
              variant="secondary"
              onClick={() => navigate('/shop')}
              className="gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </NeonButton>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="gradient" className="my-8" />

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#A855F7] font-semibold text-sm tracking-widest uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Premium Experience
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Instant checkout and delivery tracking',
              },
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'On orders over $99 worldwide',
              },
              {
                icon: Lock,
                title: 'Secure Payment',
                description: 'SSL encrypted transactions',
              },
              {
                icon: RotateCcw,
                title: 'Easy Returns',
                description: '30-day money-back guarantee',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant="default"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="line" className="my-8" />

      {/* Newsletter Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard variant="elevated" className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                Subscribe to our newsletter for exclusive offers and early access to new collections
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-[#050B2D] border border-[#A855F7]/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#A855F7]"
                />
                <NeonButton variant="primary" size="md">
                  Subscribe
                </NeonButton>
              </div>

              <p className="text-white/40 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
