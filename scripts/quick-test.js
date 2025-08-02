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

const runCommand = (command, description) => {
  try {
    log.info(`Running: ${description}`)
    execSync(command, { stdio: 'inherit' })
    log.success(`${description} - PASSED`)
    return true
  } catch (error) {
    log.error(`${description} - FAILED`)
    return false
  }
}

async function quickTest() {
  console.log(chalk.bold.blue('\n⚡ LingoLab Quick Test\n'))
  
  const results = []

  // Essential tests only
  log.section('Quick Health Check')
  
  results.push(runCommand('npm run lint', 'Code quality check'))
  results.push(runCommand('npm run test:unit -- --run', 'All unit tests'))
  results.push(runCommand('node scripts/db-health-check.js', 'Database health'))

  const failed = results.filter(r => !r).length
  const total = results.length

  console.log(chalk.bold(`\nQuick Test: ${total - failed}/${total} checks passed`))
  
  if (failed === 0) {
    console.log(chalk.green.bold('\n⚡ Quick test passed! Core functionality is working.\n'))
    process.exit(0)
  } else {
    console.log(chalk.red.bold(`\n💥 ${failed} check(s) failed.\n`))
    process.exit(1)
  }
}

quickTest().catch((error) => {
  log.error('Quick test failed:', error.message)
  process.exit(1)
})