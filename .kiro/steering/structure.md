# Project Structure & Organization

## Root Directory Layout
```
├── src/                 # Frontend Vue.js application
├── server/              # Backend Express.js API
├── prisma/              # Database schema and migrations
├── docs/                # Project documentation
├── scripts/             # Build and test automation scripts
└── dist/                # Production build output
```

## Frontend Structure (`src/`)
```
src/
├── components/          # Reusable Vue components
│   ├── layout/         # Layout-specific components
│   ├── training-sets/  # Training set related components
│   └── __tests__/      # Component unit tests
├── views/              # Page-level Vue components (routes)
├── stores/             # Pinia state management stores
├── services/           # API clients and business logic
│   └── __tests__/      # Service unit tests
├── types/              # TypeScript type definitions
├── router/             # Vue Router configuration
├── generated/          # Auto-generated files (Prisma client)
├── assets/             # Static assets and global CSS
└── main.ts             # Application entry point
```

## Backend Structure (`server/`)
```
server/
├── routes/             # Express route handlers
├── services/           # Business logic and data access
├── middleware/         # Express middleware functions
├── types/              # Backend TypeScript types
├── index.ts            # Server entry point
└── tsconfig.json       # Backend TypeScript config
```

## Database Structure (`prisma/`)
```
prisma/
├── schema.prisma       # Database schema definition
├── migrations/         # Database migration files
├── seed.js             # Database seeding script
└── dev.db              # SQLite development database
```

## Architecture Patterns

### Frontend Conventions
- **Components**: Use PascalCase for component names
- **Composables**: Use `use` prefix for composition functions
- **Stores**: One store per domain (app, user, etc.)
- **Services**: Separate API clients from business logic
- **Types**: Centralized in `src/types/index.ts`

### Backend Conventions
- **Services**: Business logic separated from route handlers
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware
- **Database**: Prisma ORM with generated client

### File Naming
- **Vue components**: PascalCase (e.g., `TrainingSetList.vue`)
- **TypeScript files**: camelCase (e.g., `wordService.ts`)
- **Test files**: `*.spec.ts` or `*.test.ts`
- **Types**: Descriptive interfaces (e.g., `CreateWordInput`)

### Import Conventions
- Use `@/` alias for src imports
- Relative imports for same-directory files
- Absolute imports for cross-domain dependencies
- Group imports: external libraries, internal modules, types