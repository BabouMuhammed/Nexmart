import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features = [],
  image,
  layout = 'vertical',
  variant = 'default',
  className = '',
}) {
  if (layout === 'horizontal') {
    return (
      <GlassCard variant={variant} className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              {Icon && (
                <div className="w-12 h-12 rounded-lg bg-[#00E5D4]/10 border border-[#00E5D4]/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#00E5D4]" />
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">{description}</p>

            {features.length > 0 && (
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-white/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5D4]" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Right: Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden"
            >
              <img src={image} alt={title} className="w-full h-full object-cover rounded-xl" />
            </motion.div>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant={variant} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        {Icon && (
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-16 h-16 rounded-xl bg-[#00E5D4]/10 border border-[#00E5D4]/30 flex items-center justify-center mx-auto mb-4"
          >
            <Icon className="w-8 h-8 text-[#00E5D4]" />
          </motion.div>
        )}
        <h3 className="font-display text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </motion.div>
    </GlassCard>
  );
}
