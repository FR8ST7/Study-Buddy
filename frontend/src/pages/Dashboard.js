import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, TrendingUp, Users, Award, Plus, CheckCircle, AlertCircle, Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toLocalDateString } from '../utils';
import { dataManager } from '../utils/dataManager';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    dueAssignments: 0,
    studyTimeToday: '0h 0m',
    progressScore: '0%'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'event' | 'study'
  const [form, setForm] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: 25
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setIsLoading(true);
    try {
      const dashboardStats = dataManager.getDashboardStats();
      const activities = dataManager.getRecentActivities();
      
      setStats(dashboardStats);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setError('');
    if (action === 'event') {
      setModalType('event');
      setForm({ title: '', subject: '', date: toLocalDateString(new Date()), time: '09:00', duration: 25 });
      setModalOpen(true);
      return;
    }
    if (action === 'study') {
      setModalType('study');
      setForm({ title: '', subject: '', date: toLocalDateString(new Date()), time: '', duration: 25 });
      setModalOpen(true);
      return;
    }
    if (action === 'group') {
      navigate('/study-groups');
      return;
    }
    if (action === 'progress') {
      navigate('/analytics');
      return;
    }
  };

  const submitModal = (e) => {
    e?.preventDefault?.();
    setError('');
    try {
      if (modalType === 'event') {
        if (!form.title.trim() || !form.date) { setError('Title and date are required'); return; }
        const newEvent = dataManager.addEvent({
          title: form.title.trim(),
          date: form.date,
          time: form.time || '09:00',
          type: 'general',
          description: form.subject ? `Subject: ${form.subject}` : ''
        });
        // Optional: sync to timetable as a quick block if time is present
        try {
          if (newEvent.time) {
            const dt = new Date(newEvent.date);
            const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            const dayKey = weekdays[dt.getDay()];
            const key = 'timetable_classes';
            const raw = localStorage.getItem(key);
            const list = raw ? JSON.parse(raw) : [];
            const already = list.find(c => c.autoFromEventId === newEvent.id);
            if (!already) {
              // naive +1h end time
              const [h,m] = (newEvent.time || '09:00').split(':');
              const endHour = String((parseInt(h,10)+1)%24).padStart(2,'0');
              const endTime = `${endHour}:${m || '00'}`;
              list.push({
                id: Date.now(),
                autoFromEventId: newEvent.id,
                subject: newEvent.title,
                teacher: '',
                room: '',
                day: dayKey,
                startTime: newEvent.time,
                endTime,
                color: '#3B82F6',
                description: 'Auto-added from event'
              });
              localStorage.setItem(key, JSON.stringify(list));
            }
          }
        } catch(_e) {}
        setModalOpen(false);
        loadDashboardData();
        return;
      }
      if (modalType === 'study') {
        if (!form.subject.trim() || !form.duration) { setError('Subject and duration are required'); return; }
        dataManager.addStudySession({
          subject: form.subject.trim(),
          duration: Number(form.duration) || 25,
          date: form.date || new Date().toISOString().split('T')[0],
          type: 'focus',
          completed: false
        });
        setModalOpen(false);
        loadDashboardData();
        return;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statsData = [
    { icon: Calendar, label: 'Upcoming Events', value: stats.upcomingEvents, color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Assignments Due', value: stats.dueAssignments, color: 'bg-red-500' },
    { icon: Clock, label: 'Study Time Today', value: stats.studyTimeToday, color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Progress Score', value: stats.progressScore, color: 'bg-purple-500' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your studies today.</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="p-2 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all"
          style={{ borderColor: 'var(--border-color)' }}
          title="Refresh Dashboard"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="p-6 border-2 rounded-lg neo-shadow hover:scale-105 transition-transform cursor-pointer"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            onClick={() => {
              if (stat.label === 'Upcoming Events') handleQuickAction('event');
              if (stat.label === 'Assignments Due') handleQuickAction('study');
              if (stat.label === 'Study Time Today') handleQuickAction('study');
              if (stat.label === 'Progress Score') handleQuickAction('progress');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                     style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleQuickAction('study')}
              className="p-4 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all hover:scale-105"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Start Studying</span>
            </button>
            <button 
              onClick={() => handleQuickAction('event')}
              className="p-4 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all hover:scale-105"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Add Event</span>
            </button>
            <button 
              onClick={() => handleQuickAction('group')}
              className="p-4 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all hover:scale-105"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Join Study Group</span>
            </button>
            <button 
              onClick={() => handleQuickAction('progress')}
              className="p-4 border-2 rounded-lg neo-shadow-small hover:neo-shadow transition-all hover:scale-105"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">View Progress</span>
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg p-6 border-4 rounded-xl z-10" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{modalType === 'event' ? 'Add Event' : 'Add Study Session'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 border-2 rounded" style={{ borderColor: 'var(--border-color)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && <div className="mb-3 p-3 border-2 rounded" style={{ borderColor: '#f87171', color: '#b91c1c' }}>{error}</div>}
            <form onSubmit={submitModal} className="space-y-3">
              {modalType === 'event' && (
                <>
                  <input className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input type="date" className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <input type="time" className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  <input className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </>
              )}
              {modalType === 'study' && (
                <>
                  <input className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <input type="number" min="5" step="5" className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} placeholder="Duration (minutes)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                  <input type="date" className="w-full p-3 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="py-2 px-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>Cancel</button>
                <button type="submit" className="py-2 px-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
