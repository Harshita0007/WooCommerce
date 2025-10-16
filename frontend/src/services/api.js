
import axios from 'axios';

// Get URLs from environment variables
const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001';
const SEGMENT_SERVICE_URL = import.meta.env.VITE_SEGMENT_SERVICE_URL || 'http://localhost:3002';

// Debug logging (will show in browser console)
console.log('🔧 API Configuration:');
console.log('Product Service URL:', PRODUCT_SERVICE_URL);
console.log('Segment Service URL:', SEGMENT_SERVICE_URL);
console.log('All env vars:', import.meta.env);

// Create axios instances with better error handling
const productAPI = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

const segmentAPI = axios.create({
  baseURL: SEGMENT_SERVICE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
productAPI.interceptors.request.use(
  (config) => {
    console.log('📤 Product API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
productAPI.interceptors.response.use(
  (response) => {
    console.log('✅ Product API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Product API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Same for segment API
segmentAPI.interceptors.request.use(
  (config) => {
    console.log('📤 Segment API Request:', config.method.toUpperCase(), config.url);
    return config;
  }
);

segmentAPI.interceptors.response.use(
  (response) => {
    console.log('✅ Segment API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Segment API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// API Functions
export const getProducts = async () => {
  try {
    console.log('🔄 Fetching products...');
    const response = await productAPI.get('/api/products');
    const products = response.data.data || response.data;
    console.log(`✅ Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    
    // Better error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - backend might be sleeping (Render free tier)');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - check if backend is running');
    }
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found - check backend URL');
    }
    if (error.response?.status === 500) {
      throw new Error('Backend server error - check backend logs');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch products');
  }
};

export const syncProducts = async () => {
  try {
    console.log('🔄 Syncing products from WooCommerce...');
    const response = await productAPI.post('/api/products/sync');
    console.log('✅ Sync completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error syncing products:', error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to sync products');
  }
};

export const evaluateSegment = async (rules) => {
  try {
    console.log('🔄 Evaluating segment with rules:', rules);
    const response = await segmentAPI.post('/api/segments/evaluate', { rules });
    console.log('✅ Segment evaluation completed');
    return response.data;
  } catch (error) {
    console.error('❌ Error evaluating segment:', error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to evaluate segment');
  }
};

// Health check functions
export const checkProductServiceHealth = async () => {
  try {
    const response = await productAPI.get('/health');
    return response.data;
  } catch (error) {
    console.error('Product service health check failed:', error);
    return null;
  }
};

export const checkSegmentServiceHealth = async () => {
  try {
    const response = await segmentAPI.get('/health');
    return response.data;
  } catch (error) {
    console.error('Segment service health check failed:', error);
    return null;
  }
};

// Export for debugging
export const API_CONFIG = {
  PRODUCT_SERVICE_URL,
  SEGMENT_SERVICE_URL
};