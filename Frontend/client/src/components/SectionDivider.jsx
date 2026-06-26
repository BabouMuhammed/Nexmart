import { motion } from 'framer-motion';

export function SectionDivider({ variant = 'gradient', className = '' }) {
  const variants = {
    gradient: (
      <div className={`h-1 bg-gradient-to-r from-transparent via-[#00E5D4] to-transparent ${className}`} />
    ),
    dots: (
      <div className={`flex justify-center gap-2 py-8 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#00E5D4]"
          />
        ))}
      </div>
    ),
    line: (
      <div className={`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`} />
    ),
    svg: (
      <svg
        className={`w-full h-16 ${className}`}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q360,0 720,50 T1440,50 L1440,120 L0,120 Z"
          fill="rgba(0,229,212,0.05)"
        />
      </svg>
    ),
  };

  return variants[variant];
}
