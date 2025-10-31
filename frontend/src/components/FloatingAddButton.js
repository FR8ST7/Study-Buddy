import React, { useState } from 'react';
import { Plus, X, Calendar, FileText, Book, MessageCircle } from 'lucide-react';

export default function FloatingAddButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { icon: Calendar, label: 'Add Event', color: 'bg-blue-500' },
    { icon: FileText, label: 'Add Assignment', color: 'bg-green-500' },
    { icon: Book, label: 'Add Note', color: 'bg-purple-500' },
    { icon: MessageCircle, label: 'Start Chat', color: 'bg-orange-500' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg neo-shadow-small transition-all hover:scale-105 ${action.color} text-white`}
              style={{ borderColor: 'var(--border-color)' }}
              title={action.label}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Add Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 border-2 rounded-full neo-shadow transition-all hover:scale-105 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--accent-green)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
        title="Quick Actions"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}
