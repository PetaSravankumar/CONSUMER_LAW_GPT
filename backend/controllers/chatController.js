const ChatHistory = require('../models/ChatHistory');

// Replace with actual bot logic (for now a dummy reply)
const getBotReply = async (message) => {
  // Example logic - replace with LLM call or custom logic
  return `You said: ${message}`;
};

// Main controller function for handling chat requests
const chat = async (req, res) => {
  const { question } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: User not found in request' });
  }

  if (!question) {
    return res.status(400).json({ msg: 'Question is required' });
  }

  const userId = req.user.id;

  const userMessage = {
    text: question,
    isUser: true,
    timestamp: new Date(),
  };

  try {
    const botAnswer = await getBotReply(question);

    const botMessage = {
      text: botAnswer,
      isUser: false,
      timestamp: new Date(),
    };

    let chatHistory = await ChatHistory.findOne({ userId });

    if (chatHistory) {
      chatHistory.messages.push(userMessage, botMessage);
      await chatHistory.save();
    } else {
      chatHistory = new ChatHistory({
        userId,
        messages: [userMessage, botMessage],
      });
      await chatHistory.save();
    }

    res.json({ answer: botAnswer });

  } catch (error) {
    console.error('❌ Error while processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  chat,
};
