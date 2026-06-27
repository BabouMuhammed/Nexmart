import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Search,
  Bell,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AdminSidebar } from '../components/AdminSidebar';
import { GlassCard } from '../components/GlassCard';
import { DashboardCard } from '../components/DashboardCard';
import { StatusBadge } from '../components/StatusBadge';
import { NeonButton } from '../components/NeonButton';
import {
  getAdminStats,
  getRevenueData,
  getOrderStatusData,
  getMonthlyOrdersData,
  getAdminOrders,
} from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [monthlyOrdersData, setMonthlyOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const loadData = async () => {
    try {
      const [s, rd, osd, mod, o] = await Promise.all([
        getAdminStats(),
        getRevenueData(),
        getOrderStatusData(),
        getMonthlyOrdersData(),
        getAdminOrders(),
      ]);
      setStats(s);
      setRevenueData(rd);
      setOrderStatusData(osd);
      setMonthlyOrdersData(mod);
      setOrders(o.slice(0, 5));
    } catch (err) {
      console.error('Dashboard load error:', err);
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        productsGrowth: 0,
        customersGrowth: 0,
      });
    }
  };
  loadData();
}, []);

  if (!stats) {
  return (
    <div className="min-h-screen bg-[#050B2D] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#050B2D] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-[#050B2D] border-b border-[rgba(0,229,212,0.1)] px-8 py-4"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-[#A0AEC0]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-white placeholder-[#64748B] focus:outline-none w-32"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-[#A0AEC0]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-[#A0AEC0]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-8">
          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <DashboardCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={stats.revenueGrowth}
              icon={DollarSign}
              accent="cyan"
            />
            <DashboardCard
              title="Total Orders"
              value={stats.totalOrders.toLocaleString()}
              change={stats.ordersGrowth}
              icon={ShoppingCart}
              accent="purple"
            />
            <DashboardCard
              title="Products"
              value={stats.totalProducts.toLocaleString()}
              change={stats.productsGrowth}
              icon={Package}
              accent="cyan"
            />
            <DashboardCard
              title="Customers"
              value={stats.totalCustomers.toLocaleString()}
              change={stats.customersGrowth}
              icon={Users}
              accent="purple"
            />
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue & Orders Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-6">
                  Revenue & Orders
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,212,0.1)" />
                    <XAxis stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B143D',
                        border: '1px solid rgba(0,229,212,0.2)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#00E5D4' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00E5D4"
                      strokeWidth={2}
                      dot={{ fill: '#00E5D4' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Order Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-6">
                  Order Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B143D',
                        border: '1px solid rgba(0,229,212,0.2)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>
          </div>

          {/* Monthly Orders Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-6">
                Orders per Month
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,212,0.1)" />
                  <XAxis stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B143D',
                      border: '1px solid rgba(0,229,212,0.2)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#00E5D4' }}
                  />
                  <Bar dataKey="orders" fill="#00E5D4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Recent Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>

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
                    {orders.map((order) => (
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
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5D4] to-[#8B5CF6]" />
                            <span className="text-white text-sm">
                              {order.customerName}
                            </span>
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
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4 text-[#A0AEC0] text-sm">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            className="text-[#00E5D4] hover:text-[#06B6D4] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Add Product', icon: Package },
                { label: 'View Orders', icon: ShoppingCart },
                { label: 'Manage Users', icon: Users },
                { label: 'Export Data', icon: DollarSign },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <NeonButton
                    key={i}
                    variant="secondary"
                    size="md"
                    fullWidth
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </NeonButton>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
