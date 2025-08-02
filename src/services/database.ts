import { PrismaClient } from '../generated/prisma'
import type { 
  Word, 
  TrainingSet, 
  WordProgress, 
  User, 
  Language,
  UserFavoriteWord
} from '../types'

// Create a singleton instance of Prisma Client
let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

// Database service functions for the redesigned schema
export class DatabaseService {
  // Language operations
  static async getAllLanguages(): Promise<Language[]> {
    return await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  }

  static async getLanguageByCode(code: string): Promise<Language | null> {
    return await prisma.language.findUnique({
      where: { code }
    })
  }

  // User operations
  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        activeLanguage: true,
        userLanguages: {
          include: {
            language: true
          }
        }
      }
    })
  }

  static async getDefaultUser(): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        email: 'default@lingolab.dev'
      },
      include: {
        activeLanguage: true,
        userLanguages: {
          include: {
            language: true
          }
        }
      }
    })
  }

  static async switchActiveLanguage(userId: string, languageId: string): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { activeLanguageId: languageId },
      include: {
        activeLanguage: true,
        userLanguages: {
          include: {
            language: true
          }
        }
      }
    })
  }

  // Word operations with rich attributes
  static async getWordsByLanguage(languageId: string): Promise<Word[]> {
    return await prisma.word.findMany({
      where: { languageId },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      orderBy: {
        text: 'asc'
      }
    })
  }

  static async getWordById(id: string): Promise<Word | null> {
    return await prisma.word.findUnique({
      where: { id },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      }
    })
  }

  static async searchWords(
    languageId: string, 
    searchTerm: string, 
    limit: number = 20
  ): Promise<Word[]> {
    return await prisma.word.findMany({
      where: {
        languageId,
        OR: [
          { text: { contains: searchTerm } },
          { translations: { some: { translation: { contains: searchTerm } } } }
        ]
      },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      take: limit,
      orderBy: [
        { frequency: 'asc' }, // More frequent words first
        { difficulty: 'asc' }  // Easier words first
      ]
    })
  }

  static async getWordsByPartOfSpeech(
    languageId: string, 
    partOfSpeech: string
  ): Promise<Word[]> {
    return await prisma.word.findMany({
      where: {
        languageId,
        partOfSpeech
      },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      orderBy: {
        frequency: 'asc'
      }
    })
  }

  // User favorite words
  static async getUserFavoriteWords(userId: string): Promise<UserFavoriteWord[]> {
    return await prisma.userFavoriteWord.findMany({
      where: { userId },
      include: {
        word: {
          include: {
            language: true,
            translations: true,
            attributes: true,
            examples: true
          }
        }
      },
      orderBy: {
        addedAt: 'desc'
      }
    })
  }

  static async addWordToFavorites(
    userId: string, 
    wordId: string, 
    notes?: string
  ): Promise<UserFavoriteWord> {
    return await prisma.userFavoriteWord.create({
      data: {
        userId,
        wordId,
        notes
      },
      include: {
        word: {
          include: {
            language: true,
            translations: true,
            attributes: true,
            examples: true
          }
        }
      }
    })
  }

  static async removeWordFromFavorites(userId: string, wordId: string): Promise<void> {
    await prisma.userFavoriteWord.delete({
      where: {
        userId_wordId: {
          userId,
          wordId
        }
      }
    })
  }

  // Training set operations
  static async getUserTrainingSets(userId: string, languageId?: string): Promise<TrainingSet[]> {
    return await prisma.trainingSet.findMany({
      where: {
        userId,
        ...(languageId && { languageId })
      },
      include: {
        language: true,
        words: {
          include: {
            word: {
              include: {
                language: true,
                translations: true,
                attributes: true,
                examples: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getTrainingSetById(id: string): Promise<TrainingSet | null> {
    return await prisma.trainingSet.findUnique({
      where: { id },
      include: {
        language: true,
        words: {
          include: {
            word: {
              include: {
                language: true,
                translations: true,
                attributes: true,
                examples: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
  }

  static async createTrainingSet(
    userId: string,
    name: string,
    description: string | undefined,
    category: string,
    languageId: string | undefined,
    wordIds: string[]
  ): Promise<TrainingSet> {
    return await prisma.trainingSet.create({
      data: {
        userId,
        name,
        description,
        category,
        languageId,
        words: {
          create: wordIds.map((wordId, index) => ({
            wordId,
            order: index
          }))
        }
      },
      include: {
        language: true,
        words: {
          include: {
            word: {
              include: {
                language: true,
                translations: true,
                attributes: true,
                examples: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
  }

  // Word progress operations
  static async getWordProgress(wordId: string, userId: string): Promise<WordProgress | null> {
    return await prisma.wordProgress.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId
        }
      },
      include: {
        word: {
          include: {
            language: true,
            translations: true,
            attributes: true,
            examples: true
          }
        }
      }
    })
  }

  static async updateWordProgress(
    wordId: string,
    userId: string,
    progressData: Partial<WordProgress>
  ): Promise<WordProgress> {
    return await prisma.wordProgress.upsert({
      where: {
        userId_wordId: {
          userId,
          wordId
        }
      },
      update: progressData,
      create: {
        wordId,
        userId,
        ...progressData
      },
      include: {
        word: {
          include: {
            language: true,
            translations: true,
            attributes: true,
            examples: true
          }
        }
      }
    })
  }

  static async getWordsForReview(userId: string, languageId?: string): Promise<WordProgress[]> {
    return await prisma.wordProgress.findMany({
      where: {
        userId,
        nextReviewDate: {
          lte: new Date()
        },
        ...(languageId && {
          word: {
            languageId
          }
        })
      },
      include: {
        word: {
          include: {
            language: true,
            translations: true,
            attributes: true,
            examples: true
          }
        }
      },
      orderBy: {
        nextReviewDate: 'asc'
      }
    })
  }

  // Learning analytics
  static async getUserLearningStats(userId: string, languageId?: string) {
    const whereClause = {
      userId,
      ...(languageId && {
        word: {
          languageId
        }
      })
    }

    const [totalWords, reviewedWords, masteredWords, wordsForReview] = await Promise.all([
      prisma.wordProgress.count({ where: whereClause }),
      prisma.wordProgress.count({ 
        where: { ...whereClause, totalReviews: { gt: 0 } } 
      }),
      prisma.wordProgress.count({ 
        where: { 
          ...whereClause, 
          repetitions: { gte: 3 }, 
          correctStreak: { gte: 3 } 
        } 
      }),
      prisma.wordProgress.count({ 
        where: { 
          ...whereClause, 
          nextReviewDate: { lte: new Date() } 
        } 
      })
    ])

    const progressRecords = await prisma.wordProgress.findMany({
      where: whereClause,
      select: {
        totalReviews: true,
        correctStreak: true
      }
    })

    const totalReviews = progressRecords.reduce((sum, p) => sum + p.totalReviews, 0)
    const totalCorrect = progressRecords.reduce((sum, p) => 
      sum + Math.min(p.correctStreak, p.totalReviews), 0
    )
    
    const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

    return {
      totalWords,
      reviewedWords,
      masteredWords,
      wordsForReview,
      accuracy,
      totalReviews
    }
  }
}

export { prisma }
export default prisma