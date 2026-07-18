import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (config.data instanceof FormData) {
    // Let axios set multipart/form-data headers automatically
    const { 'Content-Type': _, ...rest } = config.headers || {};
    config.headers = rest;
  } else {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  return config;
});

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const STATUS_COLORS = {
  pending: '#FACC15',
  processing: '#38BDF8',
  shipped: '#A78BFA',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

function normalizeProduct(product) {
  if (!product) return null;

  return {
    ...product,
    image: product.image || product.images?.[0]?.url || PLACEHOLDER_IMAGE,
    rating: product.rating ?? product.ratings?.average ?? 0,
    reviews: product.reviews ?? product.ratings?.count ?? 0,
    badge:
      product.badge ??
      (product.isFeatured ? 'Featured' : product.discountPrice ? 'Sale' : undefined),
  };
}

function normalizeOrder(order) {
  return {
    _id: order._id,
    customerName: order.user?.name || order.customerName || 'Unknown',
    customerCity: order.shippingAddress?.city || order.customerCity || '',
    status: order.status || order.orderStatus || 'pending',
    total: order.total ?? order.totalPrice ?? 0,
    date:
      order.date ||
      (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''),
    items: (order.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
    })),
  };
}

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Request failed';
}

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get('/api/products', {
      params: { limit: 100, ...params },
    });
    return (data.products || []).map(normalizeProduct);
  } catch (error) {
    console.error('getProducts failed:', getErrorMessage(error));
    return [];
  }
}

export async function getCategories() {
  const products = await getProducts();
  const counts = {};

  products.forEach((product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });

  return Object.entries(counts).map(([name, productCount], index) => ({
    _id: `cat-${index}`,
    name,
    productCount,
  }));
}

export async function getProductById(id) {
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return normalizeProduct(data);
  } catch (error) {
    console.error('getProductById failed:', getErrorMessage(error));
    return null;
  }
}

export async function getUserOrders() {
  try {
    const { data } = await api.get('/api/orders/my');
    return (data || []).map(normalizeOrder);
  } catch (error) {
    console.error('getUserOrders failed:', getErrorMessage(error));
    return [];
  }
}

export async function getAdminUsers() {
  try {
    const { data } = await api.get('/api/admin/users');
    return data || [];
  } catch (error) {
    console.error('getAdminUsers failed:', getErrorMessage(error));
    return [];
  }
}

export async function getAdminOrders() {
  try {
    const { data } = await api.get('/api/admin/orders');
    return (data || []).map(normalizeOrder);
  } catch (error) {
    console.error('getAdminOrders failed:', getErrorMessage(error));
    return [];
  }
}

export async function getAdminProducts() {
  return getProducts();
}

// Replace the existing createProduct function in services/api.js with this:

export async function createProduct(productData) {
  try {
    let payload = productData;

    // If images were attached, build multipart FormData instead of plain JSON
    if (productData.images && productData.images.length > 0) {
      const form = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file) => form.append('images', file));
        } else {
          form.append(key, value);
        }
      });
      payload = form;
    }

    const { data } = await api.post('/api/products', payload);
    return normalizeProduct(data);
  } catch (error) {
    console.error('createProduct failed:', getErrorMessage(error));
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    let payload = productData;

    // If images were attached, send multipart FormData like createProduct
    if (productData.images && productData.images.length > 0) {
      const form = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file) => form.append('images', file));
        } else {
          form.append(key, value);
        }
      });
      payload = form;
    }

    const { data } = await api.put(`/api/products/${productId}`, payload);
    return normalizeProduct(data);
  } catch (error) {
    console.error('updateProduct failed:', getErrorMessage(error));
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const { data } = await api.delete(`/api/products/${productId}`);
    return data;
  } catch (error) {
    console.error('deleteProduct failed:', getErrorMessage(error));
    throw error;
  }
}

