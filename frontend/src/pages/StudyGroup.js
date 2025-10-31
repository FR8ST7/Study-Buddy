import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, MessageSquare, Settings, UserPlus, Clock, MapPin, Edit, Trash2, Crown, User, Search, Filter } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function StudyGroup() {
  const [studyGroups, setStudyGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    loadStudyGroups();
  }, []);

  const loadStudyGroups = () => {
    setIsLoading(true);
    try {
      const allGroups = dataManager.getStudyGroups();
      const myGroupsData = dataManager.getMyStudyGroups();
      setStudyGroups(allGroups);
      setMyGroups(myGroupsData);
      if (myGroupsData.length > 0 && !selectedGroup) {
        setSelectedGroup(myGroupsData[0]);
      }
    } catch (error) {
      console.error('Error loading study groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = (groupData) => {
    dataManager.addStudyGroup(groupData);
    loadStudyGroups();
    setShowCreateModal(false);
  };

  const handleJoinGroup = (groupId, memberData) => {
    dataManager.joinStudyGroup(groupId, memberData);
    loadStudyGroups();
    setShowJoinModal(false);
  };

  const handleLeaveGroup = (groupId) => {
    if (window.confirm('Are you sure you want to leave this study group?')) {
      dataManager.leaveStudyGroup(groupId, 1); // Assuming current user ID is 1
      loadStudyGroups();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this study group?')) {
      dataManager.deleteStudyGroup(groupId);
      loadStudyGroups();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  const handleAddSession = (sessionData) => {
    if (selectedGroup) {
      dataManager.addStudySession(selectedGroup.id, sessionData);
      loadStudyGroups();
      setShowSessionModal(false);
    }
  };

  const handleAddAnnouncement = (announcementData) => {
    if (selectedGroup) {
      dataManager.addAnnouncement(selectedGroup.id, announcementData);
      loadStudyGroups();
      setShowAnnouncementModal(false);
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

  const getFilteredGroups = () => {
    const groups = activeTab === 'my-groups' ? myGroups : studyGroups.filter(g => g.isPublic);
    return groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === 'all' || group.subject === filterSubject;
      return matchesSearch && matchesSubject;
    });
  };

  const getSubjects = () => {
    const subjects = [...new Set(studyGroups.map(group => group.subject))];
    return subjects;
  };

  const isGroupAdmin = (group) => {
    return group.members.some(member => member.name === "You" && member.role === "admin");
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
          <h1 className="text-3xl font-bold mb-2">Study Groups</h1>
          <p className="text-gray-600">Collaborate and study together with your peers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:neo-shadow transition-all"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('my-groups')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'my-groups' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Groups ({myGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'discover' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discover Groups
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
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
              <Users className="w-5 h-5" />
              {activeTab === 'my-groups' ? 'My Groups' : 'Public Groups'}
            </h3>

            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
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

            {/* Groups List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getFilteredGroups().length > 0 ? (
                getFilteredGroups().map(group => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedGroup?.id === group.id 
                        ? 'neo-shadow bg-blue-50 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">{group.name}</h4>
                          {isGroupAdmin(group) && (
                            <Crown className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{group.subject}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{group.members.length}/{group.maxMembers}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{formatTime(group.createdAt)}</span>
                        </div>
                      </div>
                      {activeTab === 'discover' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowJoinModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Join group"
                        >
                          <UserPlus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No groups found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Details */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="space-y-4">
              {/* Group Header */}
              <div
                className="p-6 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                      {isGroupAdmin(selectedGroup) && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{selectedGroup.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedGroup.members.length}/{selectedGroup.maxMembers} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {selectedGroup.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedGroup.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedGroup.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isGroupAdmin(selectedGroup) && (
                      <>
                        <button
                          onClick={() => setShowSessionModal(true)}
                          className="p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border-color)' }}
                          title="Add Study Session"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowAnnouncementModal(true)}
                          className="p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border-color)' }}
                          title="Add Announcement"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(selectedGroup.id)}
                          className="p-2 border-2 rounded-lg hover:bg-red-50 transition-colors"
                          style={{ borderColor: 'var(--border-color)' }}
                          title="Delete Group"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                    {!isGroupAdmin(selectedGroup) && (
                      <button
                        onClick={() => handleLeaveGroup(selectedGroup.id)}
                        className="px-3 py-1 border-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        Leave Group
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Members */}
              <div
                className="p-6 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members ({selectedGroup.members.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedGroup.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 border-2 rounded-lg"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{member.name}</span>
                          {member.role === 'admin' && (
                            <Crown className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Joined {formatTime(member.joinedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Sessions */}
              <div
                className="p-6 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions ({selectedGroup.studySessions.length})
                </h3>
                {selectedGroup.studySessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGroup.studySessions.map(session => (
                      <div
                        key={session.id}
                        className="p-4 border-2 rounded-lg"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{session.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{session.duration} minutes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{session.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No study sessions scheduled</p>
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div
                className="p-6 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Announcements ({selectedGroup.announcements.length})
                </h3>
                {selectedGroup.announcements.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGroup.announcements.map(announcement => (
                      <div
                        key={announcement.id}
                        className="p-4 border-2 rounded-lg"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(announcement.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{announcement.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          By {announcement.createdBy}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No announcements yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="border-2 rounded-lg neo-shadow p-8 text-center h-96 flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div>
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Select a Study Group</h3>
                <p className="text-gray-600 mb-4">Choose a group from the list to view details and activities</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onSave={handleCreateGroup}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <JoinGroupModal
          group={selectedGroup}
          onJoin={handleJoinGroup}
          onClose={() => setShowJoinModal(false)}
        />
      )}

      {/* Add Session Modal */}
      {showSessionModal && (
        <AddSessionModal
          onSave={handleAddSession}
          onClose={() => setShowSessionModal(false)}
        />
      )}

      {/* Add Announcement Modal */}
      {showAnnouncementModal && (
        <AddAnnouncementModal
          onSave={handleAddAnnouncement}
          onClose={() => setShowAnnouncementModal(false)}
        />
      )}
    </div>
  );
}

// Create Group Modal Component
function CreateGroupModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    maxMembers: 8,
    isPublic: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim() && formData.subject.trim()) {
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
          <h3 className="text-xl font-bold">Create Study Group</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="e.g., Advanced Mathematics Study Group"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Describe what this group will focus on..."
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

          <div>
            <label className="block text-sm font-medium mb-1">Max Members</label>
            <input
              type="number"
              min="2"
              max="20"
              value={formData.maxMembers}
              onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm">Make this group public (others can discover and join)</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Group
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

// Join Group Modal Component
function JoinGroupModal({ group, onJoin, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onJoin(group.id, formData);
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
          <h3 className="text-xl font-bold">Join {group?.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message (Optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Tell the group why you want to join..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Join Group
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

// Add Session Modal Component
function AddSessionModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.scheduledAt) {
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
          <h3 className="text-xl font-bold">Add Study Session</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Session Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="e.g., Calculus Review Session"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="What will you be studying in this session?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              min="15"
              max="300"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="e.g., Library Room 201 or Online - Zoom"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Session
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

// Add Announcement Modal Component
function AddAnnouncementModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
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
          <h3 className="text-xl font-bold">Add Announcement</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="e.g., Important Update"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-24 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Write your announcement here..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post Announcement
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
