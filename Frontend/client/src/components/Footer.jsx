import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Shop',
      links: ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Gaming'],
    },
    {
      title: 'Account',
      links: ['My Orders', 'Wishlist', 'Settings', 'Profile', 'Reviews'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Contact', 'Blog', 'Careers', 'Press'],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@nexmart.com' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: MapPin, text: 'San Francisco, CA' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-[#050B2D] border-t border-[#00E5D4]/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <motion.h3
              className="font-display text-2xl font-bold text-white mb-4"
              whileHover={{ color: '#00E5D4' }}
            >
              NexMart
            </motion.h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Shop beyond tomorrow with our futuristic e-commerce platform.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    title={social.label}
                    whileHover={{ scale: 1.2, y: -4 }}
                    className="p-2 bg-[#0B143D] border border-[#00E5D4]/20 rounded-lg hover:bg-[#00E5D4]/10 hover:border-[#00E5D4]/50 text-white/70 hover:text-[#00E5D4] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="md:col-span-1"
            >
              <h4 className="font-display text-white font-semibold mb-6 text-lg">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 4 }}
                  >
                    <a
                      href="#"
                      className="text-white/60 hover:text-[#00E5D4] transition-colors text-sm font-medium"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="font-display text-white font-semibold mb-6 text-lg">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-white/60 text-sm hover:text-[#00E5D4] transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <Icon className="w-4 h-4 text-[#00E5D4]" />
                    {info.text}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#00E5D4]/20 to-transparent my-12" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-white/40 text-sm font-light">
            © 2026 NexMart. All rights reserved.
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <motion.a
              href="#"
              className="text-white/40 hover:text-[#00E5D4] text-sm transition-colors font-light"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-white/40 hover:text-[#00E5D4] text-sm transition-colors font-light"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              className="text-white/40 hover:text-[#00E5D4] text-sm transition-colors font-light"
              whileHover={{ y: -2 }}
            >
              Cookie Settings
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00E5D4] rounded-full blur-3xl opacity-3" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full blur-3xl opacity-3" />
      </div>
    </footer>
  );
}
