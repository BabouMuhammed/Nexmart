import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  X,
  Printer,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { DashboardCard } from '../components/DashboardCard';
import { StatusBadge } from '../components/StatusBadge';
import { getAdminOrders } from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const o = await getAdminOrders();
      setOrders(o);
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-[#050B2D] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-[#050B2D] border-b border-[rgba(0,229,212,0.1)] px-8 py-4"
        >
          <h1 className="text-2xl font-bold text-white">Orders</h1>
        </motion.div>

        <div className="p-8">
          {/* Status Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            {[
              { status: 'all', label: 'All Orders', icon: ShoppingCart },
              { status: 'pending', label: 'Pending', icon: AlertCircle },
              { status: 'processing', label: 'Processing', icon: ShoppingCart },
              { status: 'shipped', label: 'Shipped', icon: ShoppingCart },
              { status: 'delivered', label: 'Delivered', icon: ShoppingCart },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.status}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedStatus(item.status)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedStatus === item.status
                      ? 'bg-[#00E5D4] text-[#050B2D]'
                      : 'glass hover:bg-[#0B143D]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <p className="text-xs opacity-75">{item.label}</p>
                      <p className="font-bold text-lg">
                        {statusCounts[item.status]}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
              />
            </div>
            <NeonButton variant="secondary" size="md" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </NeonButton>
          </motion.div>

          {/* Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,229,212,0.1)]">
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Date
                      </th>
                      <th className="text-center py-3 px-4 text-[#A0AEC0] font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order._id}
                        whileHover={{ backgroundColor: 'rgba(0,229,212,0.05)' }}
                        className="border-b border-[rgba(0,229,212,0.1)] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono text-[#00E5D4] text-sm">
                            {order._id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-[#A0AEC0]">
                              {order.customerCity}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#A0AEC0] text-sm">
                            {order.items.length} item(s)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#00E5D4] font-semibold">
                            ${order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#00E5D4]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-[#A0AEC0] text-sm">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            onClick={() => handleViewOrder(order)}
                            className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#00E5D4]" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Order Details Drawer */}
      <AnimatePresence>
        {showDrawer && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-96 bg-[#050B2D] border-l border-[rgba(0,229,212,0.1)] z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Order Details</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowDrawer(false)}
                    className="p-1 hover:bg-[#0B143D] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#A0AEC0]" />
                  </motion.button>
                </div>

                {/* Order Info */}
                <GlassCard className="mb-6">
                  <p className="text-sm text-[#A0AEC0] mb-1">Order ID</p>
                  <p className="font-mono text-[#00E5D4] font-bold mb-4">
                    {selectedOrder._id}
                  </p>

                  <p className="text-sm text-[#A0AEC0] mb-1">Customer</p>
                  <p className="text-white font-semibold mb-4">
                    {selectedOrder.customerName}
                  </p>

                  <p className="text-sm text-[#A0AEC0] mb-1">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </GlassCard>

                {/* Items */}
                <h3 className="text-lg font-bold text-white mb-4">Items</h3>
                <div className="space-y-3 mb-6">
                  {selectedOrder.items.map((item, i) => (
                    <GlassCard key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#A0AEC0]">Qty: {item.qty}</p>
                        </div>
                        <p className="text-[#00E5D4] font-bold">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>

                {/* Shipping Address */}
                <h3 className="text-lg font-bold text-white mb-4">
                  Shipping Address
                </h3>
                <GlassCard className="mb-6">
                  <p className="text-[#A0AEC0] text-sm leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                </GlassCard>

                {/* Total */}
                <GlassCard className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-[#00E5D4]">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </GlassCard>

                {/* Actions */}
                <div className="space-y-3">
                  <NeonButton
                    variant="secondary"
                    size="md"
                    fullWidth
                    className="gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </NeonButton>
                  <NeonButton
                    variant="danger"
                    size="md"
                    fullWidth
                  >
                    Cancel Order
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
