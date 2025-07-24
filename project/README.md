# Asmo's Memory Backend

Backend service for Asmo's Memory, a Notion Database Manager.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start the server:
```bash
npm start
```

## Development

Run with hot reload:
```bash
npm run dev
```

## Testing

This project includes a comprehensive testing setup using Jest and React Testing Library.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Component Tests**: Located in `src/components/__tests__/`
- **Hook Tests**: Located in `src/hooks/__tests__/`
- **Utility Tests**: Located in `src/lib/__tests__/`
- **Test Utilities**: Located in `src/test/`

### Testing Features

- Jest for test runner and assertions
- React Testing Library for component testing
- jsdom for DOM simulation
- Coverage reporting
- Mocked external dependencies (socket.io, js-cookie, react-hot-toast)

### Test Coverage

The test suite covers:
- ✅ PinAuth component (authentication form)
- ✅ useAuth hook (authentication logic)
- ✅ API functions (fetch operations)
- ✅ Test utilities and setup

### Writing Tests

Tests are co-located with their source files in `__tests__` directories. Use the test utilities in `src/test/utils.tsx` for consistent test setup with React Query providers and common mocks.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Netlify frontend URL
- `RATE_LIMIT_MAX`: Maximum requests per window
- `RATE_LIMIT_WINDOW`: Rate limit window in milliseconds