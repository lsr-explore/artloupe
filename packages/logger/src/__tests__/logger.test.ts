import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, createLogger } from '../logger';

// Mock console methods to capture output
const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
	debug: vi.fn(),
};

beforeEach(() => {
	vi.clearAllMocks();
	// Mock console methods
	Object.assign(console, mockConsole);
});

describe('Logger', () => {
	it('should create a default logger instance', () => {
		expect(logger).toBeDefined();
		expect(typeof logger.info).toBe('function');
		expect(typeof logger.error).toBe('function');
		expect(typeof logger.warn).toBe('function');
		expect(typeof logger.debug).toBe('function');
	});

	it('should create a custom logger instance', () => {
		const customLogger = createLogger({
			level: 'debug',
			name: 'test-logger',
		});

		expect(customLogger).toBeDefined();
		expect(typeof customLogger.info).toBe('function');
	});

	it('should support context logging', () => {
		const contextLogger = logger.withContext({
			requestId: 'test-123',
			userId: 'user-456',
		});

		expect(contextLogger).toBeDefined();
		expect(contextLogger).not.toBe(logger);
	});

	it('should have logWithContext method', () => {
		expect(typeof logger.logWithContext).toBe('function');
	});

	it('should support all log levels', () => {
		expect(typeof logger.fatal).toBe('function');
		expect(typeof logger.error).toBe('function');
		expect(typeof logger.warn).toBe('function');
		expect(typeof logger.info).toBe('function');
		expect(typeof logger.debug).toBe('function');
		expect(typeof logger.trace).toBe('function');
		expect(typeof logger.silent).toBe('function');
	});
}); 