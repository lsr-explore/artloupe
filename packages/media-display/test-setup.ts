import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.USE_LOCAL_AI = "true";
