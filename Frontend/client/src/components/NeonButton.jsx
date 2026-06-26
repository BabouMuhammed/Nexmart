import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'font-sans font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050B2D]';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#00E5D4] to-[#06B6D4] text-[#050B2D] hover:shadow-lg hover:shadow-[#00E5D4]/50 active:scale-95',
    secondary: 'bg-[#0B143D] border border-[#00E5D4] text-[#00E5D4] hover:bg-[#111A4A] hover:shadow-lg hover:shadow-[#00E5D4]/30 active:scale-95',
    ghost: 'bg-transparent border border-[#A0AEC0] text-[#A0AEC0] hover:bg-[#0B143D] hover:border-[#00E5D4] hover:text-[#00E5D4] active:scale-95',
    danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/30 active:scale-95',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
