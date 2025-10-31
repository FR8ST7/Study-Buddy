import React, { useState, useEffect, useRef } from 'react';
import { Bot, Plus, Send, Edit, Trash2, MessageCircle, Clock, User, Search, Filter } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function AIChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const loadConversations = () => {
    setIsLoading(true);
    try {
      const allConversations = dataManager.getChatConversations();
      setConversations(allConversations);
      if (allConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(allConversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleCreateChat = (chatData) => {
    const newChat = dataManager.addChatConversation(chatData);
    loadConversations();
    setSelectedConversation(newChat);
    setShowNewChatModal(false);
  };

  const handleDeleteChat = (chatId) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      dataManager.deleteChatConversation(chatId);
      loadConversations();
      if (selectedConversation?.id === chatId) {
        setSelectedConversation(conversations.find(c => c.id !== chatId) || null);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const userMessage = messageInput.trim();
    setMessageInput('');
    setIsTyping(true);

    // Add user message
    dataManager.addMessageToConversation(selectedConversation.id, {
      role: 'user',
      content: userMessage
    });

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate AI response
    const aiResponse = dataManager.generateAIResponse(userMessage, selectedConversation.messages);
    
    // Add AI response
    dataManager.addMessageToConversation(selectedConversation.id, {
      role: 'assistant',
      content: aiResponse
    });

    setIsTyping(false);
    loadConversations();
    
    // Update selected conversation
    const updatedConversation = dataManager.getChatConversations().find(c => c.id === selectedConversation.id);
    setSelectedConversation(updatedConversation);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || conv.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const getSubjects = () => {
    const subjects = [...new Set(conversations.map(conv => conv.subject))];
    return subjects;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Study Buddy</h1>
          <p className="text-gray-600">Get help with your studies from your AI assistant</p>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:neo-shadow transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1">
          <div
            className="p-4 border-2 rounded-lg neo-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversations ({conversations.length})
            </h3>

            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 rounded-lg text-sm"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </div>
              
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="all">All Subjects</option>
                {getSubjects().map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Conversations List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conversation.id 
                        ? 'neo-shadow bg-blue-50 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{conversation.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{conversation.subject}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(conversation.lastMessageAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedConversation ? (
            <div
              className="border-2 rounded-lg neo-shadow flex flex-col h-[600px]"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedConversation.title}</h3>
                    <p className="text-sm text-gray-600">{selectedConversation.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Bot className="w-4 h-4" />
                      <span>AI Assistant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your studies..."
                      className="w-full p-3 border-2 rounded-lg resize-none"
                      style={{ borderColor: 'var(--border-color)' }}
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 rounded-lg neo-shadow p-8 text-center h-[600px] flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div>
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Welcome to AI Study Buddy!</h3>
                <p className="text-gray-600 mb-4">Start a new conversation to get help with your studies</p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onSave={handleCreateChat}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
    </div>
  );
}

// New Chat Modal Component
function NewChatModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.subject.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg border-2 neo-shadow max-w-md w-full mx-4"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Start New Chat</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chat Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="e.g., Math Help - Algebra"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            >
              <option value="">Select a subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="English">English</option>
              <option value="Geography">Geography</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
