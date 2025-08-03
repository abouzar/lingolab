import { PrismaClient } from '../../src/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas for Word operations
export const createWordSchema = z.object({
  text: z.string().min(1, 'Word text is required').max(100, 'Word text too long'),
  translation: z.string().min(1, 'Translation is required').max(200, 'Translation too long'),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'article', 'pronoun']),
  difficulty: z.number().int().min(1).max(5).default(1),
  frequency: z.number().int().min(1).optional(),
  pronunciation: z.string().optional(),
  examples: z.array(z.object({
    sentence: z.string().min(1, 'Example sentence is required'),
    translation: z.string().min(1, 'Example translation is required')
  })).optional().default([]),
  attributes: z.array(z.object({
    attributeType: z.enum(['article', 'plural', 'gender', 'conjugation', 'case']),
    attributeValue: z.string().min(1, 'Attribute value is required'),
    context: z.string().optional()
  })).optional().default([])
});

export const updateWordSchema = createWordSchema.partial();

export type CreateWordInput = z.infer<typeof createWordSchema>;
export type UpdateWordInput = z.infer<typeof updateWordSchema>;

export class WordService {
  // Get German language ID (hardcoded for this task)
  private static async getGermanLanguageId(): Promise<string> {
    let germanLanguage = await prisma.language.findUnique({
      where: { code: 'de' }
    });

    if (!germanLanguage) {
      // Create German language if it doesn't exist
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

  // Create a new German word
  static async createWord(wordData: CreateWordInput) {
    const germanLanguageId = await this.getGermanLanguageId();

    // Check if word already exists for German language
    const existingWord = await prisma.word.findUnique({
      where: {
        text_languageId: {
          text: wordData.text,
          languageId: germanLanguageId
        }
      }
    });

    if (existingWord) {
      throw new Error(`Word "${wordData.text}" already exists in German`);
    }

    // Create the word with all related data
    const word = await prisma.word.create({
      data: {
        text: wordData.text,
        languageId: germanLanguageId,
        partOfSpeech: wordData.partOfSpeech,
        difficulty: wordData.difficulty,
        frequency: wordData.frequency,
        translations: {
          create: {
            targetLanguage: 'en', // English translation
            translation: wordData.translation,
            isMain: true
          }
        },
        examples: {
          create: wordData.examples?.map(example => ({
            sentence: example.sentence,
            translation: example.translation
          })) || []
        },
        attributes: {
          create: wordData.attributes?.map(attr => ({
            attributeType: attr.attributeType,
            attributeValue: attr.attributeValue,
            context: attr.context
          })) || []
        }
      },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      }
    });

    return word;
  }

  // Get word by ID
  static async getWordById(id: string) {
    const word = await prisma.word.findUnique({
      where: { id },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      }
    });

    if (!word) {
      throw new Error('Word not found');
    }

    return word;
  }

  // Get all German words
  static async getGermanWords(limit?: number, offset?: number) {
    const germanLanguageId = await this.getGermanLanguageId();

    const words = await prisma.word.findMany({
      where: { languageId: germanLanguageId },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      orderBy: [
        { frequency: 'asc' },
        { text: 'asc' }
      ],
      ...(limit && { take: limit }),
      ...(offset && { skip: offset })
    });

    return words;
  }

  // Search German words
  static async searchGermanWords(searchTerm: string, limit: number = 20) {
    const germanLanguageId = await this.getGermanLanguageId();

    const words = await prisma.word.findMany({
      where: {
        languageId: germanLanguageId,
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
        { frequency: 'asc' },
        { difficulty: 'asc' },
        { text: 'asc' }
      ]
    });

    return words;
  }

  // Update word
  static async updateWord(id: string, updateData: UpdateWordInput) {
    const existingWord = await this.getWordById(id);

    // Prepare update data
    const updatePayload: any = {
      ...(updateData.text && { text: updateData.text }),
      ...(updateData.partOfSpeech && { partOfSpeech: updateData.partOfSpeech }),
      ...(updateData.difficulty !== undefined && { difficulty: updateData.difficulty }),
      ...(updateData.frequency !== undefined && { frequency: updateData.frequency })
    };

    // Handle translations update
    if (updateData.translation) {
      updatePayload.translations = {
        updateMany: {
          where: { targetLanguage: 'en', isMain: true },
          data: { translation: updateData.translation }
        }
      };
    }

    // Handle examples update
    if (updateData.examples) {
      // Delete existing examples and create new ones
      updatePayload.examples = {
        deleteMany: {},
        create: updateData.examples.map(example => ({
          sentence: example.sentence,
          translation: example.translation
        }))
      };
    }

    // Handle attributes update
    if (updateData.attributes) {
      // Delete existing attributes and create new ones
      updatePayload.attributes = {
        deleteMany: {},
        create: updateData.attributes.map(attr => ({
          attributeType: attr.attributeType,
          attributeValue: attr.attributeValue,
          context: attr.context
        }))
      };
    }

    const updatedWord = await prisma.word.update({
      where: { id },
      data: updatePayload,
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      }
    });

    return updatedWord;
  }

  // Delete word
  static async deleteWord(id: string) {
    const word = await this.getWordById(id);

    await prisma.word.delete({
      where: { id }
    });

    return { message: 'Word deleted successfully' };
  }

  // Get words by part of speech
  static async getWordsByPartOfSpeech(partOfSpeech: string, limit?: number) {
    const germanLanguageId = await this.getGermanLanguageId();

    const words = await prisma.word.findMany({
      where: {
        languageId: germanLanguageId,
        partOfSpeech
      },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      orderBy: [
        { frequency: 'asc' },
        { text: 'asc' }
      ],
      ...(limit && { take: limit })
    });

    return words;
  }

  // Get words by difficulty level
  static async getWordsByDifficulty(difficulty: number, limit?: number) {
    const germanLanguageId = await this.getGermanLanguageId();

    const words = await prisma.word.findMany({
      where: {
        languageId: germanLanguageId,
        difficulty
      },
      include: {
        language: true,
        translations: true,
        attributes: true,
        examples: true
      },
      orderBy: [
        { frequency: 'asc' },
        { text: 'asc' }
      ],
      ...(limit && { take: limit })
    });

    return words;
  }
}