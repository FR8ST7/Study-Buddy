import React, { useState, useEffect } from 'react';
import { X, Heart, Star, Trophy } from 'lucide-react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you."
];

export default function MotivationCard() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm p-4 border-2 rounded-lg neo-shadow z-50"
         style={{ 
           backgroundColor: 'var(--bg-card)', 
           borderColor: 'var(--border-color)',
           color: 'var(--text-primary)'
         }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-sm font-semibold">Daily Motivation</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm mb-3 italic">"{currentQuote}"</p>
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-xs">Keep up the great work!</span>
      </div>
    </div>
  );
}
