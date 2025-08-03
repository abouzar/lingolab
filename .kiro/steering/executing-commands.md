---
inclusion: always
---

# Command Execution Guidelines

## Shell Command Rules
- **Long-running processes**: Always use tmux detached sessions for servers and background processes
- **Process management**: Remember to kill and cleanup tmux sessions when done
- **Service readiness**: Use health checks or process verification instead of arbitrary sleep delays
- Execute commands directly using the `executeBash` tool
- Avoid blocking commands (`| head`, `| less`, interactive prompts)
- Always check if dev servers are running before starting new ones

## Tmux Session Management
- Start detached session: `tmux new-session -d -s session_name 'command'`
- List sessions: `tmux list-sessions`
- Kill session: `tmux kill-session -t session_name`
- Check if session exists: `tmux has-session -t session_name 2>/dev/null`

## Service Readiness Checks
- **HTTP services**: Use `curl` with retry logic to check endpoints
- **Process verification**: Check if process is running with `pgrep` or `ps`
- **Port availability**: Use `lsof -i :PORT` to verify port binding
- **File-based checks**: Wait for log files or pid files to appear

## Development Server Commands
- `npm run dev:full` - Start both frontend (port 5173) and backend (port 3000)
- `npm run dev:server` - Backend only for API development/testing
- `npm run dev` - Frontend only for UI development
- Always terminate existing dev servers before starting new ones

## Database Workflow (Execute in Sequence)
1. `npm run db:generate` - Regenerate Prisma client after schema changes
2. `npm run db:migrate` - Apply database migrations
3. `npm run db:seed` - Populate with sample data
4. `npm run db:studio` - Open Prisma Studio for database inspection

## Testing Strategy
- `npm run test:quick` - Fast essential checks during development
- `npm run test:pre-commit` - Validation before commits
- `npm run test:pipeline` - Full comprehensive test suite
- `npx vitest run <file>` - Run specific test files

## Build Commands
- `npm run build` - Build frontend for production (outputs to `dist/`)
- `npm run server:build` - Compile TypeScript server code
- `npm run preview` - Preview production build locally
- `npm run server:start` - Start production server

## Code Quality Tools
- `npm run lint` - ESLint with auto-fix enabled
- `npm run format` - Prettier code formatting

## Troubleshooting Common Issues
- **Prisma client errors**: Run `npm run db:generate` to regenerate client
- **TypeScript compilation errors**: Check `tsconfig.json` configurations in root and `server/`
- **Dependency conflicts**: Clean install with `rm -rf node_modules package-lock.json && npm install`
- **Port conflicts**: Kill processes using `lsof -ti:5173` (frontend) or `lsof -ti:3001` (backend)
- **Database schema issues**: Follow database workflow sequence above
- **Dev server issues**: Terminate existing servers before starting new ones

## Command Execution Best Practices
- Run database operations in sequence when making schema changes
- Use `test:quick` during development, `test:pipeline` for comprehensive validation
- Always run linting and formatting before commits
- Monitor long-running processes and terminate if unresponsive