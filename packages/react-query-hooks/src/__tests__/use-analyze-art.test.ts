import { mockAnalysisResult, mockArtwork } from '@artloupe/mock-data';
import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalyzeArt } from '../use-analyze-art';
import { renderHookWithQueryClient } from './test-utilities';

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe('useAnalyzeArt', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should analyze artwork successfully', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockAnalysisResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useAnalyzeArt());

    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(true);

    // Trigger the mutation
    result.current.mutate(mockArtwork);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.result).toBe(mockAnalysisResult.result);
    expect(result.current.error).toBeNull();
  });

  it('should handle mutation errors', async () => {
    const { result } = renderHookWithQueryClient(() => useAnalyzeArt());

    const invalidArtwork = {
      id: '',
      title: '',
      artist: '',
    };

    result.current.mutate(invalidArtwork as never);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should reset mutation state', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockAnalysisResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useAnalyzeArt());

    result.current.mutate(mockArtwork);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should support async mutation', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockAnalysisResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useAnalyzeArt());

    const mutatePromise = result.current.mutateAsync(mockArtwork);

    await expect(mutatePromise).resolves.toEqual(mockAnalysisResult);
  });

  it('should track loading state correctly', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockAnalysisResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useAnalyzeArt());

    expect(result.current.isPending).toBe(false);

    result.current.mutate(mockArtwork);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
