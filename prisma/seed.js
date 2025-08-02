import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Create German language
    const germanLanguage = await prisma.language.create({
      data: {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch'
      }
    })

    console.log(`🌍 Created German language`)

    // Create a default user
    const defaultUser = await prisma.user.create({
      data: {
        email: 'default@lingolab.dev',
        username: 'default_user',
        nativeLanguage: 'english',
        activeLanguageId: germanLanguage.id,
        userLanguages: {
          create: {
            languageId: germanLanguage.id,
            proficiencyLevel: 'beginner'
          }
        }
      }
    })

    console.log('👤 Created default user:', defaultUser.username)

    // Create German words with rich attributes
    const halloWord = await prisma.word.create({
      data: {
        text: 'Hallo',
        languageId: germanLanguage.id,
        partOfSpeech: 'interjection',
        difficulty: 1,
        frequency: 50,
        translations: {
          create: [
            { targetLanguage: 'en', translation: 'Hello', isMain: true },
            { targetLanguage: 'en', translation: 'Hi', context: 'informal' }
          ]
        },
        attributes: {
          create: [
            { attributeType: 'pronunciation', attributeValue: 'HAH-loh' }
          ]
        },
        examples: {
          create: [
            {
              sentence: 'Hallo, wie geht es dir?',
              translation: 'Hello, how are you?'
            }
          ]
        }
      }
    })

    const hausWord = await prisma.word.create({
      data: {
        text: 'Haus',
        languageId: germanLanguage.id,
        partOfSpeech: 'noun',
        difficulty: 1,
        frequency: 200,
        translations: {
          create: [
            { targetLanguage: 'en', translation: 'house', isMain: true },
            { targetLanguage: 'en', translation: 'home', context: 'dwelling' }
          ]
        },
        attributes: {
          create: [
            { attributeType: 'article', attributeValue: 'das' },
            { attributeType: 'gender', attributeValue: 'neuter' },
            { attributeType: 'plural', attributeValue: 'Häuser' }
          ]
        },
        examples: {
          create: [
            {
              sentence: 'Das ist mein Haus.',
              translation: 'This is my house.'
            }
          ]
        }
      }
    })

    const lernenWord = await prisma.word.create({
      data: {
        text: 'lernen',
        languageId: germanLanguage.id,
        partOfSpeech: 'verb',
        difficulty: 2,
        frequency: 100,
        translations: {
          create: [
            { targetLanguage: 'en', translation: 'to learn', isMain: true }
          ]
        },
        attributes: {
          create: [
            { attributeType: 'conjugation_ich', attributeValue: 'lerne' },
            { attributeType: 'conjugation_du', attributeValue: 'lernst' },
            { attributeType: 'conjugation_er', attributeValue: 'lernt' }
          ]
        },
        examples: {
          create: [
            {
              sentence: 'Ich lerne Deutsch.',
              translation: 'I am learning German.'
            }
          ]
        }
      }
    })

    console.log('📝 Created 3 German words with translations and attributes')

    // Create a training set
    const basicSet = await prisma.trainingSet.create({
      data: {
        name: 'Basic German',
        description: 'Essential German words for beginners',
        category: 'basics',
        userId: defaultUser.id,
        languageId: germanLanguage.id,
        words: {
          create: [
            { wordId: halloWord.id, order: 0 },
            { wordId: hausWord.id, order: 1 },
            { wordId: lernenWord.id, order: 2 }
          ]
        }
      }
    })

    console.log(`📚 Created training set: ${basicSet.name}`)

    // Add favorite words
    await prisma.userFavoriteWord.create({
      data: {
        userId: defaultUser.id,
        wordId: halloWord.id,
        notes: 'My first German word!'
      }
    })

    await prisma.userFavoriteWord.create({
      data: {
        userId: defaultUser.id,
        wordId: hausWord.id,
        notes: 'Love the article system in German'
      }
    })

    console.log('⭐ Added 2 favorite words for user')
    console.log('✅ Database seed completed successfully!')

  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    // eslint-disable-next-line no-undef
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })