import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit, Trash2, BookOpen, User, MapPin, Calendar } from 'lucide-react';

export default function Timetable() {
  const timeSlots = [
    { time: '8:00', display: '8:00 AM' },
    { time: '9:00', display: '9:00 AM' },
    { time: '10:00', display: '10:00 AM' },
    { time: '11:00', display: '11:00 AM' },
    { time: '12:00', display: '12:00 PM' },
    { time: '13:00', display: '1:00 PM' },
    { time: '14:00', display: '2:00 PM' },
    { time: '15:00', display: '3:00 PM' },
    { time: '16:00', display: '4:00 PM' },
    { time: '17:00', display: '5:00 PM' }
  ];

  const days = [
    { key: 'monday', name: 'Monday' },
    { key: 'tuesday', name: 'Tuesday' },
    { key: 'wednesday', name: 'Wednesday' },
    { key: 'thursday', name: 'Thursday' },
    { key: 'friday', name: 'Friday' }
  ];

  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: '',
    startTime: '',
    endTime: '',
    color: '#3B82F6',
    description: ''
  });

  const subjectColors = {
    'Mathematics': '#EF4444',
    'Science': '#10B981',
    'English': '#3B82F6',
    'History': '#F59E0B',
    'Geography': '#8B5CF6',
    'Art': '#EC4899',
    'Physical Education': '#06B6D4',
    'Music': '#84CC16',
    'Computer Science': '#F97316',
    'Chemistry': '#14B8A6',
    'Physics': '#6366F1',
    'Biology': '#22C55E'
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const savedClasses = localStorage.getItem('timetable_classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  };

  const saveClasses = (newClasses) => {
    localStorage.setItem('timetable_classes', JSON.stringify(newClasses));
    setClasses(newClasses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newClass = {
      id: editingClass ? editingClass.id : Date.now(),
      ...formData,
      color: subjectColors[formData.subject] || formData.color
    };

    let updatedClasses;
    if (editingClass) {
      updatedClasses = classes.map(cls => cls.id === editingClass.id ? newClass : cls);
    } else {
      updatedClasses = [...classes, newClass];
    }
    
    saveClasses(updatedClasses);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      teacher: '',
      room: '',
      day: '',
      startTime: '',
      endTime: '',
      color: '#3B82F6',
      description: ''
    });
    setEditingClass(null);
    setSelectedSlot(null);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      subject: classItem.subject,
      teacher: classItem.teacher,
      room: classItem.room,
      day: classItem.day,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      color: classItem.color,
      description: classItem.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const updatedClasses = classes.filter(cls => cls.id !== classId);
      saveClasses(updatedClasses);
    }
  };

  const handleSlotClick = (day, time) => {
    setSelectedSlot({ day, time });
    setFormData(prev => ({
      ...prev,
      day: day.key,
      startTime: time.time
    }));
    setShowModal(true);
  };

  const getClassForSlot = (day, time) => {
    return classes.find(cls => 
      cls.day === day.key && 
      cls.startTime === time.time
    );
  };

  const getClassesForDay = (day) => {
    return classes.filter(cls => cls.day === day.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayKey = days.find(d => d.name.toLowerCase() === today)?.key;
    return classes.filter(cls => cls.day === dayKey);
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return classes.filter(cls => {
      const classTime = cls.startTime;
      return classTime > currentTime;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime)).slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-gray-600">Your weekly class schedule</p>
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
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Timetable */}
        <div className="lg:col-span-3">
          <div
            className="p-6 border-2 rounded-lg neo-shadow overflow-x-auto"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="grid grid-cols-6 gap-2 min-w-[700px]">
              {/* Header */}
              <div className="p-3 font-bold text-center border-2 rounded-lg"
                   style={{ borderColor: 'var(--border-color)' }}>
                Time
              </div>
              {days.map(day => (
                <div key={day.key} className="p-3 font-bold text-center border-2 rounded-lg"
                     style={{ borderColor: 'var(--border-color)' }}>
                  {day.name}
                </div>
              ))}
              
              {/* Time slots */}
              {timeSlots.map(time => (
                <React.Fragment key={time.time}>
                  <div className="p-2 text-sm text-center border-2 rounded-lg font-medium"
                       style={{ borderColor: 'var(--border-color)' }}>
                    {time.display}
                  </div>
                  {days.map(day => {
                    const classItem = getClassForSlot(day, time);
                    return (
                      <div 
                        key={`${day.key}-${time.time}`} 
                        className="p-2 h-20 border-2 rounded-lg cursor-pointer hover:scale-105 transition-all relative"
                        style={{ 
                          borderColor: 'var(--border-color)',
                          backgroundColor: classItem ? classItem.color + '20' : 'transparent'
                        }}
                        onClick={() => handleSlotClick(day, time)}
                      >
                        {classItem ? (
                          <div className="h-full flex flex-col justify-center">
                            <div className="font-semibold text-sm truncate" style={{ color: classItem.color }}>
                              {classItem.subject}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {classItem.teacher}
                            </div>
                            {classItem.room && (
                              <div className="text-xs text-gray-500 truncate">
                                {classItem.room}
                              </div>
                            )}
                            <div className="absolute top-1 right-1 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(classItem);
                                }}
                                className="p-1 rounded hover:bg-white hover:bg-opacity-50"
                                title="Edit Class"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(classItem.id);
                                }}
                                className="p-1 rounded hover:bg-white hover:bg-opacity-50"
                                title="Delete Class"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                            Click to add class
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Classes */}
          <div
            className="p-6 border-2 rounded-lg neo-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Classes
            </h2>
            
            {getTodayClasses().length > 0 ? (
              <div className="space-y-3">
                {getTodayClasses().map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-3 border rounded-lg"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: classItem.color + '10'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: classItem.color }}
                      ></div>
                      <h4 className="font-semibold text-sm">{classItem.subject}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{classItem.teacher}</p>
                    <p className="text-xs text-gray-500">
                      {timeSlots.find(t => t.time === classItem.startTime)?.display}
                      {classItem.room && ` • ${classItem.room}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No classes today</p>
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
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
              Upcoming Classes
            </h2>
            
            {getUpcomingClasses().length > 0 ? (
              <div className="space-y-3">
                {getUpcomingClasses().map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-3 border rounded-lg"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: classItem.color + '10'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: classItem.color }}
                      ></div>
                      <h4 className="font-semibold text-sm">{classItem.subject}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{classItem.teacher}</p>
                    <p className="text-xs text-gray-500">
                      {days.find(d => d.key === classItem.day)?.name} • 
                      {timeSlots.find(t => t.time === classItem.startTime)?.display}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No upcoming classes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Class Modal */}
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
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Art">Art</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Music">Music</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <input
                  type="text"
                  required
                  value={formData.teacher}
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
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
                  <label className="block text-sm font-medium mb-1">Day</label>
                  <select
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day.key} value={day.key}>{day.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <select
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time.time} value={time.time}>{time.display}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <select
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select End Time</option>
                  {timeSlots.map(time => (
                    <option key={time.time} value={time.time}>{time.display}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
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
