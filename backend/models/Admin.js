const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // NEW: recipient email for notifications, can be different from login email
  recipientEmail: {
    type: String,
    lowercase: true,
    trim: true,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['viewer', 'manager', 'admin', 'superadmin'],
    default: 'viewer'
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admin', adminSchema);