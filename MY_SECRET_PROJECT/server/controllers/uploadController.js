// server/controllers/uploadController.js
const pool = require('../dbconfig/db');

const uploadImage = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No image uploaded' });

  try {
    const result = await pool.query(
      'INSERT INTO wardrobe_items (user_id, image, image_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, file.buffer, file.originalname]
    );
    res.status(201).json({ message: 'Image uploaded successfully', item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWardrobeItems = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT id, image_name, uploaded_at FROM wardrobe_items WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getImageById = async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT image, image_name FROM wardrobe_items WHERE id = $1 AND user_id = $2',
      [imageId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const { image, image_name } = result.rows[0];
    const base64Image = Buffer.from(image).toString('base64');
    const mimeType = getMimeType(image_name); // detect by extension

    res.json({
      imageName: image_name,
      mimeType,
      base64: `data:${mimeType};base64,${base64Image}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMimeType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

module.exports = {
  uploadImage,
  getWardrobeItems,
  getImageById
};

