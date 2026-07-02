const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // e.g., 'Brain', 'Cpu'
    color: { type: String, default: '#6366f1' },
    features: { type: [String], required: true },
    useCases: { type: [String], required: true },
    learnMoreLink: { type: String, default: '#contact' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);