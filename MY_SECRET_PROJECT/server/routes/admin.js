// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.send('Welcome Admin!');
});

module.exports = router;
