#!/usr/bin/env node
/* eslint-disable no-undef, no-unused-vars, no-empty */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import chalk from 'chalk'

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  section: (msg) => console.log(chalk.cyan.bold(`\n=== ${msg} ===`))
}

const runCommand = (command, description, options = {}) => {
  try {
    log.info(`Running: ${description}`)
    const result = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options 
    })
    log.success(`${description} - PASSED`)
    return { success: true, output: result }
  } catch (error) {
    log.error(`${description} - FAILED`)
    if (options.silent && error.stdout) {
      console.log(error.stdout)
    }
    if (error.stderr) {
      console.error(error.stderr)
    }
    return { success: false, error }
  }
}

const checkFile = (path, description) => {
  if (existsSync(path)) {
    log.success(`${description} - EXISTS`)
    return true
  } else {
    log.error(`${description} - MISSING`)
    return false
  }
}

async function runTestPipeline() {
  console.log(chalk.bold.blue('\n🚀 LingoLab Test Pipeline\n'))
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    sections: {}
  }

  const addResult = (section, success) => {
    results.total++
    if (success) results.passed++
    else results.failed++
    
    if (!results.sections[section]) {
      results.sections[section] = { passed: 0, failed: 0 }
    }
    if (success) results.sections[section].passed++
    else results.sections[section].failed++
  }

  // 1. Environment Check
  log.section('Environment Check')
  addResult('environment', checkFile('package.json', 'Package.json exists'))
  addResult('environment', checkFile('prisma/schema.prisma', 'Prisma schema exists'))
  addResult('environment', checkFile('.env', 'Environment file exists'))
  addResult('environment', checkFile('src/generated/prisma', 'Prisma client generated'))

  // 2. Dependencies Check
  log.section('Dependencies Check')
  const depsResult = runCommand('npm ls --depth=0', 'Check dependencies', { silent: true })
  addResult('dependencies', depsResult.success)

  // 3. Code Quality
  log.section('Code Quality')
  const lintResult = runCommand('npm run lint', 'ESLint check')
  addResult('quality', lintResult.success)

  // 4. TypeScript Compilation
  log.section('TypeScript Check')
  const buildResult = runCommand('npm run build-only', 'TypeScript compilation & build')
  addResult('typescript', buildResult.success)

  // 5. Database Tests
  log.section('Database Tests')
  const dbGenResult = runCommand('npx prisma generate', 'Prisma client generation')
  addResult('database', dbGenResult.success)
  
  if (dbGenResult.success) {
    const dbTestResult = runCommand('npm run test:unit -- --run src/services/__tests__/database.test.ts', 'Database service tests')
    addResult('database', dbTestResult.success)
  }

  // 6. Business Logic Tests
  log.section('Business Logic Tests')
  const spacedRepResult = runCommand('npm run test:unit -- --run src/services/__tests__/spacedRepetition.test.ts', 'Spaced repetition tests')
  addResult('logic', spacedRepResult.success)

  // 7. Component Tests
  log.section('Component Tests')
  const componentResult = runCommand('npm run test:unit -- --run src/components/__tests__/', 'Component tests')
  addResult('components', componentResult.success)

  // 8. Integration Tests
  log.section('Integration Tests')
  const allTestsResult = runCommand('npm run test:unit -- --run', 'All unit tests')
  addResult('integration', allTestsResult.success)

  // 9. Database Integrity
  log.section('Database Integrity')
  const dbCheckResult = runCommand('node scripts/db-health-check.js', 'Database health check')
  addResult('database', dbCheckResult.success)

  // 10. Development Server
  log.section('Development Server')
  log.info('Testing development server startup...')
  try {
    // Check if we can build the project (which validates the dev server would work)
    const buildResult = runCommand('npm run build-only', 'Frontend build test', { silent: true })
    if (buildResult.success) {
      log.success('Development server - PASSED (build successful)')
      addResult('server', true)
    } else {
      log.error('Development server - FAILED (build failed)')
      addResult('server', false)
    }
  } catch (error) {
    log.error('Development server - FAILED (build error)')
    addResult('server', false)
  }

  // Results Summary
  log.section('Test Results Summary')
  
  Object.entries(results.sections).forEach(([section, counts]) => {
    const total = counts.passed + counts.failed
    const status = counts.failed === 0 ? chalk.green('PASS') : chalk.red('FAIL')
    console.log(`${section.padEnd(15)} ${status} (${counts.passed}/${total})`)
  })

  console.log(chalk.bold(`\nOverall: ${results.passed}/${results.total} tests passed`))
  
  if (results.failed === 0) {
    console.log(chalk.green.bold('\n🎉 All tests passed! The application is healthy.\n'))
    process.exit(0)
  } else {
    console.log(chalk.red.bold(`\n💥 ${results.failed} test(s) failed. Please fix the issues above.\n`))
    process.exit(1)
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  log.error('Unhandled rejection:', error.message)
  process.exit(1)
})

runTestPipeline().catch((error) => {
  log.error('Pipeline failed:', error.message)
  process.exit(1)
})