// Core application types

export interface Word {
  id: string
  text: string
  translation: string
  pronunciation?: string
  partOfSpeech: string
  difficulty: number
  language: string
  createdAt: Date
  examples: Example[]
}

export interface Example {
  id: string
  sentence: string
  translation: string
}

export interface TrainingSet {
  id: string
  name: string
  description?: string
  userId: string
  words: Word[]
  category: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  metadata: {
    totalWords: number
    averageDifficulty: number
    estimatedStudyTime: number
  }
}

export interface WordProgress {
  id: string
  userId: string
  wordId: string
  currentInterval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
  lastReviewDate: Date
  correctStreak: number
  totalReviews: number
  averageResponseTime: number
}

export interface User {
  id: string
  email: string
  username: string
  targetLanguage: string
  nativeLanguage: string
  createdAt: Date
  updatedAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  dailyGoal: number
  notificationsEnabled: boolean
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  preferredStudyTime: string
}

export interface LearningModule {
  id: string
  name: string
  icon: string
  component: any
  isActive: boolean
  progress?: number
}
