import React from 'react';
import { Upload, Plus } from 'lucide-react';

export default function ResourceHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resource Hub</h1>
        <button className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
          <Plus className="w-4 h-4" />
          Upload Resource
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
          <Upload className="w-5 h-5" />
          Study Resources
        </h2>
        <p className="text-gray-600">Resource management features coming soon!</p>
      </div>
    </div>
  );
}
