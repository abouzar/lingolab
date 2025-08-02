-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nativeLanguage" TEXT NOT NULL DEFAULT 'english',
    "activeLanguageId" TEXT,
    "dailyGoal" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_activeLanguageId_fkey" FOREIGN KEY ("activeLanguageId") REFERENCES "languages" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL DEFAULT 'beginner',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_languages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_languages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "frequency" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "words_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "context" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "word_translations_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_attributes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "attributeType" TEXT NOT NULL,
    "attributeValue" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "word_attributes_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_favorite_words" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "user_favorite_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_favorite_words_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "examples" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sentence" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "examples_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "training_sets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "languageId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "training_sets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "training_sets_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "training_set_words" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainingSetId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "training_set_words_trainingSetId_fkey" FOREIGN KEY ("trainingSetId") REFERENCES "training_sets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "training_set_words_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "currentInterval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewDate" DATETIME,
    "correctStreak" INTEGER NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTime" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "word_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "word_progress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_languages_userId_languageId_key" ON "user_languages"("userId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "words_text_languageId_key" ON "words"("text", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "word_translations_wordId_targetLanguage_translation_key" ON "word_translations"("wordId", "targetLanguage", "translation");

-- CreateIndex
CREATE UNIQUE INDEX "word_attributes_wordId_attributeType_context_key" ON "word_attributes"("wordId", "attributeType", "context");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_words_userId_wordId_key" ON "user_favorite_words"("userId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "training_sets_userId_name_languageId_key" ON "training_sets"("userId", "name", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "training_set_words_trainingSetId_wordId_key" ON "training_set_words"("trainingSetId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "word_progress_userId_wordId_key" ON "word_progress"("userId", "wordId");
