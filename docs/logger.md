# @artloupe/logger

A comprehensive logging package for the artloupe monorepo using Pino.

## Features

- **Structured Logging**: Uses Pino for high-performance structured logging
- **Context Support**: Add request-specific context to logs
- **Pretty Printing**: Development-friendly pretty printing with colors
- **HTTP Middleware**: Built-in HTTP request/response logging
- **Client Logging**: Endpoint to receive logs from client-side applications
- **TypeScript Support**: Full TypeScript support with proper types

## Installation

The package is already included in the workspace. To use it in your package:

```json
{
  "dependencies": {
    "@artloupe/logger": "workspace:*"
  }
}
```

## Basic Usage

### Server-side Logging

```typescript
import { logger, createLogger } from '@artloupe/logger';

// Use the default logger
logger.info('Application started');
logger.warn('Deprecated feature used');
logger.error('Something went wrong', { error: 'details' });

// Create a custom logger
const customLogger = createLogger({
  level: 'debug',
  name: 'my-service',
  pretty: true
});

// Add context to logs
const requestLogger = logger.withContext({
  requestId: 'abc-123',
  userId: 'user-456',
  endpoint: '/api/users'
});

requestLogger.info('User request processed', { userId: 'user-456' });
```

### HTTP Request Logging

```typescript
import { withLogging } from '@artloupe/logger';

// Wrap your API route handler
export const handler = withLogging(async (request) => {
  // Your handler logic here
  return new Response('OK');
}, {
  logRequest: true,
  logResponse: true,
  logErrors: true
});
```

### Client-side Logging

```typescript
import { logClientEvent } from '@artloupe/logger';

// Log from client-side
await logClientEvent('/api/log', {
  level: 'info',
  message: 'User clicked button',
  context: {
    component: 'SearchButton',
    userId: 'user-123'
  }
});
```

## Configuration

The logger can be configured through environment variables:

- `LOG_LEVEL`: Set the log level (default: 'info')
- `APP_NAME`: Set the application name (default: 'artloupe')
- `ENABLE_PRETTY_LOGS`: Set to 'true' to enable pretty printing (disabled by default to avoid worker issues)

## Troubleshooting

The logger is configured to avoid common worker exit issues by:

1. **Disabling pretty printing by default** - This prevents Pino worker process issues in development
2. **Only enabling pretty printing when explicitly requested** - Set `ENABLE_PRETTY_LOGS=true` if you want pretty output
3. **Graceful fallback** - If pretty printing fails, it falls back to basic logging

If you still encounter issues, you can:
- Ensure `ENABLE_PRETTY_LOGS` is not set to 'true'
- Check that you're not in a worker environment (Next.js runtime, etc.)
- Use basic logging format which is more reliable in all environments


### Custom Configuration

```typescript
import { createLogger } from '@artloupe/logger';

const logger = createLogger({
  level: 'debug',
  name: 'my-service',
  pretty: true,
  redact: ['password', 'token', 'secret'],
  serializers: {
    custom: (value) => ({ custom: value })
  }
});
```

## API Reference

### `logger`

Default logger instance with standard configuration.

### `createLogger(config?)`

Creates a new logger instance with custom configuration.

**Parameters:**
- `config` (optional): Logger configuration object

**Returns:** Logger instance

### `withLogging(handler, options?)`

Wraps a Next.js API route handler with automatic request/response logging.

**Parameters:**
- `handler`: The API route handler function
- `options` (optional): Logging options
  - `logRequest`: Whether to log incoming requests (default: true)
  - `logResponse`: Whether to log responses (default: true)
  - `logErrors`: Whether to log errors (default: true)

**Returns:** Wrapped handler function

### `logClientEvent(endpoint, payload)`

Sends a log entry to a server endpoint from client-side code.

**Parameters:**
- `endpoint`: The logging endpoint URL
- `payload`: Log payload object
  - `level`: Log level ('info' | 'warn' | 'error' | 'debug')
  - `message`: Log message
  - `context` (optional): Additional context data

**Returns:** Promise with response

## Log Levels

- `fatal`: System is unusable
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug-level messages
- `trace`: Trace-level messages

## Context and Structured Logging

The logger supports structured logging with context:

```typescript
const logger = logger.withContext({
  requestId: 'req-123',
  userId: 'user-456',
  sessionId: 'sess-789'
});

logger.info({ action: 'search', query: 'art' }, 'User performed search');
```

This produces structured JSON logs that are easy to parse and analyze.

## HTTP Endpoints

Both the main and admin apps include `/api/log` endpoints for receiving client-side logs:

- `POST /api/log`: Accepts client log entries
- `GET /api/log`: Health check endpoint

### Example Client Usage

```typescript
// In your client-side code
const logToServer = async (level: string, message: string, context?: object) => {
  try {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        context,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      console.error('Failed to log to server');
    }
  } catch (error) {
    console.error('Error logging to server:', error);
  }
};

// Usage
logToServer('info', 'User clicked search button', { 
  component: 'SearchBar',
  query: 'landscape'
});
```

## Best Practices

1. **Use Context**: Add relevant context to logs for better debugging
2. **Structured Data**: Pass objects instead of concatenated strings
3. **Appropriate Levels**: Use the right log level for each message
4. **Error Handling**: Always include error details in error logs
5. **Performance**: Logger is designed to be fast, but avoid excessive logging in production

## Development

To work on the logger package:

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Watch mode for development
pnpm dev
``` 