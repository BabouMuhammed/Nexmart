import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    country: '',
    zip: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const cartItems = [
    {
      name: 'Quantum Headphones Pro',
      qty: 1,
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    },
    {
      name: 'Premium Sneakers X1',
      qty: 2,
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    },
  ];

  const subtotal = 619.97;
  const shipping = 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-format card number
    if (name === 'cardNumber') {
      processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
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
            <p className="text-[#A0AEC0] mb-8 max-w-md">
              Thank you for your purchase. Your order has been confirmed and will be
              shipped soon.
            </p>
            <div className="space-y-3">
              <NeonButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                Track Order
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
      <Navbar cartCount={0} />

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-12"
          >
            Checkout
          </motion.h1>

          {/* Step Indicator */}
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
            {/* Form */}
            <div className="lg:col-span-2">
              {/* Step 1 - Shipping */}
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
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="zip"
                          placeholder="ZIP Code"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 2 - Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Payment Information
                    </h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Cardholder Name"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                      />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength="19"
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4] font-mono"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                        <input
                          type="password"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength="4"
                          className="bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6 text-[#A0AEC0]">
                      <Lock className="w-4 h-4 text-[#00E5D4]" />
                      <span className="text-sm">Secured by SSL</span>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 3 - Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">Order Review</h2>
                    <div className="space-y-4">
                      {cartItems.map((item, i) => (
                        <div key={i} className="flex gap-4 pb-4 border-b border-[rgba(0,229,212,0.1)]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-sm text-[#A0AEC0]">Qty: {item.qty}</p>
                          </div>
                          <p className="font-bold text-[#00E5D4]">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Navigation Buttons */}
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
                    className="gap-2 ml-auto"
                  >
                    Place Order
                    <Check className="w-5 h-5" />
                  </NeonButton>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(0,229,212,0.1)]">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#A0AEC0]">
                        {item.name} x{item.qty}
                      </span>
                      <span className="text-white font-semibold">
                        ${(item.price * item.qty).toFixed(2)}
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
                    <span className="text-green-400">FREE</span>
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
