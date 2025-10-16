const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WooCommerce Product Service API',
      version: '1.0.0',
      description: 'API for managing WooCommerce products',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);