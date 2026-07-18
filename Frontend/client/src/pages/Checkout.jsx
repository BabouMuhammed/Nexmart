import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { getCart, createOrder } from '../services/api';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart.items || []);
      } catch (err) {
        console.error('Failed to load cart', err);
      }
    };
    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state || formData.city,
          zipCode: formData.zip,
          country: formData.country,
        },
        paymentMethod: 'cash_on_delivery',
      };
      const result = await createOrder(orderData);
      setOrderId(result.order?._id || result._id);
      setOrderPlaced(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#050B2D]">
        <Navbar cartCount={0} />
        <section className="pt-32 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Order Placed!</h2>
            <p className="text-[#A0AEC0] mb-2 max-w-md">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            {orderId && (
              <p className="text-[#00E5D4] font-mono text-sm mb-8">
                Order ID: {orderId}
              </p>
            )}
            <div className="space-y-3">
              <NeonButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                View My Orders
              </NeonButton>
              <NeonButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </NeonButton>
            </div>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={cartItems.length} />

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-12"
          >
            Checkout
          </motion.h1>

          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-[#00E5D4]' : 'bg-[#0B143D]'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                      />
                      <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                        <input
                          type="text"
                          name="zip"
                          placeholder="ZIP Code"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Payment Method
                    </h2>
                    <div className="p-4 border border-[#00E5D4] rounded-lg bg-[#0B143D]">
                      <p className="text-white font-semibold">Cash on Delivery</p>
                      <p className="text-[#A0AEC0] text-sm mt-1">
                        Pay when your order arrives
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-6 text-[#A0AEC0]">
                      <Lock className="w-4 h-4 text-[#00E5D4]" />
                      <span className="text-sm">Secured by SSL</span>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Order Review
                    </h2>
                    <div className="space-y-4">
                      {cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-4 pb-4 border-b border-[rgba(0,229,212,0.1)]"
                        >
                          <img
                            src={
                              item.product?.images?.[0]?.url ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
                            }
                            alt={item.product?.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-[#A0AEC0]">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-[#00E5D4]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {error && <p className="text-red-400 mt-4">{error}</p>}
                  </GlassCard>
                </motion.div>
              )}

              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <NeonButton
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(step - 1)}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </NeonButton>
                )}
                {step < 3 && (
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(step + 1)}
                    className="gap-2 ml-auto"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </NeonButton>
                )}
                {step === 3 && (
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="gap-2 ml-auto"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                    <Check className="w-5 h-5" />
                  </NeonButton>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(0,229,212,0.1)]">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#A0AEC0]">
                        {item.product?.name} x{item.quantity}
                      </span>
                      <span className="text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(0,229,212,0.1)]">
                  <div className="flex justify-between text-[#A0AEC0]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#A0AEC0]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A0AEC0]">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#00E5D4]">
                    ${total.toFixed(2)}
                  </span>
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