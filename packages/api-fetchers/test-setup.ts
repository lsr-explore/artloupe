import { vi } from "vitest";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.USE_LOCAL_AI = "true";

// Mock fetch globally for all tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);
