import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Settings, Coffee, Target, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // focus, shortBreak, longBreak
  const [currentSession, setCurrentSession] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    focusSessions: 0,
    breakSessions: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    totalTime: 0
  });
  const [streak, setStreak] = useState(0);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionSubject, setSessionSubject] = useState('');

  const intervalRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
  }, [timeLeft, isRunning]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const todayStats = dataManager.getTodayPomodoroStats();
      const currentStreak = dataManager.getPomodoroStreak();
      setStats(todayStats);
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error loading Pomodoro data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getSessionDuration(sessionType));
  };

  const getSessionDuration = (type) => {
    switch (type) {
      case 'focus':
        return settings.focusTime * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return 25 * 60;
    }
  };

  const switchSessionType = (type) => {
    setSessionType(type);
    setTimeLeft(getSessionDuration(type));
    setIsRunning(false);
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    setShowSessionModal(true);
    
    // Auto-switch to next session type
    if (sessionType === 'focus') {
      setSessionCount(prev => prev + 1);
      if (sessionCount + 1 >= settings.sessionsUntilLongBreak) {
        setSessionType('longBreak');
        setTimeLeft(getSessionDuration('longBreak'));
        setSessionCount(0);
      } else {
        setSessionType('shortBreak');
        setTimeLeft(getSessionDuration('shortBreak'));
      }
    } else {
      setSessionType('focus');
      setTimeLeft(getSessionDuration('focus'));
    }
  };

  const saveSession = () => {
    const sessionData = {
      type: sessionType,
      duration: getSessionDuration(sessionType) / 60, // Convert to minutes
      subject: sessionSubject || 'General Study',
      notes: sessionNotes
    };

    dataManager.addPomodoroSession(sessionData);
    loadData();
    setShowSessionModal(false);
    setSessionNotes('');
    setSessionSubject('');
  };

  const getSessionTypeColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'text-red-600';
      case 'shortBreak':
        return 'text-green-600';
      case 'longBreak':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getProgressPercentage = () => {
    const totalDuration = getSessionDuration(sessionType);
    return ((totalDuration - timeLeft) / totalDuration) * 100;
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
          <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
          <p className="text-gray-600">Focus, take breaks, and track your productivity</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all"
          style={{ borderColor: 'var(--border-color)' }}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Focus Time</p>
              <p className="text-2xl font-bold">{stats.totalFocusTime}m</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Break Time</p>
              <p className="text-2xl font-bold">{stats.totalBreakTime}m</p>
            </div>
            <Coffee className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold">{streak} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Display */}
        <div className="lg:col-span-2">
      <div
        className="p-8 border-2 rounded-lg neo-shadow text-center"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
            {/* Session Type Selector */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => switchSessionType('focus')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  sessionType === 'focus' 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => switchSessionType('shortBreak')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  sessionType === 'shortBreak' 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Short Break
              </button>
              <button
                onClick={() => switchSessionType('longBreak')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  sessionType === 'longBreak' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Long Break
              </button>
            </div>

            {/* Timer Display */}
        <div className="mb-6">
              <div className="relative inline-block">
                <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getSessionTypeColor()}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <p className={`text-lg font-semibold ${getSessionTypeColor()}`}>
                      {getSessionTypeLabel()}
                    </p>
                  </div>
                </div>
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgressPercentage() / 100)}`}
                    className={sessionType === 'focus' ? 'text-red-500' : 
                             sessionType === 'shortBreak' ? 'text-green-500' : 'text-blue-500'}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
        </div>
        
            {/* Control Buttons */}
        <div className="flex justify-center gap-4">
              <button
                onClick={isRunning ? pauseTimer : startTimer}
                className="p-4 border-2 rounded-full neo-shadow-small hover:neo-shadow transition-all"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-4 border-2 rounded-full neo-shadow-small hover:neo-shadow transition-all"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <RotateCcw className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="space-y-4">
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
              Session Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Session:</span>
                <span className="font-semibold">{getSessionTypeLabel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{getSessionDuration(sessionType) / 60} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sessions Today:</span>
                <span className="font-semibold">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Long Break:</span>
                <span className="font-semibold">{settings.sessionsUntilLongBreak - sessionCount} sessions</span>
              </div>
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
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quick Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Focus for 25 minutes, then take a 5-minute break</p>
              <p>• After 4 focus sessions, take a 15-minute long break</p>
              <p>• Use breaks to rest your eyes and stretch</p>
              <p>• Track your sessions to build good habits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setTimeLeft(getSessionDuration(sessionType));
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Session Complete Modal */}
      {showSessionModal && (
        <SessionCompleteModal
          sessionType={sessionType}
          duration={getSessionDuration(sessionType) / 60}
          notes={sessionNotes}
          subject={sessionSubject}
          onNotesChange={setSessionNotes}
          onSubjectChange={setSessionSubject}
          onSave={saveSession}
          onClose={() => setShowSessionModal(false)}
        />
      )}
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
          <h3 className="text-xl font-bold">Timer Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Focus Time (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={formData.focusTime}
              onChange={(e) => setFormData({...formData, focusTime: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.shortBreak}
              onChange={(e) => setFormData({...formData, shortBreak: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={formData.longBreak}
              onChange={(e) => setFormData({...formData, longBreak: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sessions Until Long Break</label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.sessionsUntilLongBreak}
              onChange={(e) => setFormData({...formData, sessionsUntilLongBreak: parseInt(e.target.value)})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Settings
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

// Session Complete Modal Component
function SessionCompleteModal({ sessionType, duration, notes, subject, onNotesChange, onSubjectChange, onSave, onClose }) {
  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Session';
    }
  };

  const getSessionTypeColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'text-red-600';
      case 'shortBreak':
        return 'text-green-600';
      case 'longBreak':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
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
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Session Complete!</h3>
          <p className={`text-lg font-semibold ${getSessionTypeColor()}`}>
            {getSessionTypeLabel()} ({duration} minutes)
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="What were you working on?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Any notes about this session..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Session
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
