const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Membership Management API',
      version: '1.0.0',
      description: 'API documentation for managing gym memberships',
    },
  },
  apis: ['./server.js'], // Assuming all your API definitions are in server.js
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };
