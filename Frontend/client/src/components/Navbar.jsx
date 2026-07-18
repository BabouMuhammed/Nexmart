import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, ShoppingCart, Menu, X, LogIn, Home, Store, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { NeonButton } from './NeonButton';
import { useCart } from '../contexts/CartContext';

export function Navbar({ cartCount: propCartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [, navigate] = useLocation();
  const effectiveCartCount = cartCount ?? propCartCount;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Store },
    { label: 'Dashboard', href: '/dashboard', icon: User },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050B2D]/80 backdrop-blur-xl border-b border-[#00E5D4]/10'
          : 'bg-gradient-to-r from-[#00E5D4] via-[#06B6D4] to-[#8B5CF6]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className={`p-2 rounded-lg ${
                isScrolled
                  ? 'bg-[#00E5D4]/10 text-[#00E5D4]'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
            <span
              className={`text-xl font-display font-bold hidden sm:inline ${
                isScrolled ? 'text-white' : 'text-white'
              }`}
            >
              NexMart
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`flex items-center gap-2 font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-white/70 hover:text-[#00E5D4]'
                      : 'text-white/90 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className={`p-2 rounded-lg transition-all ${
                isScrolled
                  ? 'hover:bg-[#00E5D4]/20 text-white'
                  : 'hover:bg-white/20 text-white'
              }`}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate('/cart')}
              className={`relative p-2 rounded-lg transition-all ${
                isScrolled
                  ? 'hover:bg-[#00E5D4]/20 text-white'
                  : 'hover:bg-white/20 text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {effectiveCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00E5D4] text-[#050B2D] text-xs font-bold flex items-center justify-center"
                >
                  {effectiveCartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Login Button */}
            <NeonButton
              variant={isScrolled ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate('/login')}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </NeonButton>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#00E5D4]/10 bg-[#050B2D]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={link.href}
                      onClick={() => {
                        navigate(link.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:text-[#00E5D4] hover:bg-[#0B143D] transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
