import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Package,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { DashboardCard } from '../components/DashboardCard';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Electronics',
    badge: 'None',
    description: '',
  });
  const [imageFiles, setImageFiles] = useState([]); // File objects to upload
  const [imagePreviews, setImagePreviews] = useState([]); // object URLs for preview
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const prods = await getAdminProducts();
      setProducts(prods);
    };
    loadProducts();
  }, []);

  // Clean up preview object URLs when they change or the component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 20).length,
  };

  const resetImageState = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: 'Electronics',
      badge: 'None',
      description: '',
    });
    resetImageState();
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      badge: product.badge || 'None',
      description: product.description,
    });
    resetImageState();
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(files);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveProduct = async () => {
    setError('');

    if (!selectedProduct && imageFiles.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      badge: formData.badge === 'None' ? '' : formData.badge,
    };

    if (imageFiles.length > 0) {
      productPayload.images = imageFiles;
    }

    try {
      if (selectedProduct) {
        const updated = await updateProduct(selectedProduct._id, productPayload);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === updated._id ? updated : product
          )
        );
      } else {
        const created = await createProduct(productPayload);
        setProducts((prev) => [created, ...prev]);
      }
      setShowModal(false);
      resetImageState();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Unable to save product. Please try again.');
    }
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setError('');
    try {
      await deleteProduct(selectedProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Unable to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050B2D] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-[#050B2D] border-b border-[rgba(0,229,212,0.1)] px-8 py-4 flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <NeonButton
            variant="primary"
            size="md"
            onClick={handleAddProduct}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </NeonButton>
        </motion.div>

        <div className="p-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <DashboardCard
              title="Total Products"
              value={stats.total}
              change={5.2}
              icon={Package}
              accent="cyan"
            />
            <DashboardCard
              title="In Stock"
              value={stats.inStock}
              change={2.1}
              icon={Package}
              accent="purple"
            />
            <DashboardCard
              title="Low Stock"
              value={stats.lowStock}
              change={-1.5}
              icon={AlertCircle}
              accent="cyan"
            />
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
              />
            </div>
            <NeonButton variant="secondary" size="md" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </NeonButton>
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,229,212,0.1)]">
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 text-[#A0AEC0] font-semibold">
                        Rating
                      </th>
                      <th className="text-center py-3 px-4 text-[#A0AEC0] font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product._id}
                        whileHover={{ backgroundColor: 'rgba(0,229,212,0.05)' }}
                        className="border-b border-[rgba(0,229,212,0.1)] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-[#A0AEC0]">
                                {product.description.substring(0, 30)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#A0AEC0] text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#00E5D4] font-semibold">
                            ${product.price}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-semibold ${
                              product.stock > 20
                                ? 'text-green-400'
                                : product.stock > 0
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#FFD93D]">
                            ★ {product.rating}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={() => handleEditProduct(product)}
                              className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-[#00E5D4]" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2 hover:bg-[#0B143D] rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0B143D] rounded-2xl p-8 max-w-md w-full border border-[rgba(0,229,212,0.2)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-[#111A4A] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#A0AEC0]" />
                </button>
              </div>

              <form className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Product Image{selectedProduct ? ' (unchanged unless replaced)' : ''}
                  </label>

                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {imagePreviews.map((src, index) => (
                        <div key={src} className="relative group">
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-[rgba(0,229,212,0.2)]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-[rgba(0,229,212,0.3)] rounded-lg cursor-pointer hover:border-[#00E5D4] transition-colors">
                      <Upload className="w-5 h-5 text-[#A0AEC0]" />
                      <span className="text-xs text-[#A0AEC0]">
                        Click to upload image(s)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E5D4]"
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Sports</option>
                  <option>Beauty</option>
                  <option>Gaming</option>
                </select>
                <select
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E5D4]"
                >
                  <option>None</option>
                  <option>New</option>
                  <option>Hot</option>
                  <option>Sale</option>
                  <option>Limited</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-[#050B2D] border border-[rgba(0,229,212,0.2)] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4] resize-none"
                  rows="3"
                />

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <div className="flex gap-3 pt-4">
                  <NeonButton
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleSaveProduct}
                  >
                    Save
                  </NeonButton>
                  <NeonButton
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </NeonButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0B143D] rounded-2xl p-8 max-w-sm w-full border border-[rgba(0,229,212,0.2)] text-center"
            >
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Delete Product?</h2>
              <p className="text-[#A0AEC0] mb-6">
                Are you sure you want to delete {selectedProduct?.name}? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <NeonButton
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={handleConfirmDelete}
                >
                  Delete
                </NeonButton>
                <NeonButton
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
