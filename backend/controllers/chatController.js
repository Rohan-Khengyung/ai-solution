const ChatHistory = require('../models/ChatHistory');

// Store a conversation turn (public)
const storeChatMessage = async (req, res) => {
  try {
    const { sessionId, userMessage, botResponse, timestamp } = req.body;
    if (!sessionId || !userMessage || !botResponse) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const chatTurn = await ChatHistory.create({
      sessionId,
      userMessage,
      botResponse,
      timestamp: timestamp || new Date()
    });
    res.status(201).json({ success: true, data: chatTurn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all chat histories with filters and pagination
const getChatHistories = async (req, res) => {
  try {
    const { sessionId, startDate, endDate, page = 1, limit = 20 } = req.query;
    let filter = {};

    if (sessionId) filter.sessionId = sessionId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const histories = await ChatHistory.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ChatHistory.countDocuments(filter);

    // Also get distinct session IDs for filter dropdown
    const distinctSessions = await ChatHistory.distinct('sessionId');

    res.json({
      success: true,
      data: histories,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sessions: distinctSessions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { storeChatMessage, getChatHistories };