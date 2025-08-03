import { PrismaClient } from '../../src/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas for TrainingSet operations
export const createTrainingSetSchema = z.object({
  name: z.string().min(1, 'Training set name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long').default('general'),
  wordIds: z.array(z.string().cuid('Invalid word ID')).min(1, 'At least one word is required'),
  isPublic: z.boolean().default(false)
});

export const updateTrainingSetSchema = z.object({
  name: z.string().min(1, 'Training set name is required').max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long').optional(),
  wordIds: z.array(z.string().cuid('Invalid word ID')).optional(),
  isPublic: z.boolean().optional()
});

export const addWordsToSetSchema = z.object({
  wordIds: z.array(z.string().cuid('Invalid word ID')).min(1, 'At least one word is required')
});

export const removeWordsFromSetSchema = z.object({
  wordIds: z.array(z.string().cuid('Invalid word ID')).min(1, 'At least one word is required')
});

export const reorderWordsSchema = z.object({
  wordOrders: z.array(z.object({
    wordId: z.string().cuid('Invalid word ID'),
    order: z.number().int().min(0)
  })).min(1, 'At least one word order is required')
});

export type CreateTrainingSetInput = z.infer<typeof createTrainingSetSchema>;
export type UpdateTrainingSetInput = z.infer<typeof updateTrainingSetSchema>;
export type AddWordsToSetInput = z.infer<typeof addWordsToSetSchema>;
export type RemoveWordsFromSetInput = z.infer<typeof removeWordsFromSetSchema>;
export type ReorderWordsInput = z.infer<typeof reorderWordsSchema>;

