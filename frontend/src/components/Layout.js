import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { BookOpen, Calendar, MessageCircle, LogOut, Upload, Brain, Moon, Sun, Bot, History, Users, TrendingUp, Search as SearchIcon, FileText, Palette, ChevronsLeft, ChevronsRight, LayoutDashboard, Feather, Book, Clock, Heart, Trophy, Award, User as UserIcon } from "lucide-react";
import { User } from '../entities/User';
import MotivationCard from './MotivationCard';
import { getDarkMode as themeGetDarkMode, setDarkMode as themeSetDarkMode } from '../utils/theme';
import NavItem from './NavItem';
import FloatingAddButton from "./FloatingAddButton";

const navItems = [
  { name: "Dashboard", href: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { 
    name: "Calendar", 
    icon: Calendar,
    subItems: [
      { name: "Shared Calendar", href: createPageUrl("SharedCalendar"), icon: Users },
      { name: "Personal Calendar", href: createPageUrl("CalendarView"), icon: Calendar },
      { name: "Timetable", href: createPageUrl("Timetable"), icon: Calendar }
    ]
  },
  { 
    name: "Assignments & Tasks", 
    icon: FileText,
    subItems: [
      { name: "Assignments Hub", href: createPageUrl("AssignmentHub"), icon: FileText },
      { name: "Appointments", href: createPageUrl("Appointments"), icon: Calendar }
    ]
  },
  { 
    name: "Study Tools", 
    icon: Book,
    subItems: [
      { name: "Flashcards", href: createPageUrl("Flashcards"), icon: Brain },
      { name: "Quick Reference", href: createPageUrl("QuickReference"), icon: FileText },
      { name: "Resource Hub", href: createPageUrl("ResourceHub"), icon: Upload },
      { name: "AI Document Assistant", href: createPageUrl("AIDocumentAssistant"), icon: Bot }
    ]
  },
  { 
    name: "Communication", 
    icon: MessageCircle,
    subItems: [
      { name: "Class & Parent Chat", href: createPageUrl("ClassChat"), icon: MessageCircle },
      { name: "AI Study Buddy", href: createPageUrl("AIChat"), icon: Bot },
      { name: "Chat History", href: createPageUrl("ChatHistory"), icon: History },
      { name: "Study Groups", href: createPageUrl("StudyGroups"), icon: Users }
    ]
  },
  { 
    name: "Productivity", 
    icon: TrendingUp,
    subItems: [
      { name: "Pomodoro Timer", href: createPageUrl("PomodoroTimer"), icon: Clock },
      { name: "Wellness Hub", href: createPageUrl("WellnessHub"), icon: Heart },
      { name: "Analytics", href: createPageUrl("Analytics"), icon: TrendingUp }
    ]
  },
  { 
    name: "Rewards & Competition", 
    icon: Trophy,
    subItems: [
      { name: "Rewards Hub", href: createPageUrl("RewardsHub"), icon: Trophy },
      { name: "Leaderboard", href: createPageUrl("Leaderboard"), icon: Award }
    ]
  },
  { name: "Search", href: createPageUrl("Search"), icon: SearchIcon },
  { 
    name: "Customization", 
    icon: Feather,
    subItems: [
      { name: "Theme", href: createPageUrl("ThemeCustomizer"), icon: Palette },
      { name: "Account", href: createPageUrl("Account"), icon: UserIcon }
    ]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [darkMode, setDarkModeState] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const checkUserProfile = useCallback(async () => {
    try {
      // Mock user for demo purposes
      const mockUser = {
        id: 1,
        name: "Demo User",
        account_type: "student",
        class_name: "10A",
        profile_completed: true,
        dark_mode: false,
        background_color: '#FDFD96',
        accent_color: '#87CEEB',
        font_family: 'space-grotesk'
      };
      setUser(mockUser);
      const initialDark = themeGetDarkMode();
      setDarkModeState(initialDark);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsCheckingProfile(false);
  }, [location.pathname]);

  useEffect(() => {
    checkUserProfile();
  }, [checkUserProfile]);

  const handleLogout = async () => {
    try {
      const { logout } = await import('../utils/auth');
      logout();
    } catch (_e) {
      // ignore
    }
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const onTheme = (e) => {
      setDarkModeState(Boolean(e.detail?.value));
    };
    window.addEventListener('theme:darkModeChanged', onTheme);
    return () => window.removeEventListener('theme:darkModeChanged', onTheme);
  }, []);

  const handleToggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    themeSetDarkMode(newMode);
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-[#FDFD96] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }
  
  const userBg = user?.background_color || '#FDFD96';
  const userAccent = user?.accent_color || '#87CEEB';
  const userFont = user?.font_family || 'space-grotesk';

  const getFontFamily = () => {
    const fontMap = {
      'space-grotesk': "'Space Grotesk', sans-serif",
      'inter': "'Inter', sans-serif", 
      'poppins': "'Poppins', sans-serif",
      'roboto': "'Roboto', sans-serif"
    };
    return fontMap[userFont] || fontMap['space-grotesk'];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        
        :root {
          --bg-primary: ${darkMode ? '#1a1a1a' : userBg};
          --bg-secondary: ${darkMode ? '#2d2d2d' : userAccent};
          --bg-card: ${darkMode ? '#3d3d3d' : '#FFFFFF'};
          --text-primary: ${darkMode ? '#ffffff' : '#000000'};
          --text-secondary: ${darkMode ? '#cccccc' : '#666666'};
          --border-color: ${darkMode ? '#ffffff' : '#000000'};
          --accent-green: ${darkMode ? '#4ade80' : '#98FB98'};
          --user-font: ${getFontFamily()};
        }
        
        body {
          font-family: var(--user-font);
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .prose { color: var(--text-primary); }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6, .prose strong, .prose b { color: var(--text-primary); }
        .prose p, .prose li, .prose ul, .prose ol, .prose span, .prose blockquote, .prose code { color: var(--text-primary); }
        .prose a { color: var(--accent-green); }

        input, textarea, select {
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-color: var(--border-color);
        }
        input::placeholder, textarea::placeholder { color: var(--text-secondary); }
        
        .neo-shadow { box-shadow: 4px 4px 0px var(--border-color); }
        .neo-shadow-small { box-shadow: 2px 2px 0px var(--border-color); }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
      <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <aside 
          className={`p-4 border-b-4 md:border-r-4 md:border-b-0 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} w-full`} 
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <header className={`mb-6 text-center transition-all ${isSidebarCollapsed ? 'py-4' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              {!isSidebarCollapsed && <h1 className="text-2xl font-bold">StudyBuddy</h1>}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg border-2 hover:neo-shadow transition-all hidden md:block"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                {isSidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
              </button>
            </div>
            {!isSidebarCollapsed && <p className="text-xs">Your Homework Hub</p>}
            
            {user && !isSidebarCollapsed && (
              <div className="mt-2 p-2 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs font-semibold capitalize">
                  {user.account_type}{user.account_type !== 'teacher' ? ` • Class ${user.class_name}` : ''}
                </p>
              </div>
            )}
          </header>

          <nav className="flex-grow space-y-3">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} isSidebarCollapsed={isSidebarCollapsed} />
            ))}
          </nav>
          
          <div className={`mt-4 space-y-2 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
             <button
                onClick={handleToggleDarkMode}
                className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-black rounded-lg w-full"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                title={isSidebarCollapsed ? (darkMode ? "Light Mode" : "Dark Mode") : ''}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {!isSidebarCollapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
              </button>

            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-lg w-full"
              style={{ backgroundColor: '#f87171', borderColor: 'var(--border-color)', color: 'white' }}
              title={isSidebarCollapsed ? "Log Out" : ''}
            >
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
        
        <FloatingAddButton />
        <MotivationCard />
      </div>
    </>
  );
}
