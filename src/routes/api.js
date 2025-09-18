/**
 * API Routes Module
 * Handles all API endpoints
 */

const express = require('express');
const { getPiesOfTheMonth } = require('../helpers/piesHelper');
const pies = require('../data/pies');
const { LATENCY, ALLOWED_CATEGORIES } = require('../config/constants');

const router = express.Router();

// API: list pies with optional category filter
router.get('/pies', async (req, res) => {
  try {
    // Safe input normalization and validation for category
    const rawCategory = req.query.category;

    // Check if category parameter exists (even if empty)
    if (rawCategory !== undefined) {
      const category = rawCategory.toString().trim().toLowerCase();

      // Validate against allowed categories - check if category is provided and invalid
      if (category && !ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: true,
          message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`
        });
      }

      // Filter pies by category (skip if 'all' or empty)
      let filtered = pies;
      if (category && category !== 'all') {
        filtered = pies.filter(p => p.category === category);
      }

      // Simulate small latency like the original repo
      await new Promise(r => setTimeout(r, LATENCY.PIES));
      res.json(filtered);
    } else {
      // No category provided - return all pies
      await new Promise(r => setTimeout(r, LATENCY.PIES));
      res.json(pies);
    }
  } catch (err) {
    // Unified error response format
    res.status(500).json({ error: true, message: 'Failed to fetch pies' });
  }
});

// API: pies of the month (subset)
router.get('/pies-of-the-month', async (req, res) => {
  try {
    const monthly = getPiesOfTheMonth(pies);
    // Simulate latency like the original repo
    await new Promise(r => setTimeout(r, LATENCY.MONTHLY));
    res.json(monthly);
  } catch (err) {
    // Unified error response format
    res.status(500).json({ error: true, message: 'Failed to fetch pies of the month' });
  }
});

// API: get pie by id
router.get('/pies/:id', (req, res) => {
  try {
    const id = req.params.id;
    const pie = pies.find(p => p.id === id);
    if (!pie) {
      // Unified error response format for not found
      return res.status(404).json({ error: true, message: 'Pie not found' });
    }
    res.json(pie);
  } catch (err) {
    // Unified error response format for server errors
    res.status(500).json({ error: true, message: 'Failed to fetch pie' });
  }
});

module.exports = router;
