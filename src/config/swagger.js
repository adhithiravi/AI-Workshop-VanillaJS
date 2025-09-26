/**
 * Swagger Configuration Module
 * Configures Swagger UI for API documentation
 */

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));

// Swagger UI options
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #b84d3b; }
  `,
  customSiteTitle: "Bethany's Pie Shop API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions
};
