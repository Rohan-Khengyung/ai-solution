const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    format: { type: String, required: true },
    audience: { type: String, required: true },
    keyTopics: { type: [String], required: true },
    icon: { type: String, required: true }, // e.g., 'Brain', 'Code2'
    learnMoreLink: { type: String, default: '#contact' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);