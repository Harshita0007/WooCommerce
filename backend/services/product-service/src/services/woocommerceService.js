const axios = require('axios');
const Product = require('../models/Product');
require('dotenv').config();


const WC_BASE_URL = 'https://wp-multisite.convertcart.com/wp-json/wc/v3';
const WC_CONSUMER_KEY = 'ck_af82ae325fbee1c13f31eb26148f4dea473b0f77';
const WC_CONSUMER_SECRET = 'cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445';

class WooCommerceService {
  async fetchProducts(page = 1, perPage = 100) {
    try {
      const response = await axios.get(`${WC_BASE_URL}/products`, {
        params: {
          consumer_key: WC_CONSUMER_KEY,
          consumer_secret: WC_CONSUMER_SECRET,
          page: page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching from WooCommerce:', error.message);
      throw new Error('Failed to fetch products from WooCommerce');
    }
  }

  async syncProducts() {
    try {
      console.log('🔄 Starting product sync...');
      let page = 1;
      let hasMore = true;
      let totalSynced = 0;

      while (hasMore) {
        const products = await this.fetchProducts(page);
        
        if (products.length === 0) {
          hasMore = false;
          break;
        }

        for (const wcProduct of products) {
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
        }

        console.log(`✅ Synced page ${page}, total: ${totalSynced} products`);
        page++;
        
        if (page > 10) hasMore = false;
      }

      console.log(`🎉 Sync completed! Total products synced: ${totalSynced}`);
      return { success: true, totalSynced };
    } catch (error) {
      console.error('Sync error:', error.message);
      throw error;
    }
  }
}

module.exports = new WooCommerceService();