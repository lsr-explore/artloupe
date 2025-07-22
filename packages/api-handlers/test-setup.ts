import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.USE_LOCAL_AI = 'true';
