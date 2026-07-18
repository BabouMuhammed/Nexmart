import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { NeonButton } from './NeonButton';
import { GlassCard } from './GlassCard';
import { useWishlist } from '../contexts/WishListContext';

export function ProductCard({ product, onAddToCart }) {
  const [, navigate] = useLocation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleWishlistClick = async (event) => {
    event.stopPropagation();
    const succeeded = await toggleWishlist(product);
    if (!succeeded) {
      navigate('/login');
    }
  };

  const getBadgeClass = (badge) => {
    const baseClass = 'absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md';
    switch (badge) {
      case 'New':
        return `${baseClass} bg-blue-500/80 text-white`;
      case 'Hot':
        return `${baseClass} bg-red-500/80 text-white`;
      case 'Sale':
        return `${baseClass} bg-green-500/80 text-white`;
      case 'Limited':
        return `${baseClass} bg-purple-500/80 text-white`;
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <GlassCard variant="default" hover className="h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0B143D] to-[#111A4A] aspect-square rounded-xl mb-4">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Badge */}
          {product.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={getBadgeClass(product.badge)}
            >
              {product.badge === 'New' && <Sparkles className="w-3 h-3 inline mr-1" />}
              {product.badge}
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistClick}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-4 right-4 bg-[#050B2D]/60 backdrop-blur-md p-2 rounded-full hover:bg-[#00E5D4]/20 hover:text-[#00E5D4] transition-all border border-white/10 ${
              inWishlist ? 'text-[#00E5D4]' : 'text-white/70'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#00E5D4]' : ''}`} />
          </motion.button>

          {/* Price Badge - Floating */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-[#00E5D4] to-[#06B6D4] text-[#050B2D] px-3 py-1 rounded-full font-bold text-sm shadow-lg shadow-[#00E5D4]/50"
          >
            ${product.price}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-[#A0AEC0] font-semibold tracking-widest uppercase mb-2">
            {product.category}
          </p>

          <h3 className="font-display text-base font-semibold text-white group-hover:text-[#00E5D4] transition-colors line-clamp-2 mb-3">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Star
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#FFD93D] text-[#FFD93D]'
                        : 'text-[#64748B]'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-[#A0AEC0]">({product.reviews})</span>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 20 ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs text-green-300 font-medium">In Stock</span>
              </div>
            ) : product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-yellow-300 font-medium">Low Stock ({product.stock})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-red-300 font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.div className="mt-auto">
            <NeonButton
              variant="primary"
              size="sm"
              fullWidth
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart && onAddToCart(product);
              }}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </NeonButton>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
