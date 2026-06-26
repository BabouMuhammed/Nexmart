import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NeonButton } from './NeonButton';

export function LuxuryHero({
  badge,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  layout = 'default',
  className = '',
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00E5D4] rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#8B5CF6] rounded-full blur-3xl opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid grid-cols-1 ${image ? 'lg:grid-cols-2' : ''} gap-12 items-center`}
        >
          {/* Content */}
          <motion.div variants={itemVariants}>
            {badge && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E5D4]/10 border border-[#00E5D4]/30 mb-6 w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-[#00E5D4]" />
                <span className="text-sm font-semibold text-[#00E5D4]">{badge}</span>
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-[#00E5D4] font-light mb-6"
              >
                {subtitle}
              </motion.p>
            )}

            {description && (
              <motion.p
                variants={itemVariants}
                className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg"
              >
                {description}
              </motion.p>
            )}

            {(primaryCTA || secondaryCTA) && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                {primaryCTA && (
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={primaryCTA.onClick}
                    className="gap-2"
                  >
                    {primaryCTA.label}
                    <ArrowRight className="w-5 h-5" />
                  </NeonButton>
                )}
                {secondaryCTA && (
                  <NeonButton
                    variant="secondary"
                    size="lg"
                    onClick={secondaryCTA.onClick}
                  >
                    {secondaryCTA.label}
                  </NeonButton>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Image */}
          {image && (
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="rounded-2xl overflow-hidden border border-[#00E5D4]/20"
              >
                <img
                  src={image}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-10 -right-10 w-40 h-40 border border-[#00E5D4]/20 rounded-full pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-10 -left-10 w-32 h-32 border border-[#8B5CF6]/20 rounded-full pointer-events-none"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
