import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Quick replies
  const QUICK_REPLIES = ['Our services', 'Book a demo', 'Pricing info', 'Contact us'];

  // Generate or retrieve session ID
  useEffect(() => {
    let storedSession = localStorage.getItem('chatSessionId');
    if (!storedSession) {
      storedSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  // Load chat history when sessionId is set
  useEffect(() => {
    if (!sessionId) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${sessionId}`);
        if (res.data.success && res.data.data.length > 0) {
          // Convert stored messages to the format used by the UI
          const history = [];
          res.data.data.forEach((entry) => {
            history.push({
              id: Date.now() + history.length,
              from: 'user',
              text: entry.userMessage,
              timestamp: new Date(entry.timestamp),
            });
            history.push({
              id: Date.now() + history.length + 1,
              from: 'bot',
              text: entry.botResponse,
              timestamp: new Date(entry.timestamp),
            });
          });
          setMessages(history);
          setUnread(history.length);
        } else {
          // No history, set welcome message
          setMessages([
            {
              id: Date.now(),
              from: 'bot',
              text: "Hi! I'm Aria, your AI Solutions assistant. How can I help you today? Ask me about our services, pricing, events, or anything else!",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // Fallback to welcome message
        setMessages([
          {
            id: Date.now(),
            from: 'bot',
            text: "Hi! I'm Aria, your AI Solutions assistant. How can I help you today? Ask me about our services, pricing, events, or anything else!",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setHistoryLoaded(true);
      }
    };
    fetchHistory();
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, minimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [isOpen, minimized]);

  // Increment unread when a new bot message arrives and chat is closed
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.from === 'bot') {
        setUnread((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Store conversation turn
  const storeConversationTurn = async (userMsg, botMsg) => {
    if (!sessionId) return;
    try {
      await axios.post('http://localhost:5000/api/chat/store', {
        sessionId,
        userMessage: userMsg,
        botResponse: botMsg,
      });
    } catch (err) {
      console.error('Failed to store chat history:', err);
    }
  };

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    const userMsgObj = {
      id: Date.now(),
      from: 'user',
      text: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsgObj]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call the AI response endpoint
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        sessionId, // optional, in case the backend wants it
      });

      let botReply = "I'm having trouble connecting right now. Please try again in a moment.";
      if (response.data.success) {
        botReply = response.data.reply;
      } else {
        throw new Error(response.data.message || 'Failed to get response');
      }

      // Simulate typing delay
      setTimeout(async () => {
        const botMsgObj = {
          id: Date.now() + 1,
          from: 'bot',
          text: botReply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsgObj]);
        setIsTyping(false);
        await storeConversationTurn(userMessage, botReply);
      }, 700 + Math.random() * 500);
    } catch (error) {
      console.error('Chat error:', error);

      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
      if (error.response?.status === 429) {
        errorMessage = "Our AI assistant is a bit busy right now. Please wait a moment before trying again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Our AI service is temporarily unavailable. Please contact us directly using the contact form.";
      }

      setTimeout(async () => {
        const errorMsgObj = {
          id: Date.now() + 1,
          from: 'bot',
          text: errorMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsgObj]);
        setIsTyping(false);
        await storeConversationTurn(userMessage, errorMessage);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (replyText) => {
    sendMessage(replyText);
  };

  // Format message text
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white border border-gray-200 shadow-2xl w-[360px] flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? 'h-14' : 'h-[520px]'
          }`}
          style={{ borderRadius: '16px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0055FF] to-indigo-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">Aria</p>
              <p className="text-blue-200 text-xs mt-0.5">AI Solutions Assistant · Online</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Minimized state only shows header */}
          {!minimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'bot' && (
                      <div className="w-7 h-7 bg-gradient-to-br from-[#0055FF] to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-[#0055FF] text-white rounded-t-2xl rounded-bl-2xl'
                          : 'bg-white border border-gray-200 text-gray-700 rounded-t-2xl rounded-br-2xl shadow-sm'
                      }`}
                    >
                      {formatText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#0055FF] to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-t-2xl rounded-br-2xl shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies (only show if few messages) */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-gray-100 bg-white">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => handleQuickReply(qr)}
                      className="text-xs font-medium px-3 py-1.5 border border-[#0055FF] text-[#0055FF] rounded-full hover:bg-[#0055FF] hover:text-white transition-colors"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none py-1"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 bg-[#0055FF] disabled:bg-gray-200 flex items-center justify-center rounded-full transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Toggle Button (with unread badge) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setMinimized(false);
          if (!isOpen) setUnread(0);
        }}
        className="w-14 h-14 bg-gradient-to-br from-[#0055FF] to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-200 relative"
        style={{ borderRadius: '50%' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;