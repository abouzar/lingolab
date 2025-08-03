// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  targetLanguage: string;
  nativeLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  dailyGoal: number;
  notificationsEnabled: boolean;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredStudyTime: string;
}

// Word and Training Set types
export interface Word {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech: string;
  difficulty: number;
  language: string;
  createdAt: Date;
  examples: Example[];
}

export interface Example {
  id: string;
  sentence: string;
  translation: string;
}

export interface TrainingSet {
  id: string;
  name: string;
  description?: string;
  userId: string;
  words: Word[];
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    totalWords: number;
    averageDifficulty: number;
    estimatedStudyTime: number;
  };
}

// Progress tracking types
export interface WordProgress {
  id: string;
  userId: string;
  wordId: string;
  currentInterval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: Date;
  lastReviewDate: Date;
  correctStreak: number;
  totalReviews: number;
  averageResponseTime: number;
}

// AI types
export interface ChatMessage {
  id: string;
  conversationId: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface WordSuggestion {
  word: string;
  translation: string;
  partOfSpeech: string;
  difficulty: number;
  context: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  vocabularyWords: string[];
  createdAt: Date;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}