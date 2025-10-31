import React from 'react';
import { User } from 'lucide-react';

export default function ProfileSetup() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Setup</h1>
      
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Complete Your Profile
        </h2>
        <p className="text-gray-600">Profile setup features coming soon!</p>
      </div>
    </div>
  );
}
