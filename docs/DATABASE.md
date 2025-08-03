# LingoLab Database Documentation

## Overview

LingoLab uses SQLite with Prisma ORM for data persistence. The database is designed to support multi-language vocabulary learning with spaced repetition, rich word attributes, user favorites, and flexible training sets.

## Database Schema

### Core Models

#### Language
- Stores supported languages with ISO codes
- Includes display names and native names
- Supports multiple target languages per user

#### User
- Stores user information with multi-language support
- Has an active language for current learning session
- Supports multiple target languages simultaneously
- Tracks proficiency levels per language

#### UserLanguage
- Junction table for user-language relationships
- Tracks proficiency level and learning timeline
- Enables multi-language learning progress

#### Word
- Represents vocabulary words in any supported language
- Language-specific with rich attribute support
- Includes frequency ranking and difficulty levels
- Supports contextual translations and examples

#### WordTranslation
- Multiple translations per word in different target languages
- Contextual translations (formal, informal, romantic, etc.)
- Primary translation marking for UI optimization

#### WordAttribute
- Flexible attribute system for language-specific features
- German: articles (der/die/das), genders, plurals
- Verbs: conjugations for different persons
- Extensible for any language requirements

#### UserFavoriteWord
- User's favorite words with personal notes
- Supports learning personalization and quick access
- Enables social features and sharing

#### Example
- Sample sentences demonstrating word usage
- Context-aware examples with translations
- Belongs to a specific word

#### TrainingSet
- Collections of words for focused study
- User-owned with optional language association
- Supports public/private sharing
- Custom word ordering within sets

#### TrainingSetWord
- Junction table for training set word relationships
- Includes ordering information for pedagogical sequencing

#### WordProgress
- Tracks spaced repetition progress per user per word
- Implements enhanced SM-2 algorithm parameters
- Rich analytics: response time, streaks, accuracy

## Database Setup

### Prerequisites
- Node.js and npm installed
- SQLite (included with Prisma)

### Installation
```bash
# Install dependencies
npm install prisma @prisma/client tsx

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with German vocabulary
npm run db:seed
```

### Available Scripts
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Seed Data

The database comes pre-populated with:

### Languages
- German (de) - Deutsch
- English (en) - English

### German Vocabulary (3 words with rich attributes)
- **Hallo** (interjection)
  - Translations: Hello (main), Hi (informal)
  - Attributes: pronunciation (HAH-loh)
  - Examples: "Hallo, wie geht es dir?" → "Hello, how are you?"

- **Haus** (noun)
  - Translations: house (main), home (dwelling context)
  - Attributes: article (das), gender (neuter), plural (Häuser)
  - Examples: "Das ist mein Haus." → "This is my house."

- **lernen** (verb)
  - Translations: to learn (main)
  - Attributes: conjugations (ich lerne, du lernst, er lernt)
  - Examples: "Ich lerne Deutsch." → "I am learning German."

### Training Sets
- **Basic German** (3 words)
  - Contains all seeded words with proper ordering
  - Category: basics
  - Language-specific (German)

### Default User
- Email: default@lingolab.dev
- Username: default_user
- Native Language: English
- Active Language: German
- User Languages: German (beginner level)
- Favorite Words: Hallo, Haus (with personal notes)

## Database Services

### DatabaseService
Located in `src/services/database.ts`, provides:

**Language Operations:**
- `getAllLanguages()` - Get all active languages
- `getLanguageByCode(code)` - Find language by ISO code

**User Operations:**
- `getUserById(id)` - Get user with language relationships
- `getDefaultUser()` - Get MVP default user
- `switchActiveLanguage(userId, languageId)` - Change active language

**Word Operations:**
- `getWordsByLanguage(languageId)` - Get all words for a language
- `getWordById(id)` - Get word with full attributes
- `searchWords(languageId, term)` - Search by text or translation
- `getWordsByPartOfSpeech(languageId, pos)` - Filter by grammar type

**Favorite Words:**
- `getUserFavoriteWords(userId)` - Get user's favorites
- `addWordToFavorites(userId, wordId, notes)` - Add to favorites
- `removeWordFromFavorites(userId, wordId)` - Remove from favorites

**Training Sets:**
- `getUserTrainingSets(userId, languageId?)` - Get user's sets
- `getTrainingSetById(id)` - Get set with words
- `createTrainingSet(...)` - Create new training set

**Progress Tracking:**
- `getWordProgress(wordId, userId)` - Get learning progress
- `updateWordProgress(...)` - Update after review
- `getWordsForReview(userId, languageId?)` - Get due words
- `getUserLearningStats(userId, languageId?)` - Calculate statistics

### SpacedRepetitionService
Located in `src/services/spacedRepetition.ts`, implements:
- Enhanced SM-2 spaced repetition algorithm
- Quality scoring based on response time and word difficulty
- Progress calculation with streak tracking
- Review scheduling with priority sorting
- Learning analytics and statistics

## Testing

Database functionality is tested with:
- Unit tests for database operations
- Spaced repetition algorithm tests
- Integration tests with seeded data

Run tests with:
```bash
npm run test:unit -- --run src/services/__tests__/
```

## File Structure

```
prisma/
├── schema.prisma          # Database schema definition
├── seed.ts               # Database seeding script
└── migrations/           # Database migration files

src/
├── generated/
│   └── prisma/          # Generated Prisma client
├── services/
│   ├── database.ts      # Database service layer
│   ├── spacedRepetition.ts  # Spaced repetition logic
│   └── __tests__/       # Service tests
└── types/
    └── index.ts         # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the project root:
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

## Migration to PostgreSQL

For production scaling, the database can be migrated to PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Change `provider` in `schema.prisma` to `postgresql`
3. Run `npx prisma migrate dev` to create new migrations
4. Update deployment configuration

The current schema and services are designed to be database-agnostic and will work with PostgreSQL without code changes.