import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, User, MapPin, Phone, Mail, CheckCircle, XCircle, AlertCircle, Filter, Search } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'parent_teacher',
    date: '',
    time: '',
    duration: '30',
    location: '',
    teacher: '',
    parent: '',
    student: '',
    phone: '',
    email: '',
    notes: '',
    status: 'scheduled'
  });

  const appointmentTypes = [
    { value: 'parent_teacher', label: 'Parent-Teacher Conference', icon: '👥' },
    { value: 'academic_review', label: 'Academic Review', icon: '📚' },
    { value: 'behavior_discussion', label: 'Behavior Discussion', icon: '💬' },
    { value: 'progress_meeting', label: 'Progress Meeting', icon: '📈' },
    { value: 'emergency', label: 'Emergency Meeting', icon: '🚨' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    rescheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const statusIcons = {
    scheduled: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
    rescheduled: <AlertCircle className="w-4 h-4" />
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Add some sample appointments
      const sampleAppointments = [
        {
          id: 1,
          title: 'Math Progress Review',
          type: 'academic_review',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          duration: '30',
          location: 'Room 201',
          teacher: 'Ms. Johnson',
          parent: 'Mrs. Smith',
          student: 'John Smith',
          phone: '555-0123',
          email: 'parent@email.com',
          notes: 'Discuss recent test scores and improvement strategies',
          status: 'scheduled',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Behavior Discussion',
          type: 'behavior_discussion',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '15:30',
          duration: '45',
          location: 'Office',
          teacher: 'Mr. Davis',
          parent: 'Mr. Brown',
          student: 'Sarah Brown',
          phone: '555-0456',
          email: 'brown@email.com',
          notes: 'Discuss classroom behavior and positive reinforcement strategies',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ];
      setAppointments(sampleAppointments);
      localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    }
  };

  const saveAppointments = (newAppointments) => {
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: editingAppointment ? editingAppointment.id : Date.now(),
      ...formData,
      createdAt: editingAppointment ? editingAppointment.createdAt : new Date().toISOString()
    };

    let updatedAppointments;
    if (editingAppointment) {
      updatedAppointments = appointments.map(apt => apt.id === editingAppointment.id ? newAppointment : apt);
    } else {
      updatedAppointments = [...appointments, newAppointment];
    }
    
    saveAppointments(updatedAppointments);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'parent_teacher',
      date: '',
      time: '',
      duration: '30',
      location: '',
      teacher: '',
      parent: '',
      student: '',
      phone: '',
      email: '',
      notes: '',
      status: 'scheduled'
    });
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      location: appointment.location,
      teacher: appointment.teacher,
      parent: appointment.parent,
      student: appointment.student,
      phone: appointment.phone,
      email: appointment.email,
      notes: appointment.notes,
      status: appointment.status
    });
    setShowModal(true);
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
      saveAppointments(updatedAppointments);
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    saveAppointments(updatedAppointments);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || appointment.date === selectedDate;
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return aptDate >= today && apt.status !== 'completed' && apt.status !== 'cancelled';
  }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)).slice(0, 5);

  const getAppointmentTypeInfo = (type) => {
    return appointmentTypes.find(t => t.value === type) || appointmentTypes[0];
  };

  const getUpcomingCount = () => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return aptDate >= today && apt.status !== 'completed' && apt.status !== 'cancelled';
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Schedule and manage parent-teacher meetings</p>
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
          Schedule Appointment
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
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold">{getUpcomingCount()}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-500" />
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
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold">
                {appointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return aptDate >= today && aptDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 rounded-lg neo-shadow-small"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 rounded-lg neo-shadow-small"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2">
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
              Appointments ({filteredAppointments.length})
            </h2>
            
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const typeInfo = getAppointmentTypeInfo(appointment.type);
                  return (
                    <div
                      key={appointment.id}
                      className="p-4 border-2 rounded-lg hover:scale-105 transition-all"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{typeInfo.icon}</span>
                            <h3 className="font-bold text-lg">{appointment.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${statusColors[appointment.status]}`}>
                              {statusIcons[appointment.status]}
                              {appointment.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                {appointment.time} ({appointment.duration} min)
                              </div>
                              {appointment.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  {appointment.location}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span className="font-medium">Teacher:</span> {appointment.teacher}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span className="font-medium">Parent:</span> {appointment.parent}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span className="font-medium">Student:</span> {appointment.student}
                              </div>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mb-2">{appointment.notes}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {appointment.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {appointment.phone}
                              </div>
                            )}
                            {appointment.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {appointment.email}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(appointment)}
                              className="p-2 border-2 rounded-lg hover:bg-blue-50 transition-colors"
                              style={{ borderColor: 'var(--border-color)' }}
                              title="Edit Appointment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(appointment.id)}
                              className="p-2 border-2 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ borderColor: 'var(--border-color)' }}
                              title="Delete Appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {appointment.status === 'scheduled' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No appointments found</p>
                <p className="text-sm">Schedule your first appointment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments Sidebar */}
        <div>
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
              Upcoming Appointments
            </h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => {
                  const typeInfo = getAppointmentTypeInfo(appointment.type);
                  return (
                    <div
                      key={appointment.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <h4 className="font-semibold text-sm">{appointment.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {appointment.teacher} • {appointment.parent}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${statusColors[appointment.status]}`}>
                        {appointment.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="w-full max-w-2xl p-6 border-2 rounded-lg neo-shadow max-h-[90vh] overflow-y-auto"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Appointment Title</label>
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
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {appointmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Parent/Guardian</label>
                  <input
                    type="text"
                    required
                    value={formData.parent}
                    onChange={(e) => setFormData({...formData, parent: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student</label>
                  <input
                    type="text"
                    required
                    value={formData.student}
                    onChange={(e) => setFormData({...formData, student: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              {editingAppointment && (
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
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
