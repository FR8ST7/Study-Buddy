import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Crown, Star, TrendingUp, Users, Calendar, Filter, Search } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const timePeriods = [
    { value: 'all', label: 'All Time', icon: '📅' },
    { value: 'week', label: 'This Week', icon: '📆' },
    { value: 'month', label: 'This Month', icon: '🗓️' },
    { value: 'semester', label: 'This Semester', icon: '📚' }
  ];

  const categories = [
    { value: 'all', label: 'Overall', icon: '🏆' },
    { value: 'academic', label: 'Academic', icon: '📚' },
    { value: 'behavior', label: 'Behavior', icon: '⭐' },
    { value: 'participation', label: 'Participation', icon: '🙋‍♂️' },
    { value: 'achievement', label: 'Achievement', icon: '🎯' }
  ];

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = () => {
    const savedData = localStorage.getItem('leaderboard_data');
    if (savedData) {
      setLeaderboardData(JSON.parse(savedData));
    } else {
      // Generate sample leaderboard data
      const sampleData = [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: '👧',
          role: 'student',
          class: '10A',
          totalPoints: 485,
          academicPoints: 180,
          behaviorPoints: 120,
          participationPoints: 95,
          achievementPoints: 90,
          rank: 1,
          weeklyChange: 2,
          monthlyChange: 8,
          achievements: [
            { id: 1, title: 'Math Master', icon: '🧮', earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 2, title: 'Perfect Attendance', icon: '📅', earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: 'Mike Chen',
          avatar: '👦',
          role: 'student',
          class: '10A',
          totalPoints: 420,
          academicPoints: 160,
          behaviorPoints: 100,
          participationPoints: 80,
          achievementPoints: 80,
          rank: 2,
          weeklyChange: -1,
          monthlyChange: 5,
          achievements: [
            { id: 3, title: 'Helping Hand', icon: '🤝', earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: 'Emily Davis',
          avatar: '👧',
          role: 'student',
          class: '10A',
          totalPoints: 395,
          academicPoints: 150,
          behaviorPoints: 95,
          participationPoints: 75,
          achievementPoints: 75,
          rank: 3,
          weeklyChange: 3,
          monthlyChange: 12,
          achievements: [
            { id: 4, title: 'Study Group Leader', icon: '👥', earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          name: 'John Smith',
          avatar: '👦',
          role: 'student',
          class: '10A',
          totalPoints: 350,
          academicPoints: 140,
          behaviorPoints: 80,
          participationPoints: 70,
          achievementPoints: 60,
          rank: 4,
          weeklyChange: 0,
          monthlyChange: 3,
          achievements: [],
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          name: 'Lisa Brown',
          avatar: '👧',
          role: 'student',
          class: '10A',
          totalPoints: 320,
          academicPoints: 130,
          behaviorPoints: 75,
          participationPoints: 65,
          achievementPoints: 50,
          rank: 5,
          weeklyChange: 1,
          monthlyChange: 7,
          achievements: [],
          lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 6,
          name: 'Alex Wilson',
          avatar: '👦',
          role: 'student',
          class: '10A',
          totalPoints: 285,
          academicPoints: 120,
          behaviorPoints: 70,
          participationPoints: 55,
          achievementPoints: 40,
          rank: 6,
          weeklyChange: -2,
          monthlyChange: 2,
          achievements: [],
          lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 7,
          name: 'You',
          avatar: '👤',
          role: 'student',
          class: '10A',
          totalPoints: 125,
          academicPoints: 50,
          behaviorPoints: 30,
          participationPoints: 25,
          achievementPoints: 20,
          rank: 7,
          weeklyChange: 4,
          monthlyChange: 15,
          achievements: [
            { id: 1, title: 'Math Master', icon: '🧮', earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 2, title: 'Helping Hand', icon: '🤝', earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];
      setLeaderboardData(sampleData);
      localStorage.setItem('leaderboard_data', JSON.stringify(sampleData));
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gray-100 border-gray-300';
      case 3:
        return 'bg-amber-100 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    }
    return <span className="w-4 h-4 text-gray-400">—</span>;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getCategoryPoints = (student, category) => {
    switch (category) {
      case 'academic':
        return student.academicPoints;
      case 'behavior':
        return student.behaviorPoints;
      case 'participation':
        return student.participationPoints;
      case 'achievement':
        return student.achievementPoints;
      default:
        return student.totalPoints;
    }
  };

  const filteredData = leaderboardData
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aPoints = getCategoryPoints(a, filterCategory);
      const bPoints = getCategoryPoints(b, filterCategory);
      return bPoints - aPoints;
    })
    .map((student, index) => ({
      ...student,
      displayRank: index + 1
    }));

  const getCurrentUserRank = () => {
    const currentUser = filteredData.find(student => student.name === 'You');
    return currentUser ? currentUser.displayRank : null;
  };

  const getTopPerformers = () => {
    return filteredData.slice(0, 3);
  };

  const getClassStats = () => {
    const totalStudents = leaderboardData.length;
    const totalPoints = leaderboardData.reduce((sum, student) => sum + student.totalPoints, 0);
    const averagePoints = Math.round(totalPoints / totalStudents);
    const activeStudents = leaderboardData.filter(student => {
      const lastActivity = new Date(student.lastActivity);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastActivity > oneDayAgo;
    }).length;

    return { totalStudents, totalPoints, averagePoints, activeStudents };
  };

  const classStats = getClassStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
      <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-600">Class rankings and achievements</p>
        </div>
      </div>

      {/* Class Stats */}
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
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{classStats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold">{classStats.totalPoints}</p>
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
              <p className="text-sm text-gray-600">Average Points</p>
              <p className="text-2xl font-bold">{classStats.averagePoints}</p>
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
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="text-2xl font-bold">{classStats.activeStudents}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {getTopPerformers().length >= 3 && (
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top Performers
          </h2>
          
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            {getTopPerformers()[1] && (
              <div className="text-center">
                <div className={`p-4 border-2 rounded-lg ${getRankColor(2)}`}>
                  <div className="text-3xl mb-2">{getTopPerformers()[1].avatar}</div>
                  <div className="font-bold text-lg">{getTopPerformers()[1].name}</div>
                  <div className="text-sm text-gray-600">{getCategoryPoints(getTopPerformers()[1], filterCategory)} pts</div>
                </div>
                <div className="mt-2 text-2xl">🥈</div>
              </div>
            )}
            
            {/* 1st Place */}
            {getTopPerformers()[0] && (
              <div className="text-center">
                <div className={`p-6 border-2 rounded-lg ${getRankColor(1)}`}>
                  <div className="text-4xl mb-2">{getTopPerformers()[0].avatar}</div>
                  <div className="font-bold text-xl">{getTopPerformers()[0].name}</div>
                  <div className="text-sm text-gray-600">{getCategoryPoints(getTopPerformers()[0], filterCategory)} pts</div>
                </div>
                <div className="mt-2 text-3xl">🥇</div>
              </div>
            )}
            
            {/* 3rd Place */}
            {getTopPerformers()[2] && (
              <div className="text-center">
                <div className={`p-4 border-2 rounded-lg ${getRankColor(3)}`}>
                  <div className="text-3xl mb-2">{getTopPerformers()[2].avatar}</div>
                  <div className="font-bold text-lg">{getTopPerformers()[2].name}</div>
                  <div className="text-sm text-gray-600">{getCategoryPoints(getTopPerformers()[2], filterCategory)} pts</div>
                </div>
                <div className="mt-2 text-2xl">🥉</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
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
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border-2 rounded-lg neo-shadow-small"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border-2 rounded-lg neo-shadow-small"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {timePeriods.map(period => (
              <option key={period.value} value={period.value}>
                {period.icon} {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Class Rankings ({filteredData.length})
        </h2>
        
        {filteredData.length > 0 ? (
          <div className="space-y-3">
            {filteredData.map((student) => {
              const categoryPoints = getCategoryPoints(student, filterCategory);
              const isCurrentUser = student.name === 'You';
              
              return (
                <div
                  key={student.id}
                  className={`p-4 border-2 rounded-lg hover:scale-105 transition-all ${
                    isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  style={{ 
                    borderColor: isCurrentUser ? 'var(--border-color)' : 'var(--border-color)',
                    backgroundColor: isCurrentUser ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(student.displayRank)}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{student.avatar}</span>
                        <div>
                          <h3 className="font-bold text-lg">
                            {student.name}
                            {isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
                          </h3>
                          <p className="text-sm text-gray-600">Class {student.class}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-lg">{categoryPoints}</span>
                          <span className="text-sm text-gray-600">pts</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {getChangeIcon(student.weeklyChange)}
                          <span className={getChangeColor(student.weeklyChange)}>
                            {student.weeklyChange > 0 ? '+' : ''}{student.weeklyChange} this week
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Achievements</div>
                        <div className="flex gap-1">
                          {student.achievements.slice(0, 3).map((achievement) => (
                            <span key={achievement.id} className="text-lg" title={achievement.title}>
                              {achievement.icon}
                            </span>
                          ))}
                          {student.achievements.length > 3 && (
                            <span className="text-sm text-gray-500">+{student.achievements.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {filterCategory === 'all' && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-gray-600">Academic</div>
                          <div className="font-semibold">{student.academicPoints}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Behavior</div>
                          <div className="font-semibold">{student.behaviorPoints}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Participation</div>
                          <div className="font-semibold">{student.participationPoints}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Achievement</div>
                          <div className="font-semibold">{student.achievementPoints}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Your Current Rank */}
      {getCurrentUserRank() && (
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
            Your Current Rank
          </h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">#{getCurrentUserRank()}</div>
            <p className="text-gray-600">Keep up the great work!</p>
          </div>
        </div>
      )}
    </div>
  );
}
