// Data management utilities for StudyBuddy
import { getCurrentUserId } from './auth';
import { toLocalDateString } from './index';

export class DataManager {
  constructor() {
    this.data = this.loadData();
  }

  getStorageKey() {
    const userId = getCurrentUserId() || 'guest';
    return `studybuddy_data:${userId}`;
  }

  loadData() {
    const defaultData = {
      assignments: [
        {
          id: 1,
          title: "Math Homework - Chapter 5",
          subject: "Mathematics",
          dueDate: toLocalDateString(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // 2 days from now
          priority: "high",
          status: "pending",
          description: "Complete exercises 1-20 from Chapter 5",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Science Lab Report",
          subject: "Science",
          dueDate: toLocalDateString(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
          priority: "medium",
          status: "in_progress",
          description: "Write lab report for chemistry experiment",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: "History Essay",
          subject: "History",
          dueDate: toLocalDateString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
          priority: "low",
          status: "pending",
          description: "Write 1000-word essay on World War II",
          createdAt: new Date().toISOString()
        }
      ],
      events: [
        {
          id: 1,
          title: "Science Quiz",
          date: toLocalDateString(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)), // 1 day from now
          time: "10:00",
          type: "exam",
          description: "Quiz on Chapter 3-4",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Study Group Meeting",
          date: toLocalDateString(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // 3 days from now
          time: "15:00",
          type: "study",
          description: "Math study group",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: "Parent-Teacher Conference",
          date: toLocalDateString(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
          time: "14:00",
          type: "meeting",
          description: "Quarterly progress review",
          createdAt: new Date().toISOString()
        }
      ],
      studySessions: [
        {
          id: 1,
          subject: "Mathematics",
          duration: 45,
          date: "2024-01-14",
          type: "homework",
          completed: true
        },
        {
          id: 2,
          subject: "Science",
          duration: 30,
          date: "2024-01-14",
          type: "review",
          completed: true
        },
        {
          id: 3,
          subject: "History",
          duration: 60,
          date: "2024-01-13",
          type: "reading",
          completed: true
        }
      ],
      achievements: [
        {
          id: 1,
          title: "Study Streak",
          description: "Studied for 7 consecutive days",
          icon: "🔥",
          earnedAt: "2024-01-14"
        },
        {
          id: 2,
          title: "Assignment Master",
          description: "Completed 10 assignments",
          icon: "📝",
          earnedAt: "2024-01-12"
        }
      ],
      pomodoroSessions: [
        {
          id: 1,
          type: 'focus',
          duration: 25,
          completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          subject: 'Mathematics',
          notes: 'Completed algebra exercises'
        },
        {
          id: 2,
          type: 'break',
          duration: 5,
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          subject: 'Mathematics',
          notes: 'Short break after focus session'
        },
        {
          id: 3,
          type: 'focus',
          duration: 25,
          completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          subject: 'Science',
          notes: 'Studied photosynthesis'
        }
      ],
      chatConversations: [
        {
          id: 1,
          title: "Math Help - Algebra",
          subject: "Mathematics",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          messages: [
            {
              id: 1,
              role: "user",
              content: "Can you help me understand quadratic equations?",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              role: "assistant",
              content: "Of course! Quadratic equations are polynomial equations of degree 2. They have the general form ax² + bx + c = 0, where a ≠ 0. The solutions can be found using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Would you like me to explain any specific part in more detail?",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString()
            },
            {
              id: 3,
              role: "user",
              content: "What about factoring?",
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
              id: 4,
              role: "assistant",
              content: "Great question! Factoring is another method to solve quadratic equations. For example, x² + 5x + 6 = 0 can be factored as (x + 2)(x + 3) = 0. This gives us x = -2 or x = -3. Factoring works well when the equation can be easily decomposed into two binomials.",
              timestamp: new Date(Date.now() - 30 * 60 * 1000 + 30 * 1000).toISOString()
            }
          ]
        },
        {
          id: 2,
          title: "Science - Photosynthesis",
          subject: "Science",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          messages: [
            {
              id: 5,
              role: "user",
              content: "Explain photosynthesis in simple terms",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 6,
              role: "assistant",
              content: "Photosynthesis is how plants make their own food using sunlight! Here's the simple version: Plants take in carbon dioxide from the air and water from the soil. Using energy from sunlight, they convert these into glucose (sugar) and release oxygen as a byproduct. The chemical equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It's like a solar-powered food factory!",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 30 * 1000).toISOString()
            }
          ]
        }
      ],
      studyGroups: [
        {
          id: 1,
          name: "Advanced Mathematics",
          description: "Study group for advanced calculus and linear algebra",
          subject: "Mathematics",
          createdBy: "John Doe",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          members: [
            { id: 1, name: "John Doe", role: "admin", joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 2, name: "Sarah Wilson", role: "member", joinedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 3, name: "Mike Chen", role: "member", joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 4, name: "Emily Davis", role: "member", joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          maxMembers: 8,
          isPublic: true,
          studySessions: [
            {
              id: 1,
              title: "Calculus Review Session",
              description: "Reviewing derivatives and integrals",
              scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
              duration: 90,
              location: "Library Room 201",
              createdBy: "John Doe"
            }
          ],
          announcements: [
            {
              id: 1,
              title: "Welcome to Advanced Mathematics Group!",
              content: "Let's work together to master advanced calculus concepts.",
              createdBy: "John Doe",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 2,
          name: "Biology Study Circle",
          description: "Collaborative study for biology exams and lab work",
          subject: "Science",
          createdBy: "Sarah Wilson",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          members: [
            { id: 2, name: "Sarah Wilson", role: "admin", joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 5, name: "Alex Johnson", role: "member", joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 6, name: "Lisa Brown", role: "member", joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          maxMembers: 6,
          isPublic: true,
          studySessions: [
            {
              id: 2,
              title: "Cell Biology Discussion",
              description: "Deep dive into cell structure and function",
              scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
              duration: 60,
              location: "Online - Zoom",
              createdBy: "Sarah Wilson"
            }
          ],
          announcements: [
            {
              id: 2,
              title: "Lab Report Due Next Week",
              content: "Don't forget to submit your lab reports by Friday!",
              createdBy: "Sarah Wilson",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 3,
          name: "History Study Partners",
          description: "Small group for history exam preparation",
          subject: "History",
          createdBy: "Mike Chen",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          members: [
            { id: 3, name: "Mike Chen", role: "admin", joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 7, name: "David Lee", role: "member", joinedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() } // 12 hours ago
          ],
          maxMembers: 4,
          isPublic: false,
          studySessions: [],
          announcements: []
        }
      ],
      flashcardSets: [
        {
          id: 1,
          title: "Math Formulas",
          subject: "Mathematics",
          description: "Essential formulas for algebra and geometry",
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 1,
              front: "What is the quadratic formula?",
              back: "x = (-b ± √(b² - 4ac)) / 2a",
              difficulty: "medium",
              lastReviewed: null,
              correctCount: 0,
              incorrectCount: 0
            },
            {
              id: 2,
              front: "What is the Pythagorean theorem?",
              back: "a² + b² = c²",
              difficulty: "easy",
              lastReviewed: null,
              correctCount: 0,
              incorrectCount: 0
            },
            {
              id: 3,
              front: "What is the area of a circle?",
              back: "A = πr²",
              difficulty: "easy",
              lastReviewed: null,
              correctCount: 0,
              incorrectCount: 0
            }
          ]
        },
        {
          id: 2,
          title: "Science Terms",
          subject: "Science",
          description: "Important scientific terms and definitions",
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 4,
              front: "What is photosynthesis?",
              back: "The process by which plants convert sunlight into energy using carbon dioxide and water",
              difficulty: "medium",
              lastReviewed: null,
              correctCount: 0,
              incorrectCount: 0
            },
            {
              id: 5,
              front: "What is the chemical symbol for water?",
              back: "H₂O",
              difficulty: "easy",
              lastReviewed: null,
              correctCount: 0,
              incorrectCount: 0
            }
          ]
        }
      ]
      ,
      quickReferences: [
        {
          id: 1,
          title: 'Sample: Quadratic Formula',
          content: 'x = (-b ± √(b² - 4ac)) / 2a',
          tags: ['math','algebra'],
          createdAt: new Date().toISOString()
        }
      ]
      ,
      documents: []
    };

    try {
      const saved = localStorage.getItem(this.getStorageKey());
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch (error) {
      console.error('Error loading data:', error);
      return defaultData;
    }
  }

  reload() {
    this.data = this.loadData();
    return this.data;
  }

  saveData() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Assignment methods
  getAssignments() {
    return this.data.assignments;
  }

  addAssignment(assignment) {
    const newAssignment = {
      ...assignment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.assignments.push(newAssignment);
    this.saveData();
    return newAssignment;
  }

  updateAssignment(id, updates) {
    const index = this.data.assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.assignments[index] = { ...this.data.assignments[index], ...updates };
      this.saveData();
      return this.data.assignments[index];
    }
    return null;
  }

  deleteAssignment(id) {
    this.data.assignments = this.data.assignments.filter(a => a.id !== id);
    this.saveData();
  }

  // Event methods
  getEvents() {
    return this.data.events;
  }

  addEvent(event) {
    const newEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.events.push(newEvent);
    this.saveData();
    try { window.dispatchEvent(new CustomEvent('data:eventsChanged', { detail: { type: 'add', event: newEvent } })); } catch (_e) {}
    return newEvent;
  }

  updateEvent(id, updates) {
    const index = this.data.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.events[index] = { ...this.data.events[index], ...updates };
      this.saveData();
      try { window.dispatchEvent(new CustomEvent('data:eventsChanged', { detail: { type: 'update', event: this.data.events[index] } })); } catch (_e) {}
      return this.data.events[index];
    }
    return null;
  }

  deleteEvent(id) {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.saveData();
    try { window.dispatchEvent(new CustomEvent('data:eventsChanged', { detail: { type: 'delete', id } })); } catch (_e) {}
  }

  // Study session methods
  getStudySessions() {
    return this.data.studySessions;
  }

  addStudySession(session) {
    const newSession = {
      ...session,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.studySessions.push(newSession);
    this.saveData();
    return newSession;
  }

  // Dashboard statistics
  getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingEvents = this.data.events.filter(event => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      return eventDate >= today && eventDate <= nextWeek;
    }).length;

    const dueAssignments = this.data.assignments.filter(assignment => {
      const dueDate = new Date(`${assignment.dueDate}T00:00:00`);
      return dueDate >= today && dueDate <= nextWeek && assignment.status !== 'completed';
    }).length;

    const todaySessions = this.data.studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === today.toDateString() && session.completed;
    });

    const totalStudyTime = todaySessions.reduce((total, session) => total + session.duration, 0);
    const studyTimeFormatted = `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`;

    const completedAssignments = this.data.assignments.filter(a => a.status === 'completed').length;
    const totalAssignments = this.data.assignments.length;
    const progressScore = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    return {
      upcomingEvents,
      dueAssignments,
      studyTimeToday: studyTimeFormatted,
      progressScore: `${progressScore}%`
    };
  }

  getRecentActivities() {
    const activities = [];
    
    // Add recent assignments
    this.data.assignments.slice(-3).forEach(assignment => {
      activities.push({
        type: 'assignment',
        title: assignment.title,
        time: this.getRelativeTime(assignment.createdAt),
        status: assignment.status,
        id: assignment.id
      });
    });

    // Add recent events
    this.data.events.slice(-2).forEach(event => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate > new Date();
      activities.push({
        type: 'event',
        title: event.title,
        time: isUpcoming ? `Tomorrow ${event.time}` : this.getRelativeTime(event.createdAt),
        status: isUpcoming ? 'upcoming' : 'completed',
        id: event.id
      });
    });

    // Add recent study sessions
    this.data.studySessions.slice(-2).forEach(session => {
      activities.push({
        type: 'study',
        title: `${session.subject} Study Session`,
        time: this.getRelativeTime(session.createdAt),
        status: session.completed ? 'completed' : 'in_progress',
        id: session.id
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }

  getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }

  // Flashcard methods
  getFlashcardSets() {
    return this.data.flashcardSets;
  }

  addFlashcardSet(flashcardSet) {
    const newSet = {
      ...flashcardSet,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      cards: flashcardSet.cards || []
    };
    this.data.flashcardSets.push(newSet);
    this.saveData();
    return newSet;
  }

  updateFlashcardSet(id, updates) {
    const index = this.data.flashcardSets.findIndex(set => set.id === id);
    if (index !== -1) {
      this.data.flashcardSets[index] = { ...this.data.flashcardSets[index], ...updates };
      this.saveData();
      return this.data.flashcardSets[index];
    }
    return null;
  }

  deleteFlashcardSet(id) {
    this.data.flashcardSets = this.data.flashcardSets.filter(set => set.id !== id);
    this.saveData();
  }

  addCardToSet(setId, card) {
    const setIndex = this.data.flashcardSets.findIndex(set => set.id === setId);
    if (setIndex !== -1) {
      const newCard = {
        ...card,
        id: Date.now(),
        difficulty: card.difficulty || 'medium',
        lastReviewed: null,
        correctCount: 0,
        incorrectCount: 0
      };
      this.data.flashcardSets[setIndex].cards.push(newCard);
      this.saveData();
      return newCard;
    }
    return null;
  }

  updateCard(setId, cardId, updates) {
    const setIndex = this.data.flashcardSets.findIndex(set => set.id === setId);
    if (setIndex !== -1) {
      const cardIndex = this.data.flashcardSets[setIndex].cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        this.data.flashcardSets[setIndex].cards[cardIndex] = {
          ...this.data.flashcardSets[setIndex].cards[cardIndex],
          ...updates
        };
        this.saveData();
        return this.data.flashcardSets[setIndex].cards[cardIndex];
      }
    }
    return null;
  }

  deleteCard(setId, cardId) {
    const setIndex = this.data.flashcardSets.findIndex(set => set.id === setId);
    if (setIndex !== -1) {
      this.data.flashcardSets[setIndex].cards = this.data.flashcardSets[setIndex].cards.filter(card => card.id !== cardId);
      this.saveData();
    }
  }

  recordCardReview(setId, cardId, isCorrect) {
    const setIndex = this.data.flashcardSets.findIndex(set => set.id === setId);
    if (setIndex !== -1) {
      const cardIndex = this.data.flashcardSets[setIndex].cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        const card = this.data.flashcardSets[setIndex].cards[cardIndex];
        card.lastReviewed = new Date().toISOString();
        if (isCorrect) {
          card.correctCount += 1;
        } else {
          card.incorrectCount += 1;
        }
        this.saveData();
        return card;
      }
    }
    return null;
  }

  // Pomodoro session methods
  getPomodoroSessions() {
    return this.data.pomodoroSessions;
  }

  // Quick Reference methods
  getQuickReferences() {
    return this.data.quickReferences || [];
  }

  addQuickReference(ref) {
    const newRef = {
      id: Date.now(),
      title: ref.title?.trim() || 'Untitled',
      content: ref.content?.trim() || '',
      tags: Array.isArray(ref.tags) ? ref.tags : (ref.tags ? String(ref.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
      createdAt: new Date().toISOString()
    };
    if (!this.data.quickReferences) this.data.quickReferences = [];
    this.data.quickReferences.push(newRef);
    this.saveData();
    return newRef;
  }

  deleteQuickReference(id) {
    this.data.quickReferences = (this.data.quickReferences || []).filter(r => r.id !== id);
    this.saveData();
  }

  updateQuickReference(id, updates) {
    const list = this.data.quickReferences || [];
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      const next = { ...list[idx], ...updates };
      if (typeof next.tags === 'string') {
        next.tags = next.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      this.data.quickReferences[idx] = next;
      this.saveData();
      return next;
    }
    return null;
  }

  // Documents (per-user)
  getDocuments() {
    return this.data.documents || [];
  }

  addDocument(doc) {
    const newDoc = {
      id: Date.now(),
      title: doc.title || 'Untitled Document',
      fileName: doc.fileName || '',
      mimeType: doc.mimeType || 'text/plain',
      text: doc.text || '',
      pageCount: doc.pageCount || 0,
      createdAt: new Date().toISOString()
    };
    if (!this.data.documents) this.data.documents = [];
    this.data.documents.push(newDoc);
    this.saveData();
    return newDoc;
  }

  deleteDocument(id) {
    this.data.documents = (this.data.documents || []).filter(d => d.id !== id);
    this.saveData();
  }

  addPomodoroSession(session) {
    const newSession = {
      ...session,
      id: Date.now(),
      completedAt: new Date().toISOString()
    };
    this.data.pomodoroSessions.push(newSession);
    this.saveData();
    return newSession;
  }

  getTodayPomodoroStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = this.data.pomodoroSessions.filter(session => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= today && sessionDate < tomorrow;
    });

    const focusSessions = todaySessions.filter(s => s.type === 'focus');
    const breakSessions = todaySessions.filter(s => s.type === 'break');
    const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0);
    const totalBreakTime = breakSessions.reduce((total, session) => total + session.duration, 0);

    return {
      totalSessions: todaySessions.length,
      focusSessions: focusSessions.length,
      breakSessions: breakSessions.length,
      totalFocusTime,
      totalBreakTime,
      totalTime: totalFocusTime + totalBreakTime
    };
  }

  getPomodoroStreak() {
    const sessions = this.data.pomodoroSessions
      .filter(s => s.type === 'focus')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (sessionDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (sessionDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  // Chat conversation methods
  getChatConversations() {
    return this.data.chatConversations;
  }

  addChatConversation(conversation) {
    const newConversation = {
      ...conversation,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messages: []
    };
    this.data.chatConversations.push(newConversation);
    this.saveData();
    return newConversation;
  }

  updateChatConversation(id, updates) {
    const index = this.data.chatConversations.findIndex(conv => conv.id === id);
    if (index !== -1) {
      this.data.chatConversations[index] = { 
        ...this.data.chatConversations[index], 
        ...updates,
        lastMessageAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.chatConversations[index];
    }
    return null;
  }

  deleteChatConversation(id) {
    this.data.chatConversations = this.data.chatConversations.filter(conv => conv.id !== id);
    this.saveData();
  }

  addMessageToConversation(conversationId, message) {
    const conversationIndex = this.data.chatConversations.findIndex(conv => conv.id === conversationId);
    if (conversationIndex !== -1) {
      const newMessage = {
        ...message,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      this.data.chatConversations[conversationIndex].messages.push(newMessage);
      this.data.chatConversations[conversationIndex].lastMessageAt = new Date().toISOString();
      this.saveData();
      return newMessage;
    }
    return null;
  }

  // Mock AI response generator
  generateAIResponse(userMessage, conversationHistory = []) {
    // This is a mock AI response generator
    // In a real application, this would connect to an actual AI service
    
    const responses = {
      math: [
        "I'd be happy to help with math! Let me break this down step by step.",
        "That's a great math question! Here's how I would approach it:",
        "Math can be tricky, but let's work through this together.",
        "I see you're working on math problems. Let me explain this concept clearly."
      ],
      science: [
        "Science is fascinating! Let me explain this concept in simple terms.",
        "Great science question! Here's what's happening:",
        "I love helping with science! Let me break this down for you.",
        "Science concepts can be complex, but I'll make this easy to understand."
      ],
      general: [
        "I'm here to help you study! What would you like to know?",
        "That's an interesting question! Let me help you understand this.",
        "I'm your AI study buddy! How can I assist you today?",
        "Great question! Let me provide you with a clear explanation."
      ]
    };

    const message = userMessage.toLowerCase();
    let category = 'general';
    
    if (message.includes('math') || message.includes('algebra') || message.includes('equation') || 
        message.includes('quadratic') || message.includes('geometry') || message.includes('calculus')) {
      category = 'math';
    } else if (message.includes('science') || message.includes('biology') || message.includes('chemistry') || 
               message.includes('physics') || message.includes('photosynthesis') || message.includes('cell')) {
      category = 'science';
    }

    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    // Generate a more detailed response based on the user's message
    let detailedResponse = randomResponse + " ";
    
    if (message.includes('quadratic')) {
      detailedResponse += "Quadratic equations have the form ax² + bx + c = 0. You can solve them using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a, or by factoring when possible.";
    } else if (message.includes('photosynthesis')) {
      detailedResponse += "Photosynthesis is the process where plants convert sunlight, carbon dioxide, and water into glucose and oxygen. The equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.";
    } else if (message.includes('help') || message.includes('explain')) {
      detailedResponse += "I can help you with various subjects including math, science, history, and more. Feel free to ask me specific questions about any topic you're studying!";
    } else {
      detailedResponse += "I'm here to help you understand any concept you're studying. Feel free to ask follow-up questions or request more detailed explanations!";
    }

    return detailedResponse;
  }

  // Study group methods
  getStudyGroups() {
    return this.data.studyGroups;
  }

  addStudyGroup(studyGroup) {
    const newGroup = {
      ...studyGroup,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 1, // Current user ID
          name: "You",
          role: "admin",
          joinedAt: new Date().toISOString()
        }
      ],
      studySessions: [],
      announcements: []
    };
    this.data.studyGroups.push(newGroup);
    this.saveData();
    return newGroup;
  }

  updateStudyGroup(id, updates) {
    const index = this.data.studyGroups.findIndex(group => group.id === id);
    if (index !== -1) {
      this.data.studyGroups[index] = { ...this.data.studyGroups[index], ...updates };
      this.saveData();
      return this.data.studyGroups[index];
    }
    return null;
  }

  deleteStudyGroup(id) {
    this.data.studyGroups = this.data.studyGroups.filter(group => group.id !== id);
    this.saveData();
  }

  joinStudyGroup(groupId, memberData) {
    const groupIndex = this.data.studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex !== -1 && this.data.studyGroups[groupIndex].members.length < this.data.studyGroups[groupIndex].maxMembers) {
      const newMember = {
        ...memberData,
        id: Date.now(),
        role: "member",
        joinedAt: new Date().toISOString()
      };
      this.data.studyGroups[groupIndex].members.push(newMember);
      this.saveData();
      return this.data.studyGroups[groupIndex];
    }
    return null;
  }

  leaveStudyGroup(groupId, memberId) {
    const groupIndex = this.data.studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex !== -1) {
      this.data.studyGroups[groupIndex].members = this.data.studyGroups[groupIndex].members.filter(member => member.id !== memberId);
      this.saveData();
      return this.data.studyGroups[groupIndex];
    }
    return null;
  }

  addStudySession(groupId, sessionData) {
    const groupIndex = this.data.studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex !== -1) {
      const newSession = {
        ...sessionData,
        id: Date.now()
      };
      this.data.studyGroups[groupIndex].studySessions.push(newSession);
      this.saveData();
      return this.data.studyGroups[groupIndex];
    }
    return null;
  }

  addAnnouncement(groupId, announcementData) {
    const groupIndex = this.data.studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex !== -1) {
      const newAnnouncement = {
        ...announcementData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      this.data.studyGroups[groupIndex].announcements.push(newAnnouncement);
      this.saveData();
      return this.data.studyGroups[groupIndex];
    }
    return null;
  }

  getMyStudyGroups() {
    // Return groups where current user is a member
    return this.data.studyGroups.filter(group => 
      group.members.some(member => member.name === "You")
    );
  }

  getPublicStudyGroups() {
    return this.data.studyGroups.filter(group => group.isPublic);
  }
}

// Create a singleton instance
export const dataManager = new DataManager();
