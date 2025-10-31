import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Plus, Send, Users, User, Clock, Search, Filter, Phone, Video, MoreVertical, Edit, Trash2, Pin, Star } from 'lucide-react';

export default function ClassChat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const messagesEndRef = useRef(null);

  const [newChatData, setNewChatData] = useState({
    name: '',
    type: 'class',
    description: '',
    participants: []
  });

  const chatTypes = [
    { value: 'class', label: 'Class Chat', icon: '👥', color: 'bg-blue-100 text-blue-800' },
    { value: 'parent', label: 'Parent Chat', icon: '👨‍👩‍👧‍👦', color: 'bg-green-100 text-green-800' },
    { value: 'teacher', label: 'Teacher Chat', icon: '👩‍🏫', color: 'bg-purple-100 text-purple-800' },
    { value: 'study_group', label: 'Study Group', icon: '📚', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const sampleUsers = [
    { id: 1, name: 'Ms. Johnson', role: 'teacher', avatar: '👩‍🏫' },
    { id: 2, name: 'Mrs. Smith', role: 'parent', avatar: '👩' },
    { id: 3, name: 'Mr. Davis', role: 'teacher', avatar: '👨‍🏫' },
    { id: 4, name: 'John Smith', role: 'student', avatar: '👦' },
    { id: 5, name: 'Sarah Brown', role: 'student', avatar: '👧' },
    { id: 6, name: 'Mike Chen', role: 'student', avatar: '👦' },
    { id: 7, name: 'Emily Davis', role: 'student', avatar: '👧' },
    { id: 8, name: 'Mr. Brown', role: 'parent', avatar: '👨' }
  ];

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = () => {
    const savedChats = localStorage.getItem('class_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    } else {
      // Add sample chats
      const sampleChats = [
        {
          id: 1,
          name: 'Class 10A General',
          type: 'class',
          description: 'General class discussions and announcements',
          participants: [1, 2, 4, 5, 6, 7],
          lastMessage: 'Don\'t forget about tomorrow\'s math test!',
          lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unreadCount: 2,
          isPinned: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: 'Parents Group',
          type: 'parent',
          description: 'Parent discussions and updates',
          participants: [2, 8],
          lastMessage: 'Thank you for the parent-teacher meeting updates',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unreadCount: 0,
          isPinned: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: 'Math Study Group',
          type: 'study_group',
          description: 'Math homework help and study sessions',
          participants: [1, 4, 5, 6],
          lastMessage: 'Can someone help with problem 15?',
          lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          unreadCount: 1,
          isPinned: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setChats(sampleChats);
      localStorage.setItem('class_chats', JSON.stringify(sampleChats));
    }
  };

  const loadMessages = (chatId) => {
    const savedMessages = localStorage.getItem(`chat_messages_${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add sample messages
      const sampleMessages = [
        {
          id: 1,
          chatId: chatId,
          senderId: 1,
          senderName: 'Ms. Johnson',
          senderRole: 'teacher',
          content: 'Welcome to our class chat! Please use this space for questions and discussions.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'text',
          isPinned: false
        },
        {
          id: 2,
          chatId: chatId,
          senderId: 4,
          senderName: 'John Smith',
          senderRole: 'student',
          content: 'Thank you Ms. Johnson!',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          type: 'text',
          isPinned: false
        },
        {
          id: 3,
          chatId: chatId,
          senderId: 1,
          senderName: 'Ms. Johnson',
          senderRole: 'teacher',
          content: 'Don\'t forget about tomorrow\'s math test!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          type: 'text',
          isPinned: true
        }
      ];
      setMessages(sampleMessages);
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(sampleMessages));
    }
  };

  const saveChats = (newChats) => {
    localStorage.setItem('class_chats', JSON.stringify(newChats));
    setChats(newChats);
  };

  const saveMessages = (chatId, newMessages) => {
    localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      chatId: activeChat.id,
      senderId: 1, // Current user (demo)
      senderName: 'You',
      senderRole: 'student',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      isPinned: false
    };

    const updatedMessages = [...messages, message];
    saveMessages(activeChat.id, updatedMessages);

    // Update chat's last message
    const updatedChats = chats.map(chat => 
      chat.id === activeChat.id 
        ? { 
            ...chat, 
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: chat.id === activeChat.id ? 0 : chat.unreadCount
          }
        : chat
    );
    saveChats(updatedChats);

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateChat = () => {
    if (!newChatData.name.trim()) return;

    const chat = {
      id: Date.now(),
      name: newChatData.name,
      type: newChatData.type,
      description: newChatData.description,
      participants: [...newChatData.participants, 1], // Add current user
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    const updatedChats = [...chats, chat];
    saveChats(updatedChats);
    setShowNewChatModal(false);
    setNewChatData({ name: '', type: 'class', description: '', participants: [] });
  };

  const handleDeleteChat = (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      saveChats(updatedChats);
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    }
  };

  const handlePinMessage = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    );
    saveMessages(activeChat.id, updatedMessages);
  };

  const filteredChats = chats.filter(chat => {
    const matchesFilter = filterType === 'all' || chat.type === filterType;
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getChatTypeInfo = (type) => {
    return chatTypes.find(t => t.value === type) || chatTypes[0];
  };

  const getUserById = (userId) => {
    return sampleUsers.find(user => user.id === userId) || { name: 'Unknown', role: 'user', avatar: '👤' };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class & Parent Chat</h1>
          <p className="text-gray-600">Communicate with teachers, parents, and classmates</p>
        </div>
        <button 
          onClick={() => setShowNewChatModal(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:scale-105 transition-all"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div
            className="h-full border-2 rounded-lg neo-shadow flex flex-col"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {/* Search and Filter */}
            <div className="p-4 border-b-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">All Chats</option>
                {chatTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                <div className="space-y-1 p-2">
                  {filteredChats
                    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                    .map((chat) => {
                      const typeInfo = getChatTypeInfo(chat.type);
                      const isActive = activeChat && activeChat.id === chat.id;
                      
                      return (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                            isActive ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ 
                            backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                            borderColor: 'var(--border-color)'
                          }}
                          onClick={() => setActiveChat(chat)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {chat.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                              <span className="text-lg">{typeInfo.icon}</span>
                              <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                            </div>
                            {chat.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-600 truncate mb-1">
                              {chat.lastMessage}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chats found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {activeChat ? (
            <div
              className="h-full border-2 rounded-lg neo-shadow flex flex-col"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b-2 flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getChatTypeInfo(activeChat.type).icon}</span>
                  <div>
                    <h2 className="font-bold text-lg">{activeChat.name}</h2>
                    <p className="text-sm text-gray-600">{activeChat.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{activeChat.participants.length}</span>
                  </div>
                  <button className="p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border-color)' }}
                          title="Video Call">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border-color)' }}
                          title="Voice Call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteChat(activeChat.id)}
                    className="p-2 border-2 rounded-lg hover:bg-red-50 transition-colors"
                    style={{ borderColor: 'var(--border-color)' }}
                    title="Delete Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const sender = getUserById(message.senderId);
                    const isCurrentUser = message.senderId === 1;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{sender.avatar}</span>
                              <span className="font-semibold text-sm">{message.senderName}</span>
                              <span className="text-xs text-gray-500 capitalize">({sender.role})</span>
                            </div>
                          )}
                          
                          <div className={`p-3 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-blue-500 text-white' 
                              : 'border-2'
                          } ${message.isPinned ? 'ring-2 ring-yellow-400' : ''}`}
                               style={{ 
                                 borderColor: isCurrentUser ? 'transparent' : 'var(--border-color)',
                                 backgroundColor: isCurrentUser ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                               }}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm">{message.content}</p>
                              <button
                                onClick={() => handlePinMessage(message.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                title={message.isPinned ? 'Unpin' : 'Pin'}
                              >
                                <Pin className={`w-3 h-3 ${message.isPinned ? 'text-yellow-500' : 'text-gray-400'}`} />
                              </button>
                            </div>
                          </div>
                          
                          <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="h-full border-2 rounded-lg neo-shadow flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a chat to start messaging</h3>
                <p className="text-sm">Choose a chat from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="w-full max-w-md p-6 border-2 rounded-lg neo-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <h2 className="text-xl font-bold mb-4">Create New Chat</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateChat(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chat Name</label>
                <input
                  type="text"
                  required
                  value={newChatData.name}
                  onChange={(e) => setNewChatData({...newChatData, name: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Chat Type</label>
                <select
                  value={newChatData.type}
                  onChange={(e) => setNewChatData({...newChatData, type: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {chatTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newChatData.description}
                  onChange={(e) => setNewChatData({...newChatData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Add Participants</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sampleUsers.filter(user => user.id !== 1).map(user => (
                    <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newChatData.participants.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewChatData({
                              ...newChatData,
                              participants: [...newChatData.participants, user.id]
                            });
                          } else {
                            setNewChatData({
                              ...newChatData,
                              participants: newChatData.participants.filter(id => id !== user.id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-lg">{user.avatar}</span>
                      <span className="text-sm">{user.name}</span>
                      <span className="text-xs text-gray-500 capitalize">({user.role})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Chat
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
