const GalleryItem = require('../models/GalleryItem');

// Public: Get all gallery items
const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Add gallery item
const addGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGalleryItems, addGalleryItem, deleteGalleryItem };