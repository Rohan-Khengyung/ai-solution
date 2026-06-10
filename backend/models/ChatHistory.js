const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient session-based queries
chatHistorySchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);