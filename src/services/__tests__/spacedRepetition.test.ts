import { describe, it, expect } from 'vitest'
import { SpacedRepetitionService } from '../spacedRepetition'
import type { WordProgress } from '../../types'

describe('Spaced Repetition Service', () => {
  describe('calculateNextReview', () => {
    it('should increase interval for correct answers', () => {
      const result = SpacedRepetitionService.calculateNextReview(4, 1, 2.5, 1)
      
      expect(result.nextInterval).toBeGreaterThan(1)
      expect(result.repetitions).toBe(2)
      expect(result.easeFactor).toBeGreaterThanOrEqual(2.5)
    })

    it('should reset interval for incorrect answers', () => {
      const result = SpacedRepetitionService.calculateNextReview(2, 10, 2.5, 5)
      
      expect(result.nextInterval).toBe(1)
      expect(result.repetitions).toBe(0)
      expect(result.easeFactor).toBeLessThan(2.5)
    })

    it('should follow SM-2 algorithm intervals', () => {
      // First correct answer
      const first = SpacedRepetitionService.calculateNextReview(4, 1, 2.5, 0)
      expect(first.nextInterval).toBe(1)
      expect(first.repetitions).toBe(1)

      // Second correct answer
      const second = SpacedRepetitionService.calculateNextReview(4, first.nextInterval, first.easeFactor, first.repetitions)
      expect(second.nextInterval).toBe(6)
      expect(second.repetitions).toBe(2)

      // Third correct answer should use ease factor
      const third = SpacedRepetitionService.calculateNextReview(4, second.nextInterval, second.easeFactor, second.repetitions)
      expect(third.nextInterval).toBeGreaterThan(6)
      expect(third.repetitions).toBe(3)
    })
  })

  describe('responseToQuality', () => {
    it('should return low quality for incorrect answers', () => {
      const quality = SpacedRepetitionService.responseToQuality(false, 3, 2)
      expect(quality).toBeLessThan(3)
    })

    it('should return high quality for fast correct answers', () => {
      const quality = SpacedRepetitionService.responseToQuality(true, 1, 2)
      expect(quality).toBeGreaterThanOrEqual(4)
    })

    it('should return medium quality for slow correct answers', () => {
      const quality = SpacedRepetitionService.responseToQuality(true, 10, 2)
      expect(quality).toBe(3)
    })
  })

  describe('updateProgress', () => {
    it('should update progress correctly for correct answer', () => {
      const mockProgress: WordProgress = {
        id: 'test-1',
        wordId: 'word-1',
        currentInterval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
        correctStreak: 0,
        totalReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        word: {
          id: 'word-1',
          text: 'test',
          translation: 'test',
          partOfSpeech: 'noun',
          difficulty: 2,
          language: 'german',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      const updated = SpacedRepetitionService.updateProgress(mockProgress, true, 2)
      
      expect(updated.correctStreak).toBe(1)
      expect(updated.totalReviews).toBe(1)
      expect(updated.repetitions).toBeGreaterThan(0)
      expect(updated.lastReviewDate).toBeDefined()
    })

    it('should reset streak for incorrect answer', () => {
      const mockProgress: WordProgress = {
        id: 'test-1',
        wordId: 'word-1',
        currentInterval: 5,
        easeFactor: 2.5,
        repetitions: 2,
        nextReviewDate: new Date(),
        correctStreak: 3,
        totalReviews: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        word: {
          id: 'word-1',
          text: 'test',
          translation: 'test',
          partOfSpeech: 'noun',
          difficulty: 2,
          language: 'german',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      const updated = SpacedRepetitionService.updateProgress(mockProgress, false, 5)
      
      expect(updated.correctStreak).toBe(0)
      expect(updated.totalReviews).toBe(6)
      expect(updated.repetitions).toBe(0)
      expect(updated.currentInterval).toBe(1)
    })
  })

  describe('getWordsForReview', () => {
    it('should return words due for review', () => {
      const now = new Date()
      const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Yesterday
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Tomorrow

      const mockProgress: WordProgress[] = [
        {
          id: 'test-1',
          wordId: 'word-1',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: pastDate, // Due for review
          correctStreak: 0,
          totalReviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'test-2',
          wordId: 'word-2',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: futureDate, // Not due yet
          correctStreak: 0,
          totalReviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const wordsForReview = SpacedRepetitionService.getWordsForReview(mockProgress)
      
      expect(wordsForReview).toHaveLength(1)
      expect(wordsForReview[0].id).toBe('test-1')
    })
  })

  describe('calculateStats', () => {
    it('should calculate learning statistics correctly', () => {
      const mockProgress: WordProgress[] = [
        {
          id: 'test-1',
          wordId: 'word-1',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitions: 3,
          nextReviewDate: new Date(),
          correctStreak: 5,
          totalReviews: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'test-2',
          wordId: 'word-2',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitions: 1,
          nextReviewDate: new Date(),
          correctStreak: 2,
          totalReviews: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const stats = SpacedRepetitionService.calculateStats(mockProgress)
      
      expect(stats.totalWords).toBe(2)
      expect(stats.reviewedWords).toBe(2)
      expect(stats.masteredWords).toBe(1) // Only first word meets mastery criteria
      expect(stats.totalReviews).toBe(11)
      expect(stats.accuracy).toBeGreaterThan(0)
    })
  })
})