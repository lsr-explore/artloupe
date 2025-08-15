import { mockPhotoWorks } from '@artloupe/mock-data';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPhotoWorks } from './fetch-photo-works';

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe('fetchPhotoWorks', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should fetch photo works successfully', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
    } as unknown as Response);

    const result = await fetchPhotoWorks('city street');

    expect(result).toBeDefined();
    expect(result.images).toHaveLength(mockPhotoWorks.length);
    expect(result.images[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      photographer: expect.any(String),
      url: expect.any(String),
    });
  });

  it('should handle different search queries', async () => {
    const queries = ['nature', 'urban', 'landscape'];

    for (const query of queries) {
      // Mock successful response for each query
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
      } as unknown as Response);

      const result = await fetchPhotoWorks(query);
      expect(result).toBeDefined();
      expect(Array.isArray(result.images)).toBe(true);
    }
  });

  it('should throw error for empty query', async () => {
    await expect(fetchPhotoWorks('')).rejects.toThrow();
  });

  it('should include required photo properties', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
    } as unknown as Response);

    const result = await fetchPhotoWorks('test');

    if (result.images.length > 0) {
      const photo = result.images[0];
      expect(photo).toHaveProperty('id');
      expect(photo).toHaveProperty('url');
      expect(photo).toHaveProperty('photographer');
    }
  });

  it('should throw error when fetch fails', async () => {
    // Mock failed response
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as unknown as Response);

    await expect(fetchPhotoWorks('test')).rejects.toThrow(
      'Failed to fetch artworks',
    );
  });
});
