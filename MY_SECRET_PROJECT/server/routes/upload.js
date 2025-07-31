// server/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadImage, getWardrobeItems } = require('../controllers/uploadController');
const { getImageById } = require('../controllers/uploadController');

const storage = multer.memoryStorage(); // store image in memory as buffer
const upload = multer({ storage });

router.post('/image', authenticateToken, upload.single('image'), uploadImage);
router.get('/wardrobe', authenticateToken, getWardrobeItems);
router.get('/:id', authenticateToken, getImageById);

module.exports = router;
