import type { SpacedRepetitionResult, WordProgress } from '../types'

/**
 * Modified SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo SM-2 algorithm with adjustments for language learning
 */
export class SpacedRepetitionService {
  /**
   * Calculate the next review parameters based on user performance
   * @param quality - Quality of response (0-5 scale)
   *   0: Complete blackout
   *   1: Incorrect response; correct answer remembered
   *   2: Incorrect response; correct answer seemed easy to recall
   *   3: Correct response recalled with serious difficulty
   *   4: Correct response after a hesitation
   *   5: Perfect response
   * @param currentInterval - Current interval in days
   * @param easeFactor - Current ease factor (default 2.5)
   * @param repetitions - Number of consecutive correct responses
   * @returns Next review parameters
   */
  static calculateNextReview(
    quality: number,
    currentInterval: number = 1,
    easeFactor: number = 2.5,
    repetitions: number = 0
  ): SpacedRepetitionResult {
    let newEaseFactor = easeFactor
    let newRepetitions = repetitions
    let newInterval = currentInterval

    // Update ease factor based on quality
    newEaseFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )

    // If quality is less than 3, reset repetitions and set short interval
    if (quality < 3) {
      newRepetitions = 0
      newInterval = 1
    } else {
      newRepetitions += 1

      // Calculate new interval based on repetitions
      if (newRepetitions === 1) {
        newInterval = 1
      } else if (newRepetitions === 2) {
        newInterval = 6
      } else {
        newInterval = Math.round(currentInterval * newEaseFactor)
      }
    }

    // Calculate next review date
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

    return {
      nextInterval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      nextReviewDate
    }
  }

  /**
   * Convert user response to quality score
   * @param correct - Whether the answer was correct
   * @param responseTime - Time taken to respond in seconds
   * @param difficulty - Word difficulty (1-5)
   * @returns Quality score (0-5)
   */
  static responseToQuality(
    correct: boolean,
    responseTime: number,
    difficulty: number = 3
  ): number {
    if (!correct) {
      // Incorrect responses get 0-2 based on how quickly they realized the mistake
      return responseTime < 5 ? 1 : 0
    }

    // Correct responses get 3-5 based on response time and difficulty
    const baseQuality = 3
    let timeBonus = 0
    let difficultyAdjustment = 0

    // Time bonus: faster responses get higher quality
    if (responseTime < 2) {
      timeBonus = 2
    } else if (responseTime < 5) {
      timeBonus = 1
    } else if (responseTime > 15) {
      timeBonus = -1
    }

    // Difficulty adjustment: easier words need faster responses for max quality
    if (difficulty <= 2 && responseTime > 3) {
      difficultyAdjustment = -1
    } else if (difficulty >= 4 && responseTime < 8) {
      difficultyAdjustment = 1
    }

    return Math.max(3, Math.min(5, baseQuality + timeBonus + difficultyAdjustment))
  }

  /**
   * Update word progress after a review session
   * @param currentProgress - Current progress data
   * @param correct - Whether the answer was correct
   * @param responseTime - Time taken to respond in seconds
   * @returns Updated progress data
   */
  static updateProgress(
    currentProgress: WordProgress,
    correct: boolean,
    responseTime: number
  ): Partial<WordProgress> {
    const quality = this.responseToQuality(
      correct,
      responseTime,
      currentProgress.word?.difficulty || 3
    )

    const nextReview = this.calculateNextReview(
      quality,
      currentProgress.currentInterval,
      currentProgress.easeFactor,
      currentProgress.repetitions
    )

    // Update statistics
    const newTotalReviews = currentProgress.totalReviews + 1
    const newCorrectStreak = correct ? currentProgress.correctStreak + 1 : 0
    
    // Calculate new average response time
    const currentAvg = currentProgress.averageResponseTime || responseTime
    const newAverageResponseTime = 
      (currentAvg * currentProgress.totalReviews + responseTime) / newTotalReviews

    return {
      currentInterval: nextReview.nextInterval,
      easeFactor: nextReview.easeFactor,
      repetitions: nextReview.repetitions,
      nextReviewDate: nextReview.nextReviewDate,
      lastReviewDate: new Date(),
      correctStreak: newCorrectStreak,
      totalReviews: newTotalReviews,
      averageResponseTime: newAverageResponseTime,
      updatedAt: new Date()
    }
  }

  /**
   * Get words that are due for review
   * @param allProgress - Array of all word progress records
   * @param limit - Maximum number of words to return
   * @returns Words due for review, sorted by priority
   */
  static getWordsForReview(
    allProgress: WordProgress[],
    limit: number = 20
  ): WordProgress[] {
    const now = new Date()
    
    return allProgress
      .filter(progress => progress.nextReviewDate <= now)
      .sort((a, b) => {
        // Sort by next review date (overdue first)
        const dateComparison = a.nextReviewDate.getTime() - b.nextReviewDate.getTime()
        if (dateComparison !== 0) return dateComparison
        
        // Then by difficulty (harder words first)
        const difficultyA = a.word?.difficulty || 3
        const difficultyB = b.word?.difficulty || 3
        return difficultyB - difficultyA
      })
      .slice(0, limit)
  }

  /**
   * Calculate learning statistics
   * @param allProgress - Array of all word progress records
   * @returns Learning statistics
   */
  static calculateStats(allProgress: WordProgress[]) {
    const totalWords = allProgress.length
    const reviewedWords = allProgress.filter(p => p.totalReviews > 0).length
    const masteredWords = allProgress.filter(p => p.repetitions >= 3 && p.correctStreak >= 3).length
    const wordsForReview = allProgress.filter(p => p.nextReviewDate <= new Date()).length
    
    const totalReviews = allProgress.reduce((sum, p) => sum + p.totalReviews, 0)
    const totalCorrect = allProgress.reduce((sum, p) => {
      // Estimate correct answers based on streak and total reviews
      return sum + Math.min(p.correctStreak, p.totalReviews)
    }, 0)
    
    const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0
    
    return {
      totalWords,
      reviewedWords,
      masteredWords,
      wordsForReview,
      accuracy: Math.round(accuracy),
      totalReviews
    }
  }
}