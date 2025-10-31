import React, { useEffect, useState } from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import { getDarkMode as themeGetDarkMode, setDarkMode as themeSetDarkMode } from '../utils/theme';

export default function ThemeCustomizer() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(themeGetDarkMode());
    const onTheme = (e) => setDark(Boolean(e.detail?.value));
    window.addEventListener('theme:darkModeChanged', onTheme);
    return () => window.removeEventListener('theme:darkModeChanged', onTheme);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    themeSetDarkMode(next);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Theme Customizer</h1>
      
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Customize Your Theme
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border-2 rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <button onClick={toggleDark} className="py-2 px-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {dark ? 'Disable' : 'Enable'}
            </button>
          </div>
          <p className="text-sm text-gray-600">Dark mode applies across the app and is saved per account.</p>
        </div>
      </div>
    </div>
  );
}
