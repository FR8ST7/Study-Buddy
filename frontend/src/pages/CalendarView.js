import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { toLocalDateString } from '../utils';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    const onEvents = () => loadEvents();
    window.addEventListener('data:eventsChanged', onEvents);
    return () => window.removeEventListener('data:eventsChanged', onEvents);
  }, []);

  const loadEvents = () => {
    setIsLoading(true);
    try {
      const allEvents = dataManager.getEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = toLocalDateString(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
    setEditingEvent(null);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      dataManager.updateEvent(editingEvent.id, eventData);
    } else {
      dataManager.addEvent({
        ...eventData,
        date: toLocalDateString(selectedDate)
      });
    }
    loadEvents();
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dataManager.deleteEvent(eventId);
      loadEvents();
      setShowEventModal(false);
      setEditingEvent(null);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'bg-red-100 text-red-800 border-red-200',
      study: 'bg-blue-100 text-blue-800 border-blue-200',
      meeting: 'bg-green-100 text-green-800 border-green-200',
      assignment: 'bg-purple-100 text-purple-800 border-purple-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.other;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-gray-600">Manage your events and schedule</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowEventModal(true);
            setEditingEvent(null);
          }}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:neo-shadow transition-all"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 border-2 rounded-lg hover:neo-shadow transition-all"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 border-2 rounded-lg hover:neo-shadow transition-all"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {days.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-sm bg-gray-50">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {getDaysInMonth(currentDate).map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-blue-50 border-blue-300' : ''
                } ${isSelected ? 'bg-blue-100 border-blue-400' : ''}`}
                style={{ borderColor: 'var(--border-color)' }}
                onClick={() => date && handleDateClick(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.type)}`}
                        >
                          <div className="truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{event.time}</div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {events.length > 0 ? (
            events.slice(0, 5).map(event => (
              <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${getEventTypeColor(event.type)}`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEventClick(event)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No events scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

// Event Modal Component
function EventModal({ event, selectedDate, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    type: 'other',
    location: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        time: event.time || '',
        type: event.type || 'other',
        location: event.location || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        time: '',
        type: 'other',
        location: ''
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
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
          <h3 className="text-xl font-bold">
            {event ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="exam">Exam</option>
              <option value="study">Study Session</option>
              <option value="meeting">Meeting</option>
              <option value="assignment">Assignment Due</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Optional description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {event ? 'Update Event' : 'Add Event'}
            </button>
            {event && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
