const path = require('path');
const express = require('express');
const apiRoutes = require('./src/routes/api');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Use API routes
app.use('/api', apiRoutes);

// Serve static frontend
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Bethany's vanilla app listening at http://localhost:${port}`);
});
