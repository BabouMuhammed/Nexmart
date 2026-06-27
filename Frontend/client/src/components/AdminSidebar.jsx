import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Zap,
} from 'lucide-react';
import { useLocation } from 'wouter';

export function AdminSidebar() {
  const [location, navigate] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Users', href: '/admin/users' },
  ];

  const isActive = (href) => location === href;

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 w-64 h-screen bg-[#050B2D] border-r border-[rgba(0,229,212,0.1)] flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(0,229,212,0.1)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-[#00E5D4] text-[#050B2D]">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white">NexMart</span>
        </div>
        <div className="inline-block bg-gradient-to-r from-[#8B5CF6] to-[#00E5D4] px-3 py-1 rounded-full text-xs font-bold text-white">
          Admin Panel
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.button
              key={item.href}
              onClick={() => navigate(item.href)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-[#00E5D4] text-[#050B2D]'
                  : 'text-[#A0AEC0] hover:bg-[#0B143D]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="glass rounded-lg p-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5D4] to-[#8B5CF6] mb-3" />
         <p className="text-sm font-semibold text-white">
          {JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'}
         </p>
          <p className="text-xs text-[#A0AEC0]">
           {JSON.parse(localStorage.getItem('user') || '{}').email || ''}
        </p>
      </div>
      <div>
        <motion.button
  whileHover={{ scale: 1.02 }}
  onClick={() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }}
  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-400 transition-all"
>
  <LogOut className="w-4 h-4" />
  <span className="text-sm font-medium">Logout</span>
</motion.button>
       
      </div>
         </motion.aside>
  );
}
