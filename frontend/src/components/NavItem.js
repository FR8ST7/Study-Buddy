import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function NavItem({ item, isSidebarCollapsed }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const isActive = location.pathname === item.href;

  const handleClick = () => {
    if (hasSubItems) {
      setIsExpanded(!isExpanded);
    }
  };

  if (hasSubItems) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={`flex items-center justify-between w-full p-3 border-2 rounded-lg transition-all ${
            isActive ? 'neo-shadow' : 'hover:neo-shadow'
          }`}
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
          title={isSidebarCollapsed ? item.name : ''}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
          </div>
          {!isSidebarCollapsed && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && !isSidebarCollapsed && (
          <div className="ml-4 mt-2 space-y-2">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`flex items-center gap-3 p-2 border-2 rounded-lg transition-all ${
                  location.pathname === subItem.href ? 'neo-shadow' : 'hover:neo-shadow'
                }`}
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <subItem.icon className="w-4 h-4" />
                <span className="text-sm">{subItem.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
        isActive ? 'neo-shadow' : 'hover:neo-shadow'
      }`}
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
      title={isSidebarCollapsed ? item.name : ''}
    >
      <item.icon className="w-5 h-5" />
      {!isSidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
    </Link>
  );
}
