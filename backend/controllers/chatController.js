const ChatHistory = require('../models/ChatHistory');
const mongoose = require('mongoose');

// Store a new chat message
const storeChatMessage = async (req, res) => {
  try {
    const { sessionId, userMessage, botResponse } = req.body;
    if (!sessionId || !userMessage || !botResponse) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const chat = await ChatHistory.create({ sessionId, userMessage, botResponse });
    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    console.error('storeChatMessage error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat histories for a specific session (public)
const getChatHistoryBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatHistory.find({ sessionId }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all sessions (distinct session IDs)
const getAllSessions = async (req, res) => {
  try {
    const sessions = await ChatHistory.distinct('sessionId');
    const sessionData = await Promise.all(
      sessions.map(async (sessionId) => {
        const count = await ChatHistory.countDocuments({ sessionId });
        const last = await ChatHistory.findOne({ sessionId }).sort({ timestamp: -1 });
        return {
          sessionId,
          messageCount: count,
          lastMessage: last ? last.timestamp : null,
        };
      })
    );
    // Sort by last message time descending
    sessionData.sort((a, b) => (b.lastMessage || 0) - (a.lastMessage || 0));
    res.json({ success: true, data: sessionData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get messages for a specific session
const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatHistory.find({ sessionId }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete entire session
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await ChatHistory.deleteMany({ sessionId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, message: `Deleted ${result.deletedCount} messages` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete a single message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID' });
    }
    const message = await ChatHistory.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  storeChatMessage,
  getChatHistoryBySession,
  getAllSessions,
  getSessionMessages,
  deleteSession,
  deleteMessage,
};