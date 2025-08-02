# LingoLab

A comprehensive web-based language learning application built with Vue.js, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Chat**: Practice conversational skills with AI assistance
- **Spaced Repetition**: Efficient vocabulary memorization using proven algorithms
- **Flashcards**: Interactive vocabulary practice
- **Custom Training Sets**: Create and manage personalized word lists
- **Progress Tracking**: Comprehensive learning analytics
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API, TypeScript
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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── layout/         # Layout components
│   └── __tests__/      # Component tests
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── router/             # Vue Router configuration
└── assets/             # Static assets and styles
```

## Development

This project follows Vue.js best practices and uses TypeScript for type safety. The codebase is organized in a modular structure to support easy extension and maintenance.

## License

This project is licensed under the MIT License.