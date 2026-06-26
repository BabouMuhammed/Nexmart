import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Edit2, Trash2, Crown } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { DashboardCard } from '../components/DashboardCard';
import { getAdminUsers } from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const loadUsers = async () => {
      const u = await getAdminUsers();
      setUsers(u);
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    customers: users.filter((u) => u.role === 'customer').length,
  };

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
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
          <h1 className="text-2xl font-bold text-white">Users</h1>
        </motion.div>

        <div className="p-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <DashboardCard
              title="Total Users"
              value={stats.total}
              change={8.5}
              icon={Users}
              accent="cyan"
            />
            <DashboardCard
              title="Admins"
              value={stats.admins}
              change={2.1}
              icon={Shield}
              accent="purple"
            />
            <DashboardCard
              title="Customers"
              value={stats.customers}
              change={6.4}
              icon={Users}
              accent="cyan"
            />
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
              />
            </div>

            {/* Role Tabs */}
            <div className="flex gap-2">
              {['all', 'admins', 'customers'].map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    setSelectedRole(role === 'all' ? 'all' : role.slice(0, -1))
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    (role === 'all' && selectedRole === 'all') ||
                    (role !== 'all' && selectedRole === role.slice(0, -1))
                      ? 'bg-[#00E5D4] text-[#050B2D]'
                      : 'bg-[#0B143D] text-[#A0AEC0] hover:bg-[#111A4A]'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Users Table */}
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
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Joined
                      </th>
                      <th className="text-center py-3 px-4 text-[#A0AEC0] font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user._id}
                        whileHover={{ backgroundColor: 'rgba(0,229,212,0.05)' }}
                        className="border-b border-[rgba(0,229,212,0.1)] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-white text-sm flex items-center gap-2">
                                {user.name}
                                {user.role === 'admin' && (
                                  <Crown className="w-4 h-4 text-[#FFD93D]" />
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#A0AEC0] text-sm">
                            {user.email}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                                : 'bg-[#00E5D4]/20 text-[#00E5D4]'
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#A0AEC0] text-sm">
                            {user.joinedDate}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={() =>
                                handleToggleRole(user._id, user.role)
                              }
                              className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                              title="Toggle Role"
                            >
                              <Shield className="w-4 h-4 text-[#00E5D4]" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-[#8B5CF6]" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
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
    </div>
  );
}
