/**
 * Security Middleware Module
 * Configures Helmet for security headers
 */

const helmet = require('helmet');

/**
 * Security headers middleware
 * Note: If CSP (Content Security Policy) conflicts in development, you can disable it with:
 * app.use(helmet({ contentSecurityPolicy: false }));
 */
const securityMiddleware = helmet();

module.exports = securityMiddleware;
