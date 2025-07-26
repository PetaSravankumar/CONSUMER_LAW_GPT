// src/components/ChatBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Message } from '../types/message';

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedInput,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await response.json();
      const botReply = data.response;

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botReply,
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("❌ Error contacting the bot");

      const errorMessage: Message = {
        id: Date.now() + 2,
        text: '❌ Something went wrong while contacting the chatbot.',
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${message.isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow'}`}>
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 animate-pulse">AI is typing...</div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={loading}
            placeholder="Ask your legal question..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
