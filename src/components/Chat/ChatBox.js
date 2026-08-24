import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Send, Mic, Paperclip, X } from 'lucide-react';
import { useChat } from '../../store/useChat';
import { useVoice } from '../../hooks/useVoice';
import Button from '../Common/Button';
import Card from '../Common/Card';
import './ChatBox.css';

/**
 * Chat Box Component
 * AI-powered chat interface with voice support
 */
const ChatBox = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { messages, addUserMessage, addBotMessage } = useChat();
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useVoice();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    addUserMessage(message);
    setMessage('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me help you with that.',
        'I\'m here to assist you with your forms.',
        'You can create forms by clicking the "Create Form" button.',
        'Would you like to learn more about form features?',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addBotMessage(randomResponse);
      setLoading(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  return (
    <Card
      title="AI Assistant"
      actions={
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onClose}
        />
      }
      className="chat-box"
    >
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p>Start a conversation with AI Assistant</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message chat-message--${msg.sender}`}
            >
              <div className="chat-message-content">
                {msg.content}
              </div>
              <span className="chat-message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        {loading && (
          <div className="chat-message chat-message--bot">
            <div className="chat-message-content">
              <div className="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="chat-input-group">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading || isListening}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Mic}
            onClick={handleVoiceInput}
            className={isListening ? 'chat-button--active' : ''}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Send}
            disabled={!message.trim() || loading}
          />
        </div>
      </form>
    </Card>
  );
};

ChatBox.propTypes = {
  onClose: PropTypes.func,
};

export default ChatBox;
