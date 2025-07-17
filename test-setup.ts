import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.USE_LOCAL_AI = "true";
