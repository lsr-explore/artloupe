import type { NextRequest } from "next/server";
import { expect, vi } from "vitest";
// Mock logger to prevent actual logging during tests
export const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  withContext: vi.fn().mockReturnThis(),
};

// Mock the logger module
vi.mock("@artloupe/logger", () => ({
  logger: mockLogger,
  withLogging: (handler: (request: NextRequest) => Promise<Response>) =>
    handler,
}));

// Helper function to create a proper mock NextRequest with headers
export const createMockRequest = (
  url: string,
  headers?: Record<string, string>,
  method: string = "GET",
): NextRequest => {
  const mockHeaders = new Map<string, string>();

  // Add default headers
  mockHeaders.set("user-agent", "test-user-agent");
  mockHeaders.set("content-type", "application/json");

  // Add custom headers if provided
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      mockHeaders.set(key, value);
    }
  }

  return {
    url,
    method,
    headers: {
      get: (name: string) => mockHeaders.get(name) || undefined,
      has: (name: string) => mockHeaders.has(name),
      set: (name: string, value: string) => mockHeaders.set(name, value),
      append: (name: string, value: string) => mockHeaders.set(name, value),
      delete: (name: string) => mockHeaders.delete(name),
      forEach: (callback: (value: string, key: string) => void) => {
        for (const [key, value] of mockHeaders.entries()) {
          callback(value, key);
        }
      },
      entries: () => mockHeaders.entries(),
      keys: () => mockHeaders.keys(),
      values: () => mockHeaders.values(),
    },
  } as unknown as NextRequest;
};

// Helper function to create a mock request for POST endpoints
export const createMockPostRequest = (
  body: Record<string, unknown>,
  headers?: Record<string, string>,
): NextRequest => {
  const mockRequest = createMockRequest(
    "http://localhost/api/test",
    headers,
    "POST",
  );

  // Add json method for POST requests
  (mockRequest as Partial<NextRequest>).json = vi.fn().mockResolvedValue(body);

  return mockRequest;
};

// Helper function to create a mock request for GET endpoints with query parameters
export const createMockGetRequest = (
  url: string,
  headers?: Record<string, string>,
): NextRequest => {
  return createMockRequest(url, headers);
};

// Reset all mocks before each test
export const resetMocks = () => {
  vi.clearAllMocks();
  mockLogger.info.mockClear();
  mockLogger.warn.mockClear();
  mockLogger.error.mockClear();
  mockLogger.debug.mockClear();
  mockLogger.withContext.mockClear();
};

export const extractJsonFromResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const expectSuccessResponse = (response: Response) => {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
};

export const expectErrorResponse = (response: Response) => {
  expect(response.status).toBeGreaterThanOrEqual(400);
};
