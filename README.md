# LingoLab

A comprehensive web-based language learning application built with Vue.js, TypeScript, and Tailwind CSS.

## Features

- **Multi-Language Support**: Learn multiple languages with one active language at a time
- **Rich Word Attributes**: Language-specific features (German articles, verb conjugations, etc.)
- **Spaced Repetition**: SM-2 algorithm for efficient vocabulary memorization
- **User Favorites**: Bookmark words with personal notes and mnemonics
- **Custom Training Sets**: Create and manage personalized word collections
- **Contextual Translations**: Multiple translations with usage contexts
- **Progress Tracking**: Comprehensive learning analytics and statistics
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API, TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Testing Library
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:generate` - Generate Prisma client

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── layout/         # Layout components
│   └── __tests__/      # Component tests
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # Database and business logic services
├── types/              # TypeScript type definitions
├── router/             # Vue Router configuration
├── generated/          # Generated Prisma client
└── assets/             # Static assets and styles

prisma/
├── schema.prisma       # Database schema definition
├── migrations/         # Database migration files
└── seed.js            # Database seeding script

docs/
└── SCHEMA.md          # Database schema documentation
```

## Documentation

- [Database Schema](docs/SCHEMA.md) - Detailed explanation of the database structure and relationships

## Development

This project follows Vue.js best practices and uses TypeScript for type safety. The database uses Prisma ORM with SQLite for development and is designed to support multiple languages with rich vocabulary attributes.

### Database Features
- Multi-language vocabulary learning system
- Spaced repetition progress tracking
- User favorites with personal notes
- Flexible training sets with custom word ordering
- Rich word attributes (articles, genders, conjugations)
- Contextual translations

## License

This project is licensed under the MIT License.