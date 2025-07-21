import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
Object.defineProperty(globalThis, "fetch", {
  value: mockFetch,
  writable: true,
});

// Setup default fetch mock
mockFetch.mockResolvedValue({
  ok: true,
  json: async () => ({ result: "AI analysis result" }),
});
