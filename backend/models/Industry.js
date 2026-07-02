const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // e.g., 'Briefcase', 'HeartPulse'
    color: { type: String, default: '#6366f1' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Industry', industrySchema);