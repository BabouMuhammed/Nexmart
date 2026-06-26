import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, List, Search } from 'lucide-react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilterPanel } from '../components/FilterPanel';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { NeonButton } from '../components/NeonButton';
import { getProducts, getCategories } from '../services/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const prods = await getProducts();
      const cats = await getCategories();
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#050B2D]">
      <Navbar cartCount={0} />

      {/* Page Header */}
      <section className="pt-32 pb-12 border-b border-[rgba(0,229,212,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Shop
          </motion.h1>
          <p className="text-[#A0AEC0]">
            Browse our collection of {filteredProducts.length} products
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-gradient-to-b from-[#0B143D] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(0,229,212,0.1)]"
              >
                <p className="text-[#A0AEC0]">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-[#00E5D4] text-[#050B2D]'
                        : 'bg-[#0B143D] text-[#A0AEC0] hover:bg-[#111A4A]'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#00E5D4] text-[#050B2D]'
                        : 'bg-[#0B143D] text-[#A0AEC0] hover:bg-[#111A4A]'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-[#A0AEC0] mb-4">No products found</p>
                  <NeonButton
                    variant="secondary"
                    onClick={handleReset}
                  >
                    Clear Filters
                  </NeonButton>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
