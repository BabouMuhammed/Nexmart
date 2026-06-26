import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';

export function FilterPanel({ categories = [], filters = {}, onChange, onReset }) {
  return (
    <GlassCard className="h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onReset}
          className="text-[#A0AEC0] hover:text-[#00E5D4] transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Category</h4>
        <div className="space-y-2">
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => onChange('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              filters.category === 'all' || !filters.category
                ? 'bg-[#00E5D4] text-[#050B2D] font-semibold'
                : 'text-[#A0AEC0] hover:bg-[#0B143D]'
            }`}
          >
            All Categories
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat._id}
              whileHover={{ x: 4 }}
              onClick={() => onChange('category', cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                filters.category === cat.name
                  ? 'bg-[#00E5D4] text-[#050B2D] font-semibold'
                  : 'text-[#A0AEC0] hover:bg-[#0B143D]'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="flex-1 bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-3 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="flex-1 bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-3 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
          />
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={filters.maxPrice || 500}
          onChange={(e) => onChange('maxPrice', e.target.value)}
          className="w-full accent-[#00E5D4]"
        />
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Sort By</h4>
        <select
          value={filters.sortBy || 'newest'}
          onChange={(e) => onChange('sortBy', e.target.value)}
          className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5D4]"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </GlassCard>
  );
}
