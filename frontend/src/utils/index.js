export const createPageUrl = (pageName) => {
  const pageMap = {
    'Dashboard': '/dashboard',
    'CalendarView': '/calendar',
    'SharedCalendar': '/shared-calendar',
    'Timetable': '/timetable',
    'AssignmentHub': '/assignments',
    'Appointments': '/appointments',
    'Flashcards': '/flashcards',
    'QuickReference': '/quick-reference',
    'ResourceHub': '/resources',
    'AIDocumentAssistant': '/ai-document',
    'ClassChat': '/class-chat',
    'AIChat': '/ai-chat',
    'ChatHistory': '/chat-history',
    'StudyGroups': '/study-groups',
    'PomodoroTimer': '/pomodoro',
    'WellnessHub': '/wellness',
    'Analytics': '/analytics',
    'RewardsHub': '/rewards',
    'Leaderboard': '/leaderboard',
    'Search': '/search',
    'ThemeCustomizer': '/theme',
    'ProfileSetup': '/profile-setup',
    'Account': '/account'
  };
  
  return pageMap[pageName] || '/';
};

export const toLocalDateString = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
