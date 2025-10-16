const Product = require('../models/Product');
const woocommerceService = require('../services/woocommerceService');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({
        order: [['id', 'ASC']]
      });
      
      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product'
      });
    }
  }

  async syncProducts(req, res) {
    try {
      const result = await woocommerceService.syncProducts();
      res.json({
        success: true,
        message: 'Products synced successfully',
        ...result
      });
    } catch (error) {
      console.error('Error syncing products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync products'
      });
    }
  }
}

module.exports = new ProductController();