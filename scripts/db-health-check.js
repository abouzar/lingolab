#!/usr/bin/env node
/* eslint-disable no-undef, no-unused-vars */

import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkDatabaseHealth() {
  const checks = []
  
  try {
    console.log('🔍 Running database health checks...')
    
    // 1. Connection test
    try {
      await prisma.$connect()
      console.log('✓ Database connection - OK')
      checks.push(true)
    } catch (error) {
      console.error('✗ Database connection - FAILED:', error.message)
      checks.push(false)
    }

    // 2. Schema validation
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`
      console.log('✓ Database schema - OK')
      checks.push(true)
    } catch (error) {
      console.error('✗ Database schema - FAILED:', error.message)
      checks.push(false)
    }

    // 3. Check required tables exist
    const requiredTables = [
      'languages', 'users', 'user_languages', 'words', 
      'word_translations', 'word_attributes', 'examples',
      'training_sets', 'training_set_words', 'user_favorite_words', 'word_progress'
    ]

    for (const table of requiredTables) {
      try {
        await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM ${table} LIMIT 1`)
        console.log(`✓ Table '${table}' - OK`)
        checks.push(true)
      } catch (error) {
        console.error(`✗ Table '${table}' - FAILED:`, error.message)
        checks.push(false)
      }
    }

    // 4. Check seed data integrity
    try {
      const languageCount = await prisma.language.count()
      const userCount = await prisma.user.count()
      const wordCount = await prisma.word.count()
      const trainingSetCount = await prisma.trainingSet.count()

      if (languageCount > 0 && userCount > 0 && wordCount > 0 && trainingSetCount > 0) {
        console.log('✓ Seed data integrity - OK')
        console.log(`  Languages: ${languageCount}, Users: ${userCount}, Words: ${wordCount}, Training Sets: ${trainingSetCount}`)
        checks.push(true)
      } else {
        console.error('✗ Seed data integrity - FAILED: Missing required seed data')
        checks.push(false)
      }
    } catch (error) {
      console.error('✗ Seed data integrity - FAILED:', error.message)
      checks.push(false)
    }

    // 5. Check relationships
    try {
      const userWithLanguages = await prisma.user.findFirst({
        include: {
          activeLanguage: true,
          userLanguages: true
        }
      })

      if (userWithLanguages && userWithLanguages.activeLanguage && userWithLanguages.userLanguages.length > 0) {
        console.log('✓ Database relationships - OK')
        checks.push(true)
      } else {
        console.error('✗ Database relationships - FAILED: Missing required relationships')
        checks.push(false)
      }
    } catch (error) {
      console.error('✗ Database relationships - FAILED:', error.message)
      checks.push(false)
    }

    // 6. Check word attributes
    try {
      const wordWithAttributes = await prisma.word.findFirst({
        include: {
          translations: true,
          attributes: true,
          examples: true
        }
      })

      if (wordWithAttributes && 
          wordWithAttributes.translations.length > 0 && 
          wordWithAttributes.attributes.length > 0 && 
          wordWithAttributes.examples.length > 0) {
        console.log('✓ Word data structure - OK')
        checks.push(true)
      } else {
        console.error('✗ Word data structure - FAILED: Missing word attributes/translations/examples')
        checks.push(false)
      }
    } catch (error) {
      console.error('✗ Word data structure - FAILED:', error.message)
      checks.push(false)
    }

    const failedChecks = checks.filter(check => !check).length
    const totalChecks = checks.length

    console.log(`\n📊 Health Check Summary: ${totalChecks - failedChecks}/${totalChecks} checks passed`)

    if (failedChecks === 0) {
      console.log('🎉 Database is healthy!')
      process.exit(0)
    } else {
      console.log(`💥 ${failedChecks} check(s) failed!`)
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Health check failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseHealth()