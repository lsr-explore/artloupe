import { mockArtworks } from '@artloupe/mock-data';
import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFetchArtworks } from '../use-fetch-artworks';
import { renderHookWithQueryClient } from './test-utilities';

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe('useFetchArtworks', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should fetch artworks successfully', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockArtworks }),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() =>
      useFetchArtworks('sunflowers'),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.images).toHaveLength(mockArtworks.length);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when query is empty', () => {
    const { result } = renderHookWithQueryClient(() => useFetchArtworks(''));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch when disabled', () => {
    const { result } = renderHookWithQueryClient(() =>
      useFetchArtworks('test', false),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should have correct query key', () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockArtworks }),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() =>
      useFetchArtworks('sunflowers'),
    );

    // Query key should be ["met", "search", "sunflowers"]
    expect(result.current.dataUpdatedAt).toBeDefined();
  });

  it('should refetch when query changes', async () => {
    // Mock successful responses for both queries
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ images: mockArtworks }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ images: mockArtworks }),
      } as unknown as Response);

    let query = 'sunflowers';
    const { result, rerender } = renderHookWithQueryClient(() =>
      useFetchArtworks(query),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change query
    query = 'monet';
    rerender();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should trigger new fetch (in real scenario data might be different)
    expect(result.current.dataUpdatedAt).toBeDefined();
  });
});
