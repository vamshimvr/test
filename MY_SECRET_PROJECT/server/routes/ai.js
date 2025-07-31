// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/recommendations', authenticateToken, async (req, res) => {
  const { imageId } = req.body;

  // Placeholder logic
  const recommendations = [
    { outfit: 'Slim Fit Blazer', color: 'Navy Blue', accessory: 'Leather Watch' },
    { outfit: 'Casual Tee & Joggers', color: 'Olive Green', accessory: 'Canvas Sneakers' }
  ];

  res.json({ imageId, recommendations });
});

module.exports = router;
