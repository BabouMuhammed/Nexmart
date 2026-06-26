import { motion } from 'framer-motion';

export function GlassCard({
  children,
  className = '',
  hover = true,
  variant = 'default',
  glow = 'cyan',
  onClick,
}) {
  const baseStyles = 'rounded-2xl p-6 md:p-8 backdrop-blur-xl transition-all duration-300';

  const variants = {
    default: 'bg-[#0B143D]/60 border border-[#00E5D4]/20 hover:border-[#00E5D4]/40 hover:bg-[#0B143D]/80',
    light: 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20',
    dark: 'bg-[#050B2D]/80 border border-[#00E5D4]/10 hover:border-[#00E5D4]/30',
    elevated: 'bg-[#111A4A]/70 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 shadow-lg',
  };

  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,229,212,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    none: '',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${glowStyles[glow]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
