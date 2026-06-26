const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Store file in memory (buffer)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB limit
});

// Protected upload route
router.post('/image', protect, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Convert buffer to base64 data URL
    const mimeType = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    res.json({ success: true, url: dataUrl });
  });
});

module.exports = router;