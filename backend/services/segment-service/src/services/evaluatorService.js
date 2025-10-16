const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'https://product-service-zrts.onrender.com';

class EvaluatorService {
  parseCondition(line) {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const patterns = [
      { regex: /^(\w+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/, type: 'comparison' },
      { regex: /^(\w+)\s+contains\s+(.+)$/i, type: 'contains' }
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern.regex);
      if (match) {
        if (pattern.type === 'comparison') {
          return {
            field: match[1],
            operator: match[2],
            value: match[3].trim()
          };
        } else if (pattern.type === 'contains') {
          return {
            field: match[1],
            operator: 'contains',
            value: match[2].trim()
          };
        }
      }
    }

    throw new Error(`Invalid condition format: ${trimmed}`);
  }

  evaluateCondition(product, condition) {
    const { field, operator, value } = condition;
    const productValue = product[field];

    // Parse value
    let parsedValue = value;
    if (typeof value === 'string') {
      parsedValue = value.replace(/^["']|["']$/g, '');
    }

    // Convert to number if applicable
    if (!isNaN(parsedValue) && parsedValue !== '') {
      parsedValue = parseFloat(parsedValue);
    }

    // Convert boolean strings
    if (parsedValue === 'true') parsedValue = true;
    if (parsedValue === 'false') parsedValue = false;

    // Evaluate based on operator
    switch (operator) {
      case '=':
        return productValue == parsedValue;
      case '!=':
        return productValue != parsedValue;
      case '>':
        return Number(productValue) > Number(parsedValue);
      case '<':
        return Number(productValue) < Number(parsedValue);
      case '>=':
        return Number(productValue) >= Number(parsedValue);
      case '<=':
        return Number(productValue) <= Number(parsedValue);
      case 'contains':
        if (!productValue) return false;
        return String(productValue).toLowerCase().includes(String(parsedValue).toLowerCase());
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  async evaluate(rulesText) {
    try {
      console.log('🔄 Fetching products from Product Service...');
      console.log('Product Service URL:', PRODUCT_SERVICE_URL);
      
      // Fetch products from Product Service API
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const allProducts = response.data.data || response.data;
      console.log(`✅ Fetched ${allProducts.length} products from Product Service`);

      // Parse rules
      const lines = rulesText.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('No valid conditions provided');
      }

      const conditions = lines.map(line => this.parseCondition(line)).filter(c => c !== null);
      
      if (conditions.length === 0) {
        throw new Error('No valid conditions could be parsed');
      }

      console.log('📋 Evaluating conditions:', conditions);

      // Filter products in memory based on ALL conditions (AND logic)
      const filteredProducts = allProducts.filter(product => {
        return conditions.every(condition => {
          const result = this.evaluateCondition(product, condition);
          return result;
        });
      });

      console.log(`✅ Filtered to ${filteredProducts.length} products matching all conditions`);

      return {
        success: true,
        conditions: conditions,
        count: filteredProducts.length,
        data: filteredProducts
      };
    } catch (error) {
      console.error('❌ Error evaluating segment:', error.message);
      
      // Better error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to Product Service - service may be down');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - Product Service may be sleeping (Render free tier)');
      }
      if (error.response?.status === 404) {
        throw new Error('Product Service API endpoint not found');
      }
      if (error.response?.status === 500) {
        throw new Error('Product Service error: ' + (error.response?.data?.error || 'Internal server error'));
      }
      
      throw error;
    }
  }
}

module.exports = new EvaluatorService();