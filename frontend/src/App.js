import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔹 Layout & Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DatabaseItems from './pages/DatabaseItems';
import CalendarView from './pages/CalendarView';
import SharedCalendar from './pages/SharedCalendar';
import Timetable from './pages/Timetable';
import AssignmentHub from './pages/AssignmentHub';
import Appointments from './pages/Appointments';
import Flashcards from './pages/Flashcards';
import QuickReference from './pages/QuickReference';
import ResourceHub from './pages/ResourceHub';
import AIDocumentAssistant from './pages/AIDocumentAssistant';
import ClassChat from './pages/ClassChat';
import AIChat from './pages/AIChat';
import ChatHistory from './pages/ChatHistory';
import StudyGroup from './pages/StudyGroup';
import PomodoroTimer from './pages/PomodoroTimer';
import WellnessHub from './pages/WellnessHub';
import Analytics from './pages/Analytics';
import RewardsHub from './pages/RewardsHub';
import Leaderboard from './pages/Leaderboard';
import Search from './pages/Search';
import ThemeCustomizer from './pages/ThemeCustomizer';
import ProfileSetup from './pages/ProfileSetup';
import Account from './pages/Account';

function App() {

  // ✅ Check backend connection once
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => console.log('✅ Backend connected! Users:', data))
      .catch(err => console.error('❌ Backend connection failed:', err));
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🟢 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        {/* 🟢 Main Routes (accessible after login) */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/items" element={<Layout><DatabaseItems /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
        <Route path="/shared-calendar" element={<Layout><SharedCalendar /></Layout>} />
        <Route path="/timetable" element={<Layout><Timetable /></Layout>} />
        <Route path="/assignments" element={<Layout><AssignmentHub /></Layout>} />
        <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
        <Route path="/flashcards" element={<Layout><Flashcards /></Layout>} />
        <Route path="/quick-reference" element={<Layout><QuickReference /></Layout>} />
        <Route path="/resources" element={<Layout><ResourceHub /></Layout>} />
        <Route path="/ai-document" element={<Layout><AIDocumentAssistant /></Layout>} />
        <Route path="/class-chat" element={<Layout><ClassChat /></Layout>} />
        <Route path="/ai-chat" element={<Layout><AIChat /></Layout>} />
        <Route path="/chat-history" element={<Layout><ChatHistory /></Layout>} />
        <Route path="/study-groups" element={<Layout><StudyGroup /></Layout>} />
        <Route path="/pomodoro" element={<Layout><PomodoroTimer /></Layout>} />
        <Route path="/wellness" element={<Layout><WellnessHub /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/rewards" element={<Layout><RewardsHub /></Layout>} />
        <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/theme" element={<Layout><ThemeCustomizer /></Layout>} />
        <Route path="/profile-setup" element={<Layout><ProfileSetup /></Layout>} />
        <Route path="/account" element={<Layout><Account /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
