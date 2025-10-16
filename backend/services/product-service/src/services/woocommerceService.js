const axios = require('axios');
const Product = require('../models/Product');
require('dotenv').config();

const WC_BASE_URL = 'https://wp-multisite.convertcart.com/wp-json/wc/v3';
const WC_CONSUMER_KEY = 'ck_af82ae325fbee1c13f31eb26148f4dea473b0f77';
const WC_CONSUMER_SECRET = 'cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445';

class WooCommerceService {
  async fetchProducts(page = 1, perPage = 100) {
    const url = `${WC_BASE_URL}/products`;
    console.log('📡 Fetching from URL:', url);
    console.log('📄 Page:', page, '| Per Page:', perPage);
    
    try {
      const response = await axios.get(url, {
        params: {
          consumer_key: WC_CONSUMER_KEY,
          consumer_secret: WC_CONSUMER_SECRET,
          page: page,
          per_page: perPage
        },
        timeout: 30000,
        validateStatus: function (status) {
          return status < 500; // Don't throw for 4xx errors
        }
      });

      if (response.status !== 200) {
        console.error('❌ WooCommerce API returned status:', response.status);
        console.error('Response data:', JSON.stringify(response.data, null, 2));
        throw new Error(`WooCommerce API error: ${response.status} - ${JSON.stringify(response.data)}`);
      }

      console.log(`✅ Successfully fetched ${response.data.length} products from page ${page}`);
      return response.data;
      
    } catch (error) {
      console.error('❌ DETAILED ERROR:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      if (error.request) {
        console.error('Request was made but no response received');
        console.error('Request details:', {
          method: error.config?.method,
          url: error.config?.url,
          params: error.config?.params
        });
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to WooCommerce - check if the URL is correct');
      }
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - WooCommerce server is not responding');
      }
      
      throw new Error(`Failed to fetch products from WooCommerce: ${error.message}`);
    }
  }

  async syncProducts() {
    try {
      console.log('🔄 Starting product sync...');
      console.log('🔗 WooCommerce URL:', WC_BASE_URL);
      console.log('🔑 Consumer Key:', WC_CONSUMER_KEY.substring(0, 10) + '...');
      
      let page = 1;
      let hasMore = true;
      let totalSynced = 0;

      while (hasMore) {
        console.log(`\n📦 Fetching page ${page}...`);
        const products = await this.fetchProducts(page);
        
        if (!products || products.length === 0) {
          console.log('ℹ️  No more products found');
          hasMore = false;
          break;
        }

        console.log(`Processing ${products.length} products...`);
        
        for (const wcProduct of products) {
          try {
            const productData = {
              id: wcProduct.id,
              title: wcProduct.name,
              price: parseFloat(wcProduct.price) || 0,
              stock_status: wcProduct.stock_status,
              stock_quantity: wcProduct.stock_quantity,
              category: wcProduct.categories && wcProduct.categories.length > 0 
                ? wcProduct.categories[0].name 
                : null,
              tags: wcProduct.tags ? wcProduct.tags.map(tag => tag.name) : [],
              on_sale: wcProduct.on_sale || false,
              created_at: wcProduct.date_created || new Date()
            };

            await Product.upsert(productData);
            totalSynced++;
            
            if (totalSynced % 10 === 0) {
              console.log(`  ✓ Synced ${totalSynced} products so far...`);
            }
          } catch (dbError) {
            console.error(`❌ Error saving product ${wcProduct.id}:`, dbError.message);
          }
        }

        console.log(`✅ Page ${page} complete. Total synced: ${totalSynced}`);
        page++;
        
        // Safety limit
        if (page > 10) {
          console.log('⚠️  Reached page limit (10 pages)');
          hasMore = false;
        }
      }

      console.log(`\n🎉 Sync completed! Total products synced: ${totalSynced}`);
      return { success: true, totalSynced };
      
    } catch (error) {
      console.error('\n❌ SYNC FAILED:');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new WooCommerceService();