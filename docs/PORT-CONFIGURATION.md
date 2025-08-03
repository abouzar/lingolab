# Port Configuration - LingoLab

## Standardized Ports

After cleanup, LingoLab now uses a consistent port configuration:

### Development Ports
- **Frontend (Vite)**: `5173` - Fixed and enforced via `vite.config.ts`
- **Backend (Express)**: `3001` - Configurable via `PORT` environment variable

### Production Ports
- **Frontend**: Served as static files (no port needed)
- **Backend**: Configurable via `PORT` environment variable (defaults to 3001)

## Configuration Files

### Environment Variables (`.env`)
```bash
# Server Configuration
PORT=3001

# Frontend Configuration  
VITE_API_BASE_URL="http://localhost:3001/api"

# CORS Configuration
FRONTEND_URL="http://localhost:5173"
```

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true  // Fail if port is in use
  },
  preview: {
    port: 5173,
    strictPort: true
  }
})
```

### Server Configuration (`server/index.ts`)
```typescript
const PORT = process.env.PORT || 3001

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
}))
```

## Development Commands

### Start Both Servers
```bash
npm run dev:full    # Starts both frontend (5173) and backend (3001)
```

### Start Individual Servers
```bash
npm run dev         # Frontend only on port 5173
npm run dev:server  # Backend only on port 3001
```

### Port Conflict Resolution
```bash
# Kill processes using specific ports
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend

# Or use the steering guide commands
lsof -ti:5173  # Frontend conflicts
lsof -ti:3001  # Backend conflicts
```

## Removed Configurations

### Cleaned Up
- ❌ Multiple CORS origins (5174, 5175, 5176, 5177, 3000)
- ❌ Old test files with hardcoded ports
- ❌ Inconsistent port references in documentation

### Kept
- ✅ Single frontend port: 5173
- ✅ Single backend port: 3001
- ✅ Environment-based configuration
- ✅ Proper CORS setup

## Testing

The test pipeline uses the same ports but with proper cleanup:
- Tests run against the standardized ports
- No port conflicts during testing
- Consistent behavior across all test scenarios

## Benefits

1. **Consistency**: All configurations use the same ports
2. **Simplicity**: No confusion about which port to use
3. **Reliability**: Strict port enforcement prevents conflicts
4. **Maintainability**: Single source of truth for port configuration
5. **CORS Clarity**: Single origin configuration eliminates CORS issues