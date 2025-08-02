#!/usr/bin/env node
/* eslint-disable no-undef */

import { execSync } from 'child_process'
import chalk from 'chalk'

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  section: (msg) => console.log(chalk.cyan.bold(`\n=== ${msg} ===`))
}

const runCommand = (command, description, options = {}) => {
  try {
    log.info(`Running: ${description}`)
    execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    })
    log.success(`${description} - PASSED`)
    return true
  } catch (error) {
    log.error(`${description} - FAILED`)
    if (!options.silent) {
      console.error(error.message)
    }
    return false
  }
}

async function preCommitTest() {
  console.log(chalk.bold.blue('\n🔍 Pre-Commit Test Pipeline\n'))
  
  const results = []

  // Pre-commit essentials
  log.section('Code Quality')
  results.push(runCommand('npm run lint', 'ESLint check'))
  results.push(runCommand('npm run format', 'Code formatting'))

  log.section('Build & Test')
  results.push(runCommand('npm run build-only', 'Build check'))
  results.push(runCommand('npm run test:unit -- --run', 'Unit tests'))

  log.section('Database')
  results.push(runCommand('npx prisma generate', 'Prisma client generation'))

  const failed = results.filter(r => !r).length
  const total = results.length

  console.log(chalk.bold(`\nPre-commit: ${total - failed}/${total} checks passed`))
  
  if (failed === 0) {
    console.log(chalk.green.bold('\n✅ Ready to commit! All pre-commit checks passed.\n'))
    process.exit(0)
  } else {
    console.log(chalk.red.bold(`\n❌ ${failed} check(s) failed. Fix issues before committing.\n`))
    process.exit(1)
  }
}

preCommitTest().catch((error) => {
  log.error('Pre-commit test failed:', error.message)
  process.exit(1)
})