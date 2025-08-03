# Technology Stack & Build System

## Frontend Stack
- **Vue.js 3** with Composition API and TypeScript
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Tailwind CSS** for styling with custom color palette
- **Vite** as build tool and dev server

## Backend Stack
- **Express.js** with TypeScript
- **Prisma ORM** with SQLite database
- **Zod** for validation schemas
- **Helmet** for security middleware
- **CORS** configured for development and production

## Development Tools
- **TypeScript** for type safety across frontend and backend
- **ESLint** with Vue 3 and TypeScript configurations
- **Prettier** for code formatting
- **Vitest** for unit testing with jsdom environment
- **Vue Testing Library** for component testing

## Common Commands

### Development
```bash
npm run dev              # Start frontend dev server (port 5173)
npm run dev:server       # Start backend dev server with watch mode
npm run dev:full         # Start both frontend and backend concurrently
```

### Database Operations
```bash
npm run db:migrate       # Run Prisma migrations
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio GUI
```

### Testing & Quality
```bash
npm run test:unit        # Run unit tests with Vitest
npm run test:pipeline    # Full comprehensive test suite
npm run test:quick       # Fast essential checks for development
npm run test:pre-commit  # Pre-commit validation
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting
```

### Build & Deploy
```bash
npm run build            # Build frontend for production
npm run server:build     # Compile TypeScript server
npm run server:start     # Start production server
npm run preview          # Preview production build
```

## Key Configurations
- **Path alias**: `@` maps to `./src`
- **Prisma client**: Generated to `src/generated/prisma`
- **API base URL**: Configurable via `VITE_API_BASE_URL`
- **Database**: SQLite with `DATABASE_URL` environment variable