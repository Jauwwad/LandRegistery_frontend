import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://landregistry-backend.onrender.com/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Land API
export const landAPI = {
  // Get all lands with filters
  getLands: (params = {}) => api.get('/lands/', { params }),
  
  // Get specific land
  getLand: (id) => api.get(`/lands/${id}`),
  
  // Register new land
  registerLand: (landData) => api.post('/lands/', landData),
  
  // Register land on blockchain
  registerOnBlockchain: (id) => api.post(`/lands/${id}/register-blockchain`),
  
  // Transfer land
  transferLand: (id, transferData) => api.post(`/lands/${id}/transfer`, transferData),
  
  // Verify land (admin only)
  verifyLand: (id, verificationData) => api.post(`/lands/${id}/verify`, verificationData),
  
  // Get map data
  getMapData: (bounds) => api.get('/lands/map-data', { params: { bounds } }),
  
  // Get statistics
  getStatistics: () => api.get('/lands/statistics'),
};

// Admin API
export const adminAPI = {
  // Dashboard data
  getDashboard: () => api.get('/admin/dashboard'),
  
  // User management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.post(`/admin/users/${id}/toggle-status`),
  
  // Land management
  getPendingLands: (params = {}) => api.get('/admin/lands/pending', { params }),
  reviewLand: (id, reviewData) => api.post(`/admin/lands/${id}/review`, reviewData),
  
  // Transfer management
  getTransfers: (params = {}) => api.get('/admin/transfers', { params }),
  
  // Blockchain status
  getBlockchainStatus: () => api.get('/admin/blockchain/status'),
  
  // Reports
  getLandDistributionReport: () => api.get('/admin/reports/land-distribution'),
  
  // System info
  getSystemInfo: () => api.get('/admin/system/info'),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: (type) => api.post('/auth/demo-login', { type }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatArea = (area) => {
  return `${area?.toLocaleString()} sq m`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

export const getPropertyTypeColor = (type) => {
  switch (type) {
    case 'residential':
      return '#2196f3';
    case 'commercial':
      return '#ff9800';
    case 'agricultural':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};

export default api;