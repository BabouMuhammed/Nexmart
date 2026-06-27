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
    phone: '',
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
      setOrderId(result.order._id);
      setOrderPlaced(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#050B2D]">
        <Navbar cartCount={0} />
        <section className="pt-32 pb-20 flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Order Placed!</h2>
            <p className="text-[#A0AEC0] mb-2 max-w-md">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            {orderId && (
              <p className="text-[#00E5D4] font-mono text-sm mb-8">Order ID: {orderId}</p>
            )}
            <div className="space-y-3">
              <NeonButton variant="primary" size="lg" onClick={() => navigate('/dashboard')} className="gap-2">
                View My Orders
              </NeonButton>
              <NeonButton variant="secondary" size="lg" onClick={() => navigate('/shop')}>
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-12">
            Checkout
          </motion.h1>

          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <motion.div key={s}
                className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-[#00E5D4]' : 'bg-[#0B143D]'}`} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <GlassCard>
                    <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                    <div className="space-y-4">
                      <input type="text" name="fullName" placeholder="Full Name"
                        value={formData.fullName} onChange={handleInputChange}
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]" />
                      <input type="text" name="street" placeholder="Street Address"
                        value={formData.street} onChange={handleInputChange}
                        className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#64748B]