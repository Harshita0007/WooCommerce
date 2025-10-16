const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WooCommerce Segment Service API',
      version: '1.0.0',
      description: 'API for evaluating product segments',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      }
    ],
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);