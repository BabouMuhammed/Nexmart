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
  Star,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import {
  getProductById,
  getProducts,
  getProductReviews,
  createReview,
} from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [location, navigate] = useLocation();
  const productId = location.split('/').pop();

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { user } = useAuth();
  const { addItemToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data);
      setReviewsLoading(false);
    };
    loadReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    setError('');

    try {
      await addItemToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Unable to add item to cart. Please sign in and try again.');
    }
  };

  const handleWishlistClick = async () => {
    const succeeded = await toggleWishlist(product);
    if (!succeeded) {
      navigate('/login');
    }
  };

  const handleOpenReviewForm = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewError('');
    setReviewSuccess(false);
    setShowReviewForm((prev) => !prev);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const newReview = await createReview(productId, reviewForm);
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccess(true);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to submit your review. Please try again.';
      setReviewError(message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050B2D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

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
                {error && (
                  <p className="text-sm text-red-400 mt-2">{error}</p>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleWishlistClick}
                    aria-pressed={inWishlist}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                      inWishlist
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                        : 'border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#8B5CF6]' : ''}`} />
                    {inWishlist ? 'Wishlisted' : 'Wishlist'}
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
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white"
            >
              Customer Reviews
            </motion.h2>
            <NeonButton variant="secondary" size="sm" onClick={handleOpenReviewForm}>
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </NeonButton>
          </div>

          {reviewSuccess && (
            <GlassCard className="mb-8 border border-green-500/30">
              <p className="text-green-300 text-sm">Your review was submitted. Thanks!</p>
            </GlassCard>
          )}

          {showReviewForm && (
            <GlassCard className="mb-8">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#A0AEC0] mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'fill-[#FFD93D] text-[#FFD93D]'
                              : 'text-[#64748B]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#A0AEC0] mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-[#050B2D] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00E5D4] outline-none"
                    placeholder="Sum up your experience"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A0AEC0] mb-2">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    className="w-full bg-[#050B2D] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00E5D4] outline-none resize-none"
                    placeholder="What did you like or dislike?"
                  />
                </div>

                {reviewError && <p className="text-sm text-red-400">{reviewError}</p>}

                <NeonButton type="submit" variant="primary" disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </NeonButton>
              </form>
            </GlassCard>
          )}

          {reviewsLoading ? (
            <p className="text-[#A0AEC0]">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-[#A0AEC0]">No reviews yet. Be the first to review this product.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {reviews.map((review) => (
                <GlassCard key={review._id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5D4] to-[#8B5CF6] overflow-hidden flex items-center justify-center text-white font-semibold">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.user?.name?.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-[#A0AEC0]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} showValue={false} />
                  <p className="font-semibold text-white mt-3 text-sm">{review.title}</p>
                  <p className="text-[#A0AEC0] mt-1 text-sm">{review.comment}</p>
                </GlassCard>
              ))}
            </motion.div>
          )}
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
