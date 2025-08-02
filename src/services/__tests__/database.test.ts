import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { DatabaseService, prisma } from '../database'

describe('Database Service - Redesigned Schema', () => {
  let germanLanguageId: string
  let defaultUserId: string

  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect()

    // Get the German language and default user from seed data
    const germanLanguage = await prisma.language.findUnique({
      where: { code: 'de' },
    })
    const defaultUser = await prisma.user.findUnique({
      where: { email: 'default@lingolab.dev' },
    })

    germanLanguageId = germanLanguage!.id
    defaultUserId = defaultUser!.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should retrieve all languages', async () => {
    const languages = await DatabaseService.getAllLanguages()

    expect(languages).toBeDefined()
    expect(Array.isArray(languages)).toBe(true)
    expect(languages.length).toBeGreaterThan(0)

    // Check that we have German language
    const languageCodes = languages.map((l) => l.code)
    expect(languageCodes).toContain('de')
  })

  it('should retrieve words by language', async () => {
    const words = await DatabaseService.getWordsByLanguage(germanLanguageId)

    expect(words).toBeDefined()
    expect(Array.isArray(words)).toBe(true)
    expect(words.length).toBeGreaterThan(0)

    // Check that we have expected German words
    const wordTexts = words.map((w) => w.text)
    expect(wordTexts).toContain('Hallo')
    expect(wordTexts).toContain('Haus')
    expect(wordTexts).toContain('lernen')

    // Check that words have rich attributes
    const halloWord = words.find((w) => w.text === 'Hallo')
    expect(halloWord?.translations).toBeDefined()
    expect(halloWord?.attributes).toBeDefined()
    expect(halloWord?.examples).toBeDefined()
    expect(halloWord?.translations?.length).toBeGreaterThan(0)
  })

  it('should search words by text and translation', async () => {
    const searchResults = await DatabaseService.searchWords(germanLanguageId, 'hello')

    expect(searchResults).toBeDefined()
    expect(Array.isArray(searchResults)).toBe(true)

    // Should find "Hallo" because it translates to "Hello"
    const foundHallo = searchResults.find((w) => w.text === 'Hallo')
    expect(foundHallo).toBeDefined()
  })

  it('should retrieve words by part of speech', async () => {
    const nouns = await DatabaseService.getWordsByPartOfSpeech(germanLanguageId, 'noun')

    expect(nouns).toBeDefined()
    expect(Array.isArray(nouns)).toBe(true)
    expect(nouns.length).toBeGreaterThan(0)

    // Should find "Haus"
    const hausWord = nouns.find((w) => w.text === 'Haus')
    expect(hausWord).toBeDefined()
    expect(hausWord?.partOfSpeech).toBe('noun')
  })

  it('should retrieve user training sets', async () => {
    const trainingSets = await DatabaseService.getUserTrainingSets(defaultUserId, germanLanguageId)

    expect(trainingSets).toBeDefined()
    expect(Array.isArray(trainingSets)).toBe(true)
    expect(trainingSets.length).toBeGreaterThan(0)

    // Check that we have the basic German set
    const basicSet = trainingSets.find((s) => s.name === 'Basic German')
    expect(basicSet).toBeDefined()
    expect(basicSet?.words).toBeDefined()
    expect(basicSet?.words?.length).toBeGreaterThan(0)
  })

  it('should retrieve a specific training set by ID', async () => {
    const trainingSets = await DatabaseService.getUserTrainingSets(defaultUserId)
    const firstSet = trainingSets[0]

    const retrievedSet = await DatabaseService.getTrainingSetById(firstSet.id)

    expect(retrievedSet).toBeDefined()
    expect(retrievedSet?.id).toBe(firstSet.id)
    expect(retrievedSet?.name).toBe(firstSet.name)
    expect(retrievedSet?.words).toBeDefined()
    expect(Array.isArray(retrievedSet?.words)).toBe(true)
  })

  it('should retrieve user favorite words', async () => {
    const favoriteWords = await DatabaseService.getUserFavoriteWords(defaultUserId)

    expect(favoriteWords).toBeDefined()
    expect(Array.isArray(favoriteWords)).toBe(true)
    expect(favoriteWords.length).toBeGreaterThan(0)

    // Check that favorites have notes
    const firstFavorite = favoriteWords[0]
    expect(firstFavorite.notes).toBeDefined()
    expect(firstFavorite.word).toBeDefined()
  })

  it('should retrieve the default user with language info', async () => {
    const defaultUser = await DatabaseService.getDefaultUser()

    expect(defaultUser).toBeDefined()
    expect(defaultUser?.email).toBe('default@lingolab.dev')
    expect(defaultUser?.username).toBe('default_user')
    expect(defaultUser?.activeLanguage).toBeDefined()
    expect(defaultUser?.activeLanguage?.code).toBe('de')
    expect(defaultUser?.userLanguages).toBeDefined()
    expect(defaultUser?.userLanguages?.length).toBeGreaterThan(0)
  })

  it('should calculate user learning stats', async () => {
    const stats = await DatabaseService.getUserLearningStats(defaultUserId, germanLanguageId)

    expect(stats).toBeDefined()
    expect(typeof stats.totalWords).toBe('number')
    expect(typeof stats.reviewedWords).toBe('number')
    expect(typeof stats.masteredWords).toBe('number')
    expect(typeof stats.wordsForReview).toBe('number')
    expect(typeof stats.accuracy).toBe('number')
    expect(typeof stats.totalReviews).toBe('number')
  })
})
