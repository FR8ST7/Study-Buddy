import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Star, Gift, Target, Clock, Award, CheckCircle, XCircle, Edit, Trash2, Search, Filter } from 'lucide-react';

export default function RewardsHub() {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    category: 'academic',
    icon: '🏆',
    isActive: true,
    requirements: ''
  });

  const rewardCategories = [
    { value: 'academic', label: 'Academic', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    { value: 'behavior', label: 'Behavior', icon: '⭐', color: 'bg-green-100 text-green-800' },
    { value: 'participation', label: 'Participation', icon: '🙋‍♂️', color: 'bg-purple-100 text-purple-800' },
    { value: 'achievement', label: 'Achievement', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'special', label: 'Special', icon: '🎉', color: 'bg-pink-100 text-pink-800' }
  ];

  const pointActivities = [
    { activity: 'Submit assignment on time', points: 10, category: 'academic' },
    { activity: 'Participate in class discussion', points: 5, category: 'participation' },
    { activity: 'Help a classmate', points: 15, category: 'behavior' },
    { activity: 'Complete extra credit', points: 20, category: 'academic' },
    { activity: 'Perfect attendance (week)', points: 25, category: 'behavior' },
    { activity: 'Lead study group', points: 30, category: 'achievement' },
    { activity: 'Volunteer for school event', points: 40, category: 'special' },
    { activity: 'Win class competition', points: 50, category: 'achievement' }
  ];

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = () => {
    // Load rewards
    const savedRewards = localStorage.getItem('rewards');
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    } else {
      // Add sample rewards
      const sampleRewards = [
        {
          id: 1,
          title: 'Math Master',
          description: 'Score 90% or higher on 5 consecutive math tests',
          points: 100,
          category: 'academic',
          icon: '🧮',
          isActive: true,
          requirements: '5 consecutive math tests with 90%+ score',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Helping Hand',
          description: 'Help 10 classmates with their homework',
          points: 75,
          category: 'behavior',
          icon: '🤝',
          isActive: true,
          requirements: 'Help 10 different classmates',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Perfect Attendance',
          description: 'No absences for an entire month',
          points: 50,
          category: 'behavior',
          icon: '📅',
          isActive: true,
          requirements: '30 consecutive school days',
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Study Group Leader',
          description: 'Organize and lead 5 study group sessions',
          points: 150,
          category: 'achievement',
          icon: '👥',
          isActive: true,
          requirements: 'Lead 5 different study sessions',
          createdAt: new Date().toISOString()
        }
      ];
      setRewards(sampleRewards);
      localStorage.setItem('rewards', JSON.stringify(sampleRewards));
    }

    // Load user points and achievements
    const savedUserData = localStorage.getItem('user_rewards_data');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserPoints(userData.points || 0);
      setUserAchievements(userData.achievements || []);
    } else {
      // Initialize with sample data
      const sampleUserData = {
        points: 125,
        achievements: [
          {
            id: 1,
            rewardId: 1,
            earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 3, // 3 out of 5 tests completed
            total: 5
          },
          {
            id: 2,
            rewardId: 2,
            earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 7, // 7 out of 10 helps completed
            total: 10
          }
        ]
      };
      setUserPoints(sampleUserData.points);
      setUserAchievements(sampleUserData.achievements);
      localStorage.setItem('user_rewards_data', JSON.stringify(sampleUserData));
    }
  };

  const saveRewards = (newRewards) => {
    localStorage.setItem('rewards', JSON.stringify(newRewards));
    setRewards(newRewards);
  };

  const saveUserData = (newUserData) => {
    localStorage.setItem('user_rewards_data', JSON.stringify(newUserData));
    setUserPoints(newUserData.points);
    setUserAchievements(newUserData.achievements);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReward = {
      id: editingReward ? editingReward.id : Date.now(),
      ...formData,
      points: parseInt(formData.points),
      createdAt: editingReward ? editingReward.createdAt : new Date().toISOString()
    };

    let updatedRewards;
    if (editingReward) {
      updatedRewards = rewards.map(reward => reward.id === editingReward.id ? newReward : reward);
    } else {
      updatedRewards = [...rewards, newReward];
    }
    
    saveRewards(updatedRewards);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      points: '',
      category: 'academic',
      icon: '🏆',
      isActive: true,
      requirements: ''
    });
    setEditingReward(null);
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      points: reward.points.toString(),
      category: reward.category,
      icon: reward.icon,
      isActive: reward.isActive,
      requirements: reward.requirements
    });
    setShowModal(true);
  };

  const handleDelete = (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      const updatedRewards = rewards.filter(reward => reward.id !== rewardId);
      saveRewards(updatedRewards);
    }
  };

  const handleAwardPoints = (activity) => {
    const newPoints = userPoints + activity.points;
    const newUserData = {
      points: newPoints,
      achievements: userAchievements
    };
    saveUserData(newUserData);
    
    // Show success message
    alert(`You earned ${activity.points} points for "${activity.activity}"! Total points: ${newPoints}`);
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesFilter = filterType === 'all' || reward.category === filterType;
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryInfo = (category) => {
    return rewardCategories.find(cat => cat.value === category) || rewardCategories[0];
  };

  const getAchievementProgress = (rewardId) => {
    const achievement = userAchievements.find(ach => ach.rewardId === rewardId);
    return achievement ? { progress: achievement.progress, total: achievement.total } : { progress: 0, total: 0 };
  };

  const getNextMilestone = () => {
    const milestones = [50, 100, 200, 500, 1000];
    return milestones.find(milestone => milestone > userPoints) || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rewards Hub</h1>
          <p className="text-gray-600">Earn points and unlock achievements</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:scale-105 transition-all"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          Add Reward
        </button>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-yellow-600">{userPoints}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-3xl font-bold text-blue-600">{userAchievements.length}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Rewards</p>
              <p className="text-3xl font-bold text-green-600">{rewards.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Milestone</p>
              <p className="text-3xl font-bold text-purple-600">
                {getNextMilestone() || 'Max'}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Points Actions */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Quick Points Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {pointActivities.map((activity, index) => (
            <button
              key={index}
              onClick={() => handleAwardPoints(activity)}
              className="p-3 border-2 rounded-lg hover:scale-105 transition-all text-left"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{activity.activity}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  +{activity.points}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getCategoryInfo(activity.category).color}`}>
                {getCategoryInfo(activity.category).label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 rounded-lg neo-shadow-small"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border-2 rounded-lg neo-shadow-small"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Categories</option>
          {rewardCategories.map(category => (
            <option key={category.value} value={category.value}>
              {category.icon} {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rewards List */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Available Rewards ({filteredRewards.length})
        </h2>
        
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRewards.map((reward) => {
              const categoryInfo = getCategoryInfo(reward.category);
              const progress = getAchievementProgress(reward.id);
              const progressPercentage = progress.total > 0 ? (progress.progress / progress.total) * 100 : 0;
              
              return (
                <div
                  key={reward.id}
                  className="p-4 border-2 rounded-lg hover:scale-105 transition-all"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{reward.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(reward)}
                        className="p-1 border rounded hover:bg-blue-50 transition-colors"
                        style={{ borderColor: 'var(--border-color)' }}
                        title="Edit Reward"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(reward.id)}
                        className="p-1 border rounded hover:bg-red-50 transition-colors"
                        style={{ borderColor: 'var(--border-color)' }}
                        title="Delete Reward"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{reward.points} points</span>
                    </div>
                    {reward.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  
                  {progress.total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.progress}/{progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {reward.requirements && (
                    <p className="text-xs text-gray-500">
                      <strong>Requirements:</strong> {reward.requirements}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No rewards found</p>
            <p className="text-sm">Create your first reward!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Reward Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="w-full max-w-md p-6 border-2 rounded-lg neo-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingReward ? 'Edit Reward' : 'Create New Reward'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reward Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {rewardCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm">Active Reward</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingReward ? 'Update Reward' : 'Create Reward'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
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
