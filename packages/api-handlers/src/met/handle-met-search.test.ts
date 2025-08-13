import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleMetSearch } from './handle-met-search';

// Mock NextRequest
const mockRequest = (url: string) =>
  ({
    url,
  }) as any;

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('handleMetSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error when query param is missing', async () => {
    const request = mockRequest('http://localhost/api/met');
    const response = await handleMetSearch(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Missing query param `q`' });
  });

  it('should return mock data when USE_MOCK_MET_API is true', async () => {
    process.env.USE_MOCK_MET_API = 'true';

    const request = mockRequest('http://localhost/api/met?q=painting');
    const response = await handleMetSearch(request);
    const data = await response.json();

    expect(data.mock).toBe(true);
    expect(data.total).toBe(1);
    expect(data.images).toBeDefined();
  });

  it('should handle basic functionality with valid query', async () => {
    const originalValue = process.env.USE_MOCK_MET_API;
    process.env.USE_MOCK_MET_API = 'false';
    process.env.MET_API_BASE_URL =
      'https://collectionapi.metmuseum.org/public/collection/v1';

    const mockSearchResponse = {
      objectIDs: [1, 2, 3],
    };

    const mockObjectResponse = {
      objectID: 1,
      title: 'Test Artwork',
      artistDisplayName: 'Test Artist',
      primaryImageSmall: 'https://example.com/image.jpg',
      objectDate: '1850',
    };

    mockFetch
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSearchResponse),
      })
      .mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockObjectResponse),
      });

    const request = mockRequest('http://localhost/api/met?q=painting');
    const response = await handleMetSearch(request);

    expect(response).toBeInstanceOf(Response);

    process.env.USE_MOCK_MET_API = originalValue;
  });

  it('should handle environment configuration correctly', async () => {
    const originalValue = process.env.USE_MOCK_MET_API;
    process.env.USE_MOCK_MET_API = 'false';
    process.env.MET_API_BASE_URL =
      'https://collectionapi.metmuseum.org/public/collection/v1';

    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ objectIDs: [] }),
    });

    const request = mockRequest('http://localhost/api/met?q=test');
    const response = await handleMetSearch(request);

    expect(response).toBeInstanceOf(Response);

    process.env.USE_MOCK_MET_API = originalValue;
  });

  it('should handle errors gracefully', async () => {
    const originalValue = process.env.USE_MOCK_MET_API;
    process.env.USE_MOCK_MET_API = 'false';

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const request = mockRequest('http://localhost/api/met?q=painting');
    const response = await handleMetSearch(request);

    expect(response).toBeInstanceOf(Response);

    process.env.USE_MOCK_MET_API = originalValue;
  });
});
