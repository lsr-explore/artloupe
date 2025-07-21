import { mockPhotoWorks } from "@artloupe/mock-data";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchPhotoWorks } from "../use-fetch-photo-works";
import { renderHookWithQueryClient } from "./test-utilities";

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe("useFetchPhotoWorks", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("should fetch photo works successfully", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() =>
      useFetchPhotoWorks("city street"),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.images).toHaveLength(mockPhotoWorks.length);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch when query is empty", () => {
    const { result } = renderHookWithQueryClient(() => useFetchPhotoWorks(""));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle different search terms", async () => {
    const queries = ["nature", "urban", "landscape"];

    for (const query of queries) {
      // Mock successful response for each query
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
      } as unknown as Response);

      const { result } = renderHookWithQueryClient(() =>
        useFetchPhotoWorks(query),
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.images).toBeDefined();
    }
  });

  it("should be enabled by default", () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ images: mockPhotoWorks }),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() =>
      useFetchPhotoWorks("test"),
    );

    expect(result.current.isPending).toBe(true);
  });

  it("should respect enabled parameter", () => {
    const { result } = renderHookWithQueryClient(() =>
      useFetchPhotoWorks("test", false),
    );

    expect(result.current.isLoading).toBe(false);
  });
});
