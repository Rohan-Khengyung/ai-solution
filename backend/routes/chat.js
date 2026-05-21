const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    const systemPrompt = `You are an AI assistant for AI Solutions, a company that provides AI-powered solutions for modern digital enterprises. Your role is to help visitors with questions about AI Virtual Assistants, Prototyping Solutions, Automation Platforms, and Analytics. Be friendly, professional, and concise. If asked about pricing or specific demos, direct them to the contact page. Keep responses helpful and focused on how AI Solutions can help businesses.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    
    if (error.status === 429) {
      res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    } else if (error.status === 401) {
      res.status(401).json({ 
        success: false, 
        message: 'API key is invalid or missing. Please contact support.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Unable to process your request at this time.' 
      });
    }
  }
});

module.exports = router;