import React, { useState, useEffect } from 'react';
import { Brain, Plus, Edit, Trash2, Play, RotateCcw, CheckCircle, XCircle, ArrowLeft, ArrowRight, Shuffle, BookOpen, Target, Zap } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function Flashcards() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [showSetModal, setShowSetModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studyMode, setStudyMode] = useState('normal'); // normal, shuffle, review
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    loadFlashcardSets();
  }, []);

  const loadFlashcardSets = () => {
    setIsLoading(true);
    try {
      const allSets = dataManager.getFlashcardSets();
      setFlashcardSets(allSets);
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSet = () => {
    setEditingSet(null);
    setShowSetModal(true);
  };

  const handleEditSet = (set) => {
    setEditingSet(set);
    setShowSetModal(true);
  };

  const handleSaveSet = (setData) => {
    if (editingSet) {
      dataManager.updateFlashcardSet(editingSet.id, setData);
    } else {
      dataManager.addFlashcardSet(setData);
    }
    loadFlashcardSets();
    setShowSetModal(false);
    setEditingSet(null);
  };

  const handleDeleteSet = (setId) => {
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
      dataManager.deleteFlashcardSet(setId);
      loadFlashcardSets();
    }
  };

  const handleStartStudy = (set, mode = 'normal') => {
    setSelectedSet(set);
    setStudyMode(mode);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, incorrect: 0 });
  };

  const handleCardResponse = (isCorrect) => {
    if (selectedSet) {
      dataManager.recordCardReview(selectedSet.id, selectedSet.cards[currentCardIndex].id, isCorrect);
      setStudyStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1)
      }));
    }
    nextCard();
  };

  const nextCard = () => {
    if (selectedSet && currentCardIndex < selectedSet.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Study session complete
      setSelectedSet(null);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    if (selectedSet) {
      const shuffledCards = [...selectedSet.cards].sort(() => Math.random() - 0.5);
      setSelectedSet({ ...selectedSet, cards: shuffledCards });
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.medium;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }

  // Study Mode View
  if (selectedSet) {
    const currentCard = selectedSet.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / selectedSet.cards.length) * 100;

    return (
      <div className="space-y-6">
        {/* Study Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedSet(null)}
              className="flex items-center gap-2 px-3 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sets
            </button>
            <div>
              <h1 className="text-2xl font-bold">{selectedSet.title}</h1>
              <p className="text-gray-600">{studyMode === 'shuffle' ? 'Shuffled Study' : 'Normal Study'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={shuffleCards}
              className="p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
              title="Shuffle Cards"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <div className="text-sm text-gray-600">
              {currentCardIndex + 1} / {selectedSet.cards.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Study Stats */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{studyStats.correct}</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">{studyStats.incorrect}</span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center">
          <div
            className="w-full max-w-2xl h-96 border-2 rounded-lg cursor-pointer transform transition-transform hover:scale-105"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-4">
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(currentCard.difficulty)}`}>
                    {currentCard.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </h2>
                <p className="text-lg leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                <div className="mt-6 text-sm text-gray-500">
                  Click to {isFlipped ? 'see question' : 'see answer'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and Response Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="p-3 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {isFlipped && (
            <div className="flex gap-3">
              <button
                onClick={() => handleCardResponse(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Incorrect
              </button>
              <button
                onClick={() => handleCardResponse(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Correct
              </button>
            </div>
          )}

          <button
            onClick={nextCard}
            disabled={currentCardIndex === selectedSet.cards.length - 1}
            className="p-3 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Main Flashcards View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
          <p className="text-gray-600">Create and study with interactive flashcards</p>
        </div>
        <button
          onClick={handleAddSet}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow hover:neo-shadow transition-all"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4" />
          Create Flashcard Set
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sets</p>
              <p className="text-2xl font-bold">{flashcardSets.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold">
                {flashcardSets.reduce((total, set) => total + set.cards.length, 0)}
              </p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Easy Cards</p>
              <p className="text-2xl font-bold">
                {flashcardSets.reduce((total, set) => 
                  total + set.cards.filter(card => card.difficulty === 'easy').length, 0
                )}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div
          className="p-4 border-2 rounded-lg neo-shadow"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hard Cards</p>
              <p className="text-2xl font-bold">
                {flashcardSets.reduce((total, set) => 
                  total + set.cards.filter(card => card.difficulty === 'hard').length, 0
                )}
              </p>
            </div>
            <Zap className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Flashcard Sets */}
      <div
        className="p-6 border-2 rounded-lg neo-shadow"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Flashcard Sets ({flashcardSets.length})
        </h2>
        
        {flashcardSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets.map(set => (
              <div
                key={set.id}
                className="p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{set.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{set.subject}</p>
                    <p className="text-sm text-gray-500 mb-3">{set.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{set.cards.length} cards</span>
                      <span>•</span>
                      <span>Created {new Date(set.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleEditSet(set)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit Set"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSet(set.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Set"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartStudy(set, 'normal')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Study
                  </button>
                  <button
                    onClick={() => handleStartStudy(set, 'shuffle')}
                    className="flex items-center justify-center gap-2 py-2 px-3 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'var(--border-color)' }}
                    title="Shuffled Study"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No flashcard sets created yet</p>
            <p className="text-sm">Create your first set to start studying!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSetModal && (
        <FlashcardSetModal
          set={editingSet}
          onSave={handleSaveSet}
          onClose={() => {
            setShowSetModal(false);
            setEditingSet(null);
          }}
        />
      )}
    </div>
  );
}

// Flashcard Set Modal Component
function FlashcardSetModal({ set, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: ''
  });

  useEffect(() => {
    if (set) {
      setFormData({
        title: set.title || '',
        subject: set.subject || '',
        description: set.description || ''
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        description: ''
      });
    }
  }, [set]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg border-2 neo-shadow max-w-md w-full mx-4"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {set ? 'Edit Flashcard Set' : 'Create New Flashcard Set'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Set Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-2 border-2 rounded-lg"
              style={{ borderColor: 'var(--border-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border-2 rounded-lg h-20 resize-none"
              style={{ borderColor: 'var(--border-color)' }}
              placeholder="Optional description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {set ? 'Update Set' : 'Create Set'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
