// Example of how to use client-side logging in your React components

import { logClientEvent } from '../middleware';

// Utility function for client-side logging
export const clientLogger = {
  info: (message: string, context?: Record<string, unknown>) =>
    logClientEvent('/api/log', {
      level: 'info',
      message,
      context: context || {},
    }),

  warn: (message: string, context?: Record<string, unknown>) =>
    logClientEvent('/api/log', {
      level: 'warn',
      message,
      context: context || {},
    }),

  error: (message: string, context?: Record<string, unknown>) =>
    logClientEvent('/api/log', {
      level: 'error',
      message,
      context: context || {},
    }),

  debug: (message: string, context?: Record<string, unknown>) =>
    logClientEvent('/api/log', {
      level: 'debug',
      message,
      context: context || {},
    }),
};

// Example usage in a React component:
/*
import { clientLogger } from '@artloupe/logger/examples/client-logging';

function SearchComponent() {
	const handleSearch = async (query: string) => {
		try {
			// Log the search action
			await clientLogger.info('User performed search', {
				component: 'SearchComponent',
				query,
				timestamp: new Date().toISOString(),
			});

			// Perform search logic...
			const results = await searchAPI(query);

			// Log successful results
			await clientLogger.info('Search completed successfully', {
				component: 'SearchComponent',
				query,
				resultCount: results.length,
			});

		} catch (error) {
			// Log errors
			await clientLogger.error('Search failed', {
				component: 'SearchComponent',
				query,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	};

	return (
		<div>
			<input onChange={(e) => handleSearch(e.target.value)} />
		</div>
	);
}
*/

// Example of a more advanced logging utility with retry logic
export class AdvancedClientLogger {
  private endpoint: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(endpoint = '/api/log', retryAttempts = 3, retryDelay = 1000) {
    this.endpoint = endpoint;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  private async sendLog(
    level: string,
    message: string,
    context?: Record<string, unknown>,
  ) {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const result = await logClientEvent(this.endpoint, {
          level: level as 'info' | 'warn' | 'error' | 'debug',
          message,
          context: {
            ...context,
            attempt,
            retryAttempts: this.retryAttempts,
          },
        });

        if (result.success) {
          return result;
        }

        throw new Error(result.message);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.retryAttempts) {
          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * attempt),
          );
        }
      }
    }

    // If all retries failed, log to console as fallback
    console.error('Failed to send log to server after retries:', {
      level,
      message,
      context,
      error: lastError?.message,
    });

    throw lastError;
  }

  info = (message: string, context?: Record<string, unknown>) =>
    this.sendLog('info', message, context);

  warn = (message: string, context?: Record<string, unknown>) =>
    this.sendLog('warn', message, context);

  error = (message: string, context?: Record<string, unknown>) =>
    this.sendLog('error', message, context);

  debug = (message: string, context?: Record<string, unknown>) =>
    this.sendLog('debug', message, context);
}

// Export a default instance
export const advancedClientLogger = new AdvancedClientLogger();