export class TrainingSetService {
  // Get default user ID (hardcoded for this task since we don't have auth yet)
  private static async getDefaultUserId(): Promise<string> {
    let defaultUser = await prisma.user.findFirst({
      where: { email: 'default@lingolab.dev' }
    });

    if (!defaultUser) {
      // Create default user if it doesn't exist
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@lingolab.dev',
          username: 'defaultuser',
          nativeLanguage: 'english'
        }
      });
    }

    return defaultUser.id;
  }

  // Get German language ID
  private static async getGermanLanguageId(): Promise<string> {
    let germanLanguage = await prisma.language.findUnique({
      where: { code: 'de' }
    });

    if (!germanLanguage) {
      germanLanguage = await prisma.language.create({
        data: {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          isActive: true
        }
      });
    }

    return germanLanguage.id;
  }

  // Create a new training set
  static async createTrainingSet(trainingSetData: CreateTrainingSetInput) {
    const userId = await this.getDefaultUserId();
    const germanLanguageId = await this.getGermanLanguageId();

    // Check if training set name already exists for this user and language
    const existingSet = await prisma.trainingSet.findUnique({
      where: {
        userId_name_languageId: {
          userId,
          name: trainingSetData.name,
          languageId: germanLanguageId
        }
      }
    });

    if (existingSet) {
      throw new Error(`Training set "${trainingSetData.name}" already exists`);
    }

    // Verify all words exist and are German words
    const words = await prisma.word.findMany({
      where: {
        id: { in: trainingSetData.wordIds },
        languageId: germanLanguageId
      }
    });

    if (words.length !== trainingSetData.wordIds.length) {
      throw new Error('Some words not found or are not German words');
    }

    // Create the training set with word relationships
    const trainingSet = await prisma.trainingSet.create({
      data: {
        name: trainingSetData.name,
        description: trainingSetData.description,
        category: trainingSetData.category,
        languageId: germanLanguageId,
        userId,
        isPublic: trainingSetData.isPublic,
        words: {
          create: trainingSetData.wordIds.map((wordId, index) => ({
            wordId,
            order: index
          }))
        }
      },
      include: {
        language: true,
        user: {
          select: { id: true, username: true, email: true }
        },
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
          orderBy: { order: 'asc' }
        }
      }
    });

    return trainingSet;
  }

  // Get training set by ID
  static async getTrainingSetById(id: string) {
    const trainingSet = await prisma.trainingSet.findUnique({
      where: { id },
      include: {
        language: true,
        user: {
          select: { id: true, username: true, email: true }
        },
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
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!trainingSet) {
      throw new Error('Training set not found');
    }

    return trainingSet;
  }

  // Get all training sets for default user
  static async getUserTrainingSets(limit?: number, offset?: number, category?: string) {
    const userId = await this.getDefaultUserId();
    const germanLanguageId = await this.getGermanLanguageId();

    const trainingSets = await prisma.trainingSet.findMany({
      where: {
        userId,
        languageId: germanLanguageId,
        ...(category && { category })
      },
      include: {
        language: true,
        user: {
          select: { id: true, username: true, email: true }
        },
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
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset })
    });

    return trainingSets;
  }

  // Update training set
  static async updateTrainingSet(id: string, updateData: UpdateTrainingSetInput) {
    const existingSet = await this.getTrainingSetById(id);
    const userId = await this.getDefaultUserId();
    const germanLanguageId = await this.getGermanLanguageId();

    // Check if new name conflicts with existing sets
    if (updateData.name && updateData.name !== existingSet.name) {
      const conflictingSet = await prisma.trainingSet.findUnique({
        where: {
          userId_name_languageId: {
            userId,
            name: updateData.name,
            languageId: germanLanguageId
          }
        }
      });

      if (conflictingSet) {
        throw new Error(`Training set "${updateData.name}" already exists`);
      }
    }

    // Prepare update data
    const updatePayload: any = {
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.description !== undefined && { description: updateData.description }),
      ...(updateData.category && { category: updateData.category }),
      ...(updateData.isPublic !== undefined && { isPublic: updateData.isPublic })
    };

    // Handle word updates
    if (updateData.wordIds) {
      // Verify all words exist and are German words
      const words = await prisma.word.findMany({
        where: {
          id: { in: updateData.wordIds },
          languageId: germanLanguageId
        }
      });

      if (words.length !== updateData.wordIds.length) {
        throw new Error('Some words not found or are not German words');
      }

      // Replace all words in the training set
      updatePayload.words = {
        deleteMany: {},
        create: updateData.wordIds.map((wordId, index) => ({
          wordId,
          order: index
        }))
      };
    }

    const updatedSet = await prisma.trainingSet.update({
      where: { id },
      data: updatePayload,
      include: {
        language: true,
        user: {
          select: { id: true, username: true, email: true }
        },
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
          orderBy: { order: 'asc' }
        }
      }
    });

    return updatedSet;
  }

  // Delete training set
  static async deleteTrainingSet(id: string) {
    const trainingSet = await this.getTrainingSetById(id);

    await prisma.trainingSet.delete({
      where: { id }
    });

    return { message: 'Training set deleted successfully' };
  }

  // Add words to training set
  static async addWordsToSet(id: string, { wordIds }: AddWordsToSetInput) {
    const trainingSet = await this.getTrainingSetById(id);
    const germanLanguageId = await this.getGermanLanguageId();

    // Verify all words exist and are German words
    const words = await prisma.word.findMany({
      where: {
        id: { in: wordIds },
        languageId: germanLanguageId
      }
    });

    if (words.length !== wordIds.length) {
      throw new Error('Some words not found or are not German words');
    }

    // Check which words are already in the set
    const existingWords = await prisma.trainingSetWord.findMany({
      where: {
        trainingSetId: id,
        wordId: { in: wordIds }
      }
    });

    const existingWordIds = existingWords.map(w => w.wordId);
    const newWordIds = wordIds.filter(wordId => !existingWordIds.includes(wordId));

    if (newWordIds.length === 0) {
      throw new Error('All words are already in the training set');
    }

    // Get the current max order
    const maxOrderResult = await prisma.trainingSetWord.aggregate({
      where: { trainingSetId: id },
      _max: { order: true }
    });

    const startOrder = (maxOrderResult._max.order || -1) + 1;

    // Add new words
    await prisma.trainingSetWord.createMany({
      data: newWordIds.map((wordId, index) => ({
        trainingSetId: id,
        wordId,
        order: startOrder + index
      }))
    });

    // Return updated training set
    return this.getTrainingSetById(id);
  }

  // Remove words from training set
  static async removeWordsFromSet(id: string, { wordIds }: RemoveWordsFromSetInput) {
    const trainingSet = await this.getTrainingSetById(id);

    // Remove the words
    await prisma.trainingSetWord.deleteMany({
      where: {
        trainingSetId: id,
        wordId: { in: wordIds }
      }
    });

    // Return updated training set
    return this.getTrainingSetById(id);
  }

  // Reorder words in training set
  static async reorderWords(id: string, { wordOrders }: ReorderWordsInput) {
    const trainingSet = await this.getTrainingSetById(id);

    // Update word orders
    await Promise.all(
      wordOrders.map(({ wordId, order }) =>
        prisma.trainingSetWord.updateMany({
          where: {
            trainingSetId: id,
            wordId
          },
          data: { order }
        })
      )
    );

    // Return updated training set
    return this.getTrainingSetById(id);
  }

  // Get training set statistics
  static async getTrainingSetStats(id: string) {
    const trainingSet = await this.getTrainingSetById(id);

    // Get training set statistics
    const wordCount = await prisma.trainingSetWord.count({
      where: { trainingSetId: id }
    });

    // Get words with their difficulties for average calculation
    const wordsWithDifficulty = await prisma.trainingSetWord.findMany({
      where: { trainingSetId: id },
      include: {
        word: {
          select: { difficulty: true }
        }
      }
    });

    const averageDifficulty = wordsWithDifficulty.length > 0 
      ? wordsWithDifficulty.reduce((sum, tsw) => sum + (tsw.word?.difficulty || 1), 0) / wordsWithDifficulty.length
      : 1;

    // Calculate estimated study time (rough estimate: 30 seconds per word)
    const estimatedStudyTime = wordCount * 0.5; // minutes

    return {
      totalWords: wordCount,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10,
      estimatedStudyTime: Math.round(estimatedStudyTime),
      createdAt: trainingSet.createdAt,
      updatedAt: trainingSet.updatedAt
    };
  }

  // Search training sets
  static async searchTrainingSets(searchTerm: string, limit: number = 20) {
    const userId = await this.getDefaultUserId();
    const germanLanguageId = await this.getGermanLanguageId();

    const trainingSets = await prisma.trainingSet.findMany({
      where: {
        userId,
        languageId: germanLanguageId,
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { category: { contains: searchTerm } }
        ]
      },
      include: {
        language: true,
        user: {
          select: { id: true, username: true, email: true }
        },
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
          orderBy: { order: 'asc' }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return trainingSets;
  }
}