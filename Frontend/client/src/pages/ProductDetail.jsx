import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Lock,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { getProductById, getProducts } from '../services/api';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [location, navigate] = useLocation();
  const productId = location.split('/').pop();

  useEffect(() => {
    const loadProduct = async () => {
      const prod = await getProductById(productId);
      setProduct(prod);

      const allProducts = await getProducts();
      const related = allProducts
        .filter((p) => p.category === prod.category && p._id !== prod._id)
        .slice(0, 4);
      setRelatedProducts(related);
    };
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050B2D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={0} />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-[#A0AEC0] hover:text-[#00E5D4] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Shop
          </motion.button>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="glass rounded-3xl overflow-hidden p-6 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
              </div>
              {/* Thumbnail Row */}
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="glass rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={`View ${i + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-[#A0AEC0] text-sm mb-2">{product.category}</p>

              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <StarRating
                  rating={product.rating}
                  showValue
                  count={product.reviews}
                />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-[#00E5D4]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-[#64748B] line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 20 ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-green-300">In Stock ({product.stock})</span>
                  </>
                ) : product.stock > 0 ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-yellow-300">Low Stock ({product.stock})</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-red-300">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-[#A0AEC0] mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <GlassCard className="mb-8 w-fit">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#00E5D4]/20 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-white w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#00E5D4]/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <motion.div
                  animate={added ? { scale: 1.02 } : { scale: 1 }}
                >
                  <NeonButton
                    variant={added ? 'primary' : 'primary'}
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    className="gap-2"
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </NeonButton>
                </motion.div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all"
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </motion.button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#A0AEC0]">
                  <Lock className="w-4 h-4 text-[#00E5D4]" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-[#A0AEC0]">
                  <Zap className="w-4 h-4 text-[#00E5D4]" />
                  <span className="text-sm">Fast Shipping</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 border-t border-[rgba(0,229,212,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-12"
          >
            Customer Reviews
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[...Array(3)].map((_, i) => (
              <GlassCard key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5D4] to-[#8B5CF6]" />
                  <div>
                    <p className="font-semibold text-white">Customer {i + 1}</p>
                    <p className="text-xs text-[#A0AEC0]">2 weeks ago</p>
                  </div>
                </div>
                <StarRating rating={4 + i * 0.2} showValue={false} />
                <p className="text-[#A0AEC0] mt-3 text-sm">
                  Great product! Exceeded my expectations. Highly recommended.
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-12"
          >
            Related Products
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {relatedProducts.map((prod) => (
              <motion.div
                key={prod._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/product/${prod._id}`)}
              >
                <ProductCard product={prod} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