export async function updateOrderStatus(orderId, orderStatus) {
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/status`, {
      orderStatus,
    });
    return normalizeOrder(data);
  } catch (error) {
    console.error('updateOrderStatus failed:', getErrorMessage(error));
    throw error;
  }
}

export async function getAdminStats() {
  try {
    const { data } = await api.get('/api/admin/stats');
    return {
      totalRevenue: data.totalRevenue || 0,
      revenueGrowth: 0,
      totalOrders: data.totalOrders || 0,
      ordersGrowth: 0,
      totalProducts: data.totalProducts || 0,
      productsGrowth: 0,
      totalCustomers: data.totalUsers || 0,
      customersGrowth: 0,
    };
  } catch (error) {
    console.error('getAdminStats failed:', error.response?.status, error.response?.data);
    return {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      ordersGrowth: 0,
      totalProducts: 0,
      productsGrowth: 0,
      totalCustomers: 0,
      customersGrowth: 0,
    };
  }
}
export async function getRevenueData() {
  try {
    const { data } = await api.get('/api/admin/stats');
    return (data.monthlyRevenue || []).map((item) => ({
      month: MONTH_NAMES[item._id.month - 1] || 'N/A',
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    }));
  } catch (error) {
    console.error('getRevenueData failed:', getErrorMessage(error));
    return [];
  }
}

export async function getOrderStatusData() {
  try {
    const { data } = await api.get('/api/admin/stats');
    return (data.ordersByStatus || []).map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      fill: STATUS_COLORS[item._id] || '#64748B',
    }));
  } catch (error) {
    console.error('getOrderStatusData failed:', getErrorMessage(error));
    return [];
  }
}

export async function getMonthlyOrdersData() {
  try {
    const { data } = await api.get('/api/admin/stats');
    return (data.monthlyRevenue || []).map((item) => ({
      month: MONTH_NAMES[item._id.month - 1] || 'N/A',
      orders: item.orders || 0,
    }));
  } catch (error) {
    console.error('getMonthlyOrdersData failed:', getErrorMessage(error));
    return [];
  }
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return {
    token: data.token,
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
    },
  };
}

export async function register(name, email, password, role) {
  const { data } = await api.post('/api/auth/register', { name, email, password, role });
  return {
    token: data.token,
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
    },
  };
}

export async function getCart() {
  const { data } = await api.get('/api/cart');
  return data;
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post('/api/cart', { productId, quantity });
  return data;
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await api.put(`/api/cart/${itemId}`, { quantity });
  return data;
}

export async function removeFromCart(itemId) {
  const { data } = await api.delete(`/api/cart/${itemId}`);
  return data;
}



export async function createOrder(orderData) {
  const { data } = await api.post('/api/orders', orderData);
  return data;
}
export async function getMe() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

// ─── Reviews ──────────────────────────────────────────────────

export async function getProductReviews(productId) {
  try {
    const { data } = await api.get(`/api/reviews/${productId}`);
    return data || [];
  } catch (error) {
    console.error('getProductReviews failed:', getErrorMessage(error));
    return [];
  }
}

export async function createReview(productId, { rating, title, comment }) {
  // Let this one throw — the caller needs the specific error message
  // (e.g. "you can only review products you've purchased and received")
  const { data } = await api.post(`/api/reviews/${productId}`, {
    rating,
    title,
    comment,
  });
  return data;
}

export async function deleteReview(reviewId) {
  const { data } = await api.delete(`/api/reviews/${reviewId}`);
  return data;
}

// ─── Wishlist ─────────────────────────────────────────────────

export async function getWishlist() {
  try {
    const { data } = await api.get('/api/wishlist');
    return (data || []).map(normalizeProduct);
  } catch (error) {
    console.error('getWishlist failed:', getErrorMessage(error));
    return [];
  }
}

export async function addToWishlist(productId) {
  const { data } = await api.post(`/api/wishlist/${productId}`);
  return (data || []).map(normalizeProduct);
}

export async function removeFromWishlist(productId) {
  const { data } = await api.delete(`/api/wishlist/${productId}`);
  return (data || []).map(normalizeProduct);
}
