import pino from 'pino';
import type { LogContext, LoggerConfig } from './types';

class LoggerImpl {
  private pinoLogger: pino.Logger;
  private context: LogContext = {};

  constructor(config: LoggerConfig = {}) {
    const {
      level = process.env.LOG_LEVEL || 'info',
      name = process.env.APP_NAME || 'artloupe',
      pretty = false, // Disable pretty printing by default to avoid worker issues
      redact = ['password', 'token', 'secret', 'key'],
      serializers = {},
    } = config;

    const pinoConfig: pino.LoggerOptions = {
      level,
      name,
      redact,
      serializers: {
        ...pino.stdSerializers,
        ...serializers,
      },
    };

    // Only enable pretty printing if explicitly requested and in a safe environment
    if (
      pretty &&
      process.env.ENABLE_PRETTY_LOGS === 'true' &&
      globalThis.window === undefined &&
      !process.env.NEXT_RUNTIME
    ) {
      try {
        pinoConfig.transport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        };
      } catch (error) {
        console.warn(
          'Pretty printing failed, falling back to basic logging:',
          error,
        );
      }
    }

    this.pinoLogger = pino(pinoConfig);
  }

  withContext(context: LogContext): LoggerImpl {
    const newLogger = new LoggerImpl();
    newLogger.pinoLogger = this.pinoLogger;
    newLogger.context = { ...this.context, ...context };
    return newLogger;
  }

  // Implement Pino Logger interface methods
  fatal(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.fatal(object, message, ...arguments_);
  }

  error(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.error(object, message, ...arguments_);
  }

  warn(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.warn(object, message, ...arguments_);
  }

  info(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.info(object, message, ...arguments_);
  }

  debug(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.debug(object, message, ...arguments_);
  }

  trace(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.trace(object, message, ...arguments_);
  }

  silent(object: unknown, message?: string, ...arguments_: unknown[]): void {
    this.pinoLogger.silent(object, message, ...arguments_);
  }

  // Additional convenience methods
  logWithContext(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    data?: unknown,
  ): void {
    const logData = {
      ...this.context,
      ...(data && typeof data === 'object' ? data : { data }),
    };

    switch (level) {
      case 'info': {
        this.info(logData, message);
        break;
      }
      case 'warn': {
        this.warn(logData, message);
        break;
      }
      case 'error': {
        this.error(logData, message);
        break;
      }
      case 'debug': {
        this.debug(logData, message);
        break;
      }
    }
  }

  // Pino Logger interface properties
  get level(): string {
    return this.pinoLogger.level;
  }

  set level(level: string) {
    this.pinoLogger.level = level;
  }

  get levels(): pino.LevelMapping {
    return this.pinoLogger.levels;
  }

  get isLevelEnabled(): (level: string) => boolean {
    return this.pinoLogger.isLevelEnabled;
  }

  get child(): (bindings: pino.Bindings) => pino.Logger {
    return this.pinoLogger.child;
  }

  get bindings(): pino.Bindings {
    return this.pinoLogger.bindings;
  }

  get flush(): () => void {
    return this.pinoLogger.flush;
  }
}

// Create default logger instance
export const logger = new LoggerImpl();

// Factory function to create new logger instances
export function createLogger(config?: LoggerConfig): LoggerImpl {
  return new LoggerImpl(config);
}

// Export the LoggerImpl class for advanced usage
export { LoggerImpl };
