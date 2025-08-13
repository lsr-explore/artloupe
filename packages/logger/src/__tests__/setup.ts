import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Setup default fetch mock
mockFetch.mockResolvedValue({
  ok: true,
  json: async () => ({ result: 'AI analysis result' }),
});

process.env.USE_LOCAL_AI = 'true';
