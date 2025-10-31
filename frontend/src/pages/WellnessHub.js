import React from 'react';
import { Heart, Plus } from 'lucide-react';

export default function WellnessHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wellness Hub</h1>
        <button className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
          <Plus className="w-4 h-4" />
          Add Wellness Activity
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
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Wellness Activities
        </h2>
        <p className="text-gray-600">Wellness tracking features coming soon!</p>
      </div>
    </div>
  );
}
