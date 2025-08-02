// Database model types matching the redesigned Prisma schema

export interface Language {
  id: string
  code: string // ISO 639-1 code (e.g., "de", "fr", "es")
  name: string // Display name (e.g., "German", "French")
  nativeName: string // Native name (e.g., "Deutsch", "Français")
  isActive: boolean
  createdAt: Date
}

export interface User {
  id: string
  email: string
  username: string
  nativeLanguage: string
  activeLanguageId?: string
  dailyGoal: number
  createdAt: Date
  updatedAt: Date
  activeLanguage?: Language
  userLanguages?: UserLanguage[]
  favoriteWords?: UserFavoriteWord[]
}

export interface UserLanguage {
  id: string
  userId: string
  languageId: string
  proficiencyLevel: string // 'beginner', 'intermediate', 'advanced'
  startedAt: Date
  lastActiveAt: Date
  user?: User
  language?: Language
}

export interface Word {
  id: string
  text: string
  languageId: string
  partOfSpeech: string
  difficulty: number
  frequency?: number // Word frequency rank (1 = most common)
  createdAt: Date
  updatedAt: Date
  language?: Language
  translations?: WordTranslation[]
  attributes?: WordAttribute[]
  examples?: Example[]
  favorites?: UserFavoriteWord[]
}

export interface WordTranslation {
  id: string
  wordId: string
  targetLanguage: string // Language code for the translation
  translation: string // The actual translation
  context?: string // Context where this translation applies
  isMain: boolean // Primary translation
  createdAt: Date
  word?: Word
}

export interface WordAttribute {
  id: string
  wordId: string
  attributeType: string // "article", "plural", "gender", "conjugation", etc.
  attributeValue: string // The actual value
  context?: string // When this attribute applies
  createdAt: Date
  word?: Word
}

export interface UserFavoriteWord {
  id: string
  userId: string
  wordId: string
  addedAt: Date
  notes?: string // User's personal notes about the word
  user?: User
  word?: Word
}

export interface Example {
  id: string
  sentence: string
  translation: string
  wordId: string
  createdAt: Date
  word?: Word
}

export interface TrainingSet {
  id: string
  name: string
  description?: string
  category: string
  languageId?: string // Language this set is for (optional for mixed sets)
  isPublic: boolean
  userId: string // Required - each set belongs to a user
  createdAt: Date
  updatedAt: Date
  user?: User
  language?: Language
  words?: TrainingSetWord[]
}

export interface TrainingSetWord {
  id: string
  trainingSetId: string
  wordId: string
  order: number
  addedAt: Date
  trainingSet?: TrainingSet
  word?: Word
}

export interface WordProgress {
  id: string
  userId: string // Required - progress belongs to a user
  wordId: string
  currentInterval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
  lastReviewDate?: Date
  correctStreak: number
  totalReviews: number
  averageResponseTime?: number
  createdAt: Date
  updatedAt: Date
  user?: User
  word?: Word
}

// Spaced repetition algorithm types
export interface SpacedRepetitionResult {
  nextInterval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
}

export interface LearningModule {
  id: string
  name: string
  icon: string
  component: any
  isActive: boolean
  progress?: number
}
// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
    timestamp: string
  }
}

// Learning session types
export interface ReviewSession {
  id: string
  words: WordProgress[]
  startedAt: Date
  completedAt?: Date
  totalWords: number
  correctAnswers: number
}

export interface FlashcardReview {
  wordId: string
  correct: boolean
  responseTime: number
  timestamp: Date
}

// Training set metadata (computed values)
export interface TrainingSetMetadata {
  totalWords: number
  averageDifficulty: number
  estimatedStudyTime: number
  completionRate?: number
}