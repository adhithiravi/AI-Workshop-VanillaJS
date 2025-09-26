/**
 * Application Constants
 * Centralized configuration values
 */

const PORT = process.env.PORT || 4000;

// API latency simulation (in milliseconds)
const LATENCY = {
  PIES: 400,
  MONTHLY: 300
};

// Allowed categories for pie filtering
const ALLOWED_CATEGORIES = ['seasonal', 'fruit', 'cheesecake', 'all'];

module.exports = {
  PORT,
  LATENCY,
  ALLOWED_CATEGORIES
};
