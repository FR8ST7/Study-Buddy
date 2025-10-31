import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Calendar, Clock, AlertCircle, CheckCircle, Filter, Search } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function AssignmentHub() {
  const [assignments, setAssignments] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    setIsLoading(true);
    try {
      const allAssignments = dataManager.getAssignments();
      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowAssignmentModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleSaveAssignment = (assignmentData) => {
    if (editingAssignment) {
      dataManager.updateAssignment(editingAssignment.id, assignmentData);
    } else {
      dataManager.addAssignment(assignmentData);
    }
    loadAssignments();
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      dataManager.deleteAssignment(assignmentId);
      loadAssignments();
    }
  };

  const handleStatusChange = (assignmentId, newStatus) => {
    dataManager.updateAssignment(assignmentId, { status: newStatus });
    loadAssignments();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || assignment.priority === filterPriority;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getUpcomingAssignments = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= today && dueDate <= nextWeek && assignment.status !== 'completed';
    });
  };

  const getOverdueAssignments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && assignment.status !== 'completed';
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }

  const upcomingAssignments = getUpcomingAssignments();
  const overdueAssignments = getOverdueAssignments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignment Hub</h1>
          <p className="text-gray-600">Manage your assignments and track progress</p>
        </div>
        <button
          onClick={handleAddAssignment}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:neo-shadow transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          Add Assignment
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
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
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
              <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
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
              <p className="text-2xl font-bold">{upcomingAssignments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
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
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold">{overdueAssignments.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="p-4 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg"
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Assignments ({filteredAssignments.length})
        </h2>
        
        {filteredAssignments.length > 0 ? (
          <div className="space-y-3">
            {filteredAssignments.map(assignment => (
              <div
                key={assignment.id}
                className="p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(assignment.status)}
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {assignment.description && (
                      <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(assignment.id, 'in_progress')}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          assignment.status === 'in_progress' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                        }`}
                      >
                        Start
                      </button>
                      <button
                        onClick={() => handleStatusChange(assignment.id, 'completed')}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          assignment.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No assignments found</p>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <AssignmentModal
          assignment={editingAssignment}
          onSave={handleSaveAssignment}
          onClose={() => {
            setShowAssignmentModal(false);
            setEditingAssignment(null);
          }}
        />
      )}
    </div>
  );
}

// Assignment Modal Component
function AssignmentModal({ assignment, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        subject: assignment.subject || '',
        description: assignment.description || '',
        dueDate: assignment.dueDate || '',
        priority: assignment.priority || 'medium',
        status: assignment.status || 'pending'
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        subject: '',
        description: '',
        dueDate: tomorrow.toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending'
      });
    }
  }, [assignment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg border-2 neo-shadow max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {assignment ? 'Edit Assignment' : 'Add New Assignment'}
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
            <label className="block text-sm font-medium mb-1">Assignment Title</label>
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
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {assignment && (
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border-2 rounded-lg"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

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
              {assignment ? 'Update Assignment' : 'Add Assignment'}
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
