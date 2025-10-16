import axios from 'axios';

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001';
const SEGMENT_SERVICE_URL = import.meta.env.VITE_SEGMENT_SERVICE_URL || 'http://localhost:3002';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const syncProducts = async () => {
  try {
    const response = await axios.post(`${PRODUCT_SERVICE_URL}/api/products/sync`);
    return response.data;
  } catch (error) {
    console.error('Error syncing products:', error);
    throw new Error('Failed to sync products');
  }
};

export const evaluateSegment = async (rules) => {
  try {
    const response = await axios.post(`${SEGMENT_SERVICE_URL}/api/segments/evaluate`, {
      rules
    });
    return response.data;
  } catch (error) {
    console.error('Error evaluating segment:', error);
    throw new Error(error.response?.data?.error || 'Failed to evaluate segment');
  }
};