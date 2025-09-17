const express = require('express');
const router = express.Router();

// Expanded in-memory pies data (ids match the course repo patterns)
const pies = [
  // Seasonal
  { id: 's1', name: 'Pumpkin Pie', price: 14.95, description: 'Perfect for any holiday gathering', category: 'seasonal', image: '/images/Seasonal/pie-1.png' },
  { id: 's2', name: 'Pecan Pie', price: 15.95, description: 'Traditional southern style pecan pie', category: 'seasonal', image: '/images/Seasonal/pie-2.png' },
  { id: 's3', name: 'Sweet Potato Pie', price: 13.95, description: 'Classic holiday favorite with warm spices', category: 'seasonal', image: '/images/Seasonal/pie-3.png' },

  // Fruit
  { id: 'f1', name: 'Classic Apple Pie', price: 12.95, description: 'Made with fresh apples and a flaky crust', category: 'fruit', image: '/images/Fruit/fruit1.png' },
  { id: 'f2', name: 'Cherry Pie', price: 13.95, description: 'Sweet and tart cherries in a buttery crust', category: 'fruit', image: '/images/Fruit/fruit2.png' },
  { id: 'f3', name: 'Blueberry Pie', price: 13.95, description: 'Bursting with fresh blueberries', category: 'fruit', image: '/images/Fruit/fruit3.png' },

  // Cheesecakes
  { id: 'c1', name: 'Classic New York Cheesecake', price: 16.95, description: 'Rich and creamy New York style cheesecake', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake1.jpg' },
  { id: 'c2', name: 'Chocolate Swirl Cheesecake', price: 17.95, description: 'Marbled with rich chocolate throughout', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake2.jpg' },
  { id: 'c3', name: 'Strawberry Cheesecake', price: 17.95, description: 'Topped with fresh strawberry compote', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake3.jpg' },
  { id: 'c4', name: 'Caramel Pecan Cheesecake', price: 18.95, description: 'Drizzled with caramel and topped with pecans', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake4.jpg' },
  { id: 'c5', name: 'Lemon Cheesecake', price: 18.95, description: 'A refreshing lemon cheesecake with a graham cracker crust', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake5.jpg' },
  { id: 'c6', name: 'Peach Cheesecake', price: 18.95, description: 'A creamy peach cheesecake with a graham cracker crust', category: 'cheesecake', image: '/images/Cheesecakes/cheesecake6.jpg' }
];

// Helper function for consistent error handling
function sendError(res, status, message) {
  return res.status(status).json({ error: true, message });
}

// API: list pies with optional category filter
router.get('/pies', async (req, res) => {
  try {
    const category = (req.query.category || '').toString().toLowerCase();
    let filtered = pies;
    if (category) {
      filtered = pies.filter(p => p.category === category);
    }

    // simulate small latency like the original repo
    await new Promise(r => setTimeout(r, 400));
    res.json(filtered);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch pies');
  }
});

// API: pies of the month (subset)
router.get('/pies-of-the-month', async (req, res) => {
  try {
    const monthly = [pies.find(p => p.id === 'f2'), pies.find(p => p.id === 'f3'), pies.find(p => p.id === 'c3')].filter(Boolean);
    await new Promise(r => setTimeout(r, 300));
    res.json(monthly);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch pies of the month');
  }
});

// API: get pie by id
router.get('/pies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return sendError(res, 400, 'Pie ID is required');
    }
    
    const pie = pies.find(p => p.id === id);
    if (!pie) {
      return sendError(res, 404, 'Pie not found');
    }
    
    res.json(pie);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch pie');
  }
});

module.exports = router;