import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <SearchIcon className="w-5 h-5" />
          Search Everything
        </h2>
        <p className="text-gray-600">Global search features coming soon!</p>
      </div>
    </div>
  );
}
