# LingoLab Testing Guide

## Overview

LingoLab includes a comprehensive test pipeline to ensure code quality, functionality, and database integrity across all aspects of the application.

## Test Scripts

### `npm run test:pipeline`
**Full comprehensive test pipeline** - Runs all tests and checks
- Environment validation
- Dependency checks
- Code quality (ESLint)
- TypeScript compilation & build
- Database tests
- Business logic tests
- Component tests
- Integration tests
- Database integrity checks
- Development server validation

**Use when**: Before major releases, after significant changes, or for complete validation.

### `npm run test:quick`
**Fast essential checks** - Core functionality validation
- Code quality check
- All unit tests
- Database health check

**Use when**: After small changes, during development, or for quick validation.

### `npm run test:pre-commit`
**Pre-commit validation** - Essential checks before committing
- ESLint check
- Code formatting
- Build validation
- Unit tests
- Prisma client generation

**Use when**: Before committing code to ensure quality standards.

### `npm run test:db-health`
**Database-only validation** - Comprehensive database checks
- Connection test
- Schema validation
- Table existence verification
- Seed data integrity
- Relationship validation
- Word data structure verification

**Use when**: After database changes, migrations, or seeding.

## Test Categories

### 1. Environment Tests
- Package.json exists
- Prisma schema exists
- Environment file exists
- Prisma client generated

### 2. Code Quality Tests
- ESLint validation
- Code formatting
- TypeScript compilation

### 3. Database Tests
- Connection and schema validation
- All 11 required tables exist
- Seed data integrity (languages, users, words, training sets)
- Relationship validation (user-language, word-translation, etc.)
- Rich word attributes (translations, attributes, examples)

### 4. Business Logic Tests
- Spaced repetition algorithm (SM-2)
- Quality scoring based on response time
- Progress calculation and statistics
- Review scheduling

### 5. Component Tests
- Vue component rendering
- Navigation functionality
- Layout components

### 6. Integration Tests
- All unit tests combined
- Cross-service functionality

### 7. Server Tests
- Development server startup
- HTTP response validation

## Database Health Checks

The database health check validates:

```
✓ Database connection - OK
✓ Database schema - OK
✓ Table 'languages' - OK
✓ Table 'users' - OK
✓ Table 'user_languages' - OK
✓ Table 'words' - OK
✓ Table 'word_translations' - OK
✓ Table 'word_attributes' - OK
✓ Table 'examples' - OK
✓ Table 'training_sets' - OK
✓ Table 'training_set_words' - OK
✓ Table 'user_favorite_words' - OK
✓ Table 'word_progress' - OK
✓ Seed data integrity - OK
✓ Database relationships - OK
✓ Word data structure - OK
```

## Test Results

All test scripts provide:
- **Color-coded output** (green ✓ for pass, red ✗ for fail)
- **Section-based organization** for easy debugging
- **Summary statistics** showing pass/fail counts
- **Exit codes** (0 for success, 1 for failure) for CI/CD integration

## Usage Examples

```bash
# Quick check during development
npm run test:quick

# Before committing changes
npm run test:pre-commit

# Full validation before release
npm run test:pipeline

# Database-specific issues
npm run test:db-health
```

## CI/CD Integration

All test scripts return appropriate exit codes:
- **Exit 0**: All tests passed
- **Exit 1**: One or more tests failed

This makes them suitable for CI/CD pipelines, pre-commit hooks, and automated testing workflows.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure `.env` file exists with `DATABASE_URL`
   - Run `npm run db:migrate` to apply migrations
   - Run `npm run db:seed` to populate data

2. **Missing Prisma Client**
   - Run `npm run db:generate` to generate client
   - Check that `src/generated/prisma` directory exists

3. **ESLint Errors**
   - Run `npm run lint` to auto-fix issues
   - Check for syntax errors in code

4. **Build Failures**
   - Check TypeScript errors
   - Ensure all dependencies are installed

### Test-Specific Debugging

- **Database tests failing**: Check seed data and table structure
- **Component tests failing**: Verify Vue component syntax and imports
- **Server tests failing**: Ensure no other processes are using port 5173

## Adding New Tests

When adding new functionality:

1. **Unit tests**: Add to appropriate `__tests__` directory
2. **Database changes**: Update `db-health-check.js` if needed
3. **New components**: Add component tests
4. **New services**: Add service tests with database integration

The test pipeline will automatically include new tests in the appropriate categories.