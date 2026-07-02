const Industry = require('../models/Industry');
const mongoose = require('mongoose');

// Public
const getActiveIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: industries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin
const getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ order: 1 });
    res.json({ success: true, data: industries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createIndustry = async (req, res) => {
  try {
    const industry = await Industry.create(req.body);
    res.status(201).json({ success: true, data: industry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const industry = await Industry.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });
    res.json({ success: true, data: industry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const industry = await Industry.findByIdAndDelete(id);
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });
    res.json({ success: true, message: 'Industry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActiveIndustries,
  getAllIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry
};