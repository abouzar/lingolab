# LingoLab Database Schema

## Overview
Multi-language vocabulary learning system with spaced repetition, user favorites, and flexible training sets.

## Core Tables

### `languages`
Supported languages for learning.
- `code` - ISO language code (e.g., "de", "fr")
- `name` - Display name (e.g., "German")
- `nativeName` - Native language name (e.g., "Deutsch")

### `users`
User accounts with multi-language support.
- `email`, `username` - User identification
- `nativeLanguage` - User's native language
- `activeLanguageId` - Currently selected target language
- `dailyGoal` - Daily learning target

### `user_languages`
Junction table for user-language relationships.
- `userId`, `languageId` - Links users to languages they're learning
- `proficiencyLevel` - "beginner", "intermediate", "advanced"
- `startedAt`, `lastActiveAt` - Learning timeline

## Word System

### `words`
Vocabulary words in any supported language.
- `text` - The word itself
- `languageId` - Which language this word belongs to
- `partOfSpeech` - Grammar category (noun, verb, etc.)
- `difficulty` - 1-5 scale
- `frequency` - Word frequency ranking (optional)

### `word_translations`
Multiple translations per word.
- `wordId`, `targetLanguage` - Links word to translation
- `translation` - The actual translation
- `context` - When this translation applies (e.g., "formal", "romantic")
- `isMain` - Primary translation for UI

### `word_attributes`
Language-specific word properties.
- `wordId`, `attributeType` - Links word to attribute
- `attributeValue` - The actual value
- `context` - When this attribute applies
- **Examples**: article="das", gender="neuter", plural="Häuser", conjugation_ich="lerne"

### `examples`
Sample sentences demonstrating word usage.
- `wordId` - Links to word
- `sentence` - Example in target language
- `translation` - Example in native language

## Learning System

### `training_sets`
Collections of words for focused study.
- `userId` - Owner of the set
- `name`, `description` - Set identification
- `languageId` - Target language (optional for mixed sets)
- `category` - Organization (e.g., "basics", "grammar")
- `isPublic` - Sharing capability

### `training_set_words`
Junction table for training set contents.
- `trainingSetId`, `wordId` - Links sets to words
- `order` - Custom word sequence within set

### `user_favorite_words`
User's bookmarked words.
- `userId`, `wordId` - Links users to favorite words
- `notes` - Personal notes/mnemonics
- `addedAt` - When favorited

### `word_progress`
Spaced repetition learning progress.
- `userId`, `wordId` - Progress per user per word
- `currentInterval` - Days until next review
- `easeFactor` - SM-2 algorithm parameter
- `repetitions` - Consecutive correct answers
- `nextReviewDate` - When to review next
- `correctStreak`, `totalReviews` - Learning statistics
- `averageResponseTime` - Performance analytics

## Key Relationships

- **User ↔ Languages**: Many-to-many via `user_languages`
- **Word ↔ Translations**: One-to-many via `word_translations`
- **Word ↔ Attributes**: One-to-many via `word_attributes`
- **TrainingSet ↔ Words**: Many-to-many via `training_set_words`
- **User ↔ Words**: Progress tracking via `word_progress`, favorites via `user_favorite_words`

## Unique Constraints

- `words`: `(text, languageId)` - Same word can exist in different languages
- `training_sets`: `(userId, name, languageId)` - User can't duplicate set names per language
- `word_progress`: `(userId, wordId)` - One progress record per user per word
- `user_favorite_words`: `(userId, wordId)` - Prevent duplicate favorites

## Design Benefits

- **Scalable**: Easy to add new languages without schema changes
- **Flexible**: Rich attributes support any language's grammar rules
- **Personal**: User favorites and notes for customized learning
- **Contextual**: Multiple translations with usage contexts
- **Analytics**: Comprehensive progress tracking for spaced repetition