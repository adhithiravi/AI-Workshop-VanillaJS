/**
 * Main Server Entry Point
 * Bethany's Pie Shop - Express API Server
 */

const path = require('path');
const express = require('express');
const securityMiddleware = require('./middleware/security');
const apiRoutes = require('./routes/api');
const { PORT } = require('./config/constants');
const { swaggerUi, swaggerDocument, swaggerOptions } = require('./config/swagger');

const app = express();

// Security headers middleware
app.use(securityMiddleware);

// JSON parsing middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Serve static frontend
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Bethany's vanilla app listening at http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Export app for testing
module.exports = app;
