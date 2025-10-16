const axios = require('axios');
require('dotenv').config();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const SYNC_INTERVAL = process.env.SYNC_INTERVAL || 3600000; 

async function syncProducts() {
  try {
    console.log(`[${new Date().toISOString()}] Starting product sync...`);
    
    const response = await axios.post(`${PRODUCT_SERVICE_URL}/api/products/sync`);
    
    console.log(`[${new Date().toISOString()}]  Sync completed:`, response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}]  Sync failed:`, error.message);
  }
}

syncProducts();

setInterval(syncProducts, SYNC_INTERVAL);

console.log(`🚀 Cron service started. Syncing every ${SYNC_INTERVAL / 1000} seconds`);

process.on('SIGINT', () => {
  console.log('Cron service shutting down...');
  process.exit(0);
});