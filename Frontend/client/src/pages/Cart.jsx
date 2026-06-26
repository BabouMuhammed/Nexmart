import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      _id: '1',
      name: 'Quantum Headphones Pro',
      category: 'Electronics',
      price: 299.99,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    },
    {
      _id: '2',
      name: 'Premium Sneakers X1',
      category: 'Fashion',
      price: 159.99,
      qty: 2,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    },
  ]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [, navigate] = useLocation();

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty > 0) {
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, qty } : item))
      );
    }
  };

  const applyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050B2D]">
        <Navbar cartCount={0} />
        <section className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-[#A0AEC0] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-[#A0AEC0] mb-8">Start shopping to add items to your cart</p>
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/shop')}
              className="gap-2"
            >
              Browse Shop
              <ArrowRight className="w-5 h-5" />
            </NeonButton>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={cartItems.length} />

      {/* Page Header */}
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white"
          >
            Shopping Cart
          </motion.h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass rounded-2xl p-4 mb-4 flex gap-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#A0AEC0] mb-1">{item.category}</p>
                      <h3 className="font-bold text-white mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[#00E5D4] font-semibold">${item.price}</p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-[#0B143D] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#00E5D4]/20 rounded transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-white text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.qty + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#00E5D4]/20 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-[#A0AEC0] mb-1">Subtotal</p>
                      <p className="font-bold text-white">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-3 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                    />
                    <NeonButton
                      variant="secondary"
                      size="sm"
                      onClick={applyPromo}
                    >
                      Apply
                    </NeonButton>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-green-400">✓ Promo code applied!</p>
                  )}
                </div>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(0,229,212,0.1)]">
                  <div className="flex justify-between text-[#A0AEC0]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#A0AEC0]">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#00E5D4]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Shipping Hint */}
                {shipping > 0 && (
                  <p className="text-xs text-[#A0AEC0] mb-6 text-center">
                    Add ${(99 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/checkout')}
                    className="gap-2"
                  >
                    Checkout
                    <ArrowRight className="w-5 h-5" />
                  </NeonButton>
                  <NeonButton
                    variant="ghost"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/shop')}
                  >
                    Continue Shopping
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
