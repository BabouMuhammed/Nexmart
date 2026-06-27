import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, MessageSquare, Edit2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { DashboardCard } from '../components/DashboardCard';
import { StatusBadge } from '../components/StatusBadge';
import { ProductCard } from '../components/ProductCard';
import { getUserOrders, getProducts, getMe } from '../services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', memberSince: '' });

  useEffect(() => {
    const loadData = async () => {
      const userOrders = await getUserOrders();
      setOrders(userOrders);

      const products = await getProducts();
      setWishlistItems(products.slice(0, 3));

      const me = await getMe();
      if (me) {
        setUser({
          name: me.name,
          email: me.email,
          memberSince: new Date(me.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
        });
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={0} />

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white"
          >
            My Dashboard
          </motion.h1>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                  <p className="text-[#A0AEC0] mb-2">{user.email}</p>
                  <p className="text-sm text-[#64748B]">Member since {user.memberSince}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#00E5D4]">
                  <span className="text-xs font-bold text-white">Premium</span>
                </div>
                <NeonButton variant="secondary" size="sm" onClick={() => setEditMode(!editMode)} className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Total Orders" value={orders.length} icon={ShoppingBag} accent="cyan" />
            <DashboardCard title="Wishlist Items" value={wishlistItems.length} icon={Heart} accent="purple" />
            <DashboardCard title="Reviews Left" value={0} icon={MessageSquare} accent="cyan" />
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-8 border-b border-[rgba(0,229,212,0.1)]">
            {['orders', 'wishlist', 'settings'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === tab ? 'text-[#00E5D4]' : 'text-[#A0AEC0] hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E5D4]" />
                )}
              </motion.button>
            ))}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <GlassCard key={order._id}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-[#A0AEC0] mb-1">
                          Order ID: <span className="font-mono text-[#00E5D4]">{order._id}</span>
                        </p>
                        <p className="font-semibold text-white mb-2">
                          {order.items.map((i) => i.name).join(', ')}
                        </p>
                        <p className="text-sm text-[#A0AEC0]">{order.date} • {order.customerCity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-[#A0AEC0] mb-1">Total</p>
                          <p className="font-bold text-[#00E5D4]">${order.total.toFixed(2)}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                    <input type="text" defaultValue={user.name} disabled={!editMode}
                      className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input type="email" defaultValue={user.email} disabled={!editMode}
                      className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" disabled={!editMode}
                      className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location</label>
                    <input type="text" placeholder="City, Country" disabled={!editMode}
                      className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-3 text-white disabled:opacity-50" />
                  </div>
                  {editMode && (
                    <div className="flex gap-3 pt-4">
                      <NeonButton variant="primary" size="md">Save Changes</NeonButton>
                      <NeonButton variant="ghost" size="md" onClick={() => setEditMode(false)}>Cancel</NeonButton>
                    </div>
                  )}
                </form>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}