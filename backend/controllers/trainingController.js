const TrainingProgram = require('../models/TrainingProgram');
const mongoose = require('mongoose');

// Public
const getActiveTrainings = async (req, res) => {
  try {
    const trainings = await TrainingProgram.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: trainings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin
const getAllTrainings = async (req, res) => {
  try {
    const trainings = await TrainingProgram.find().sort({ order: 1 });
    res.json({ success: true, data: trainings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTraining = async (req, res) => {
  try {
    const training = await TrainingProgram.create(req.body);
    res.status(201).json({ success: true, data: training });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const training = await TrainingProgram.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
    res.json({ success: true, data: training });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const training = await TrainingProgram.findByIdAndDelete(id);
    if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
    res.json({ success: true, message: 'Training deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActiveTrainings,
  getAllTrainings,
  createTraining,
  updateTraining,
  deleteTraining
};