import { mockDetectionResult } from "@artloupe/mock-data";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDetectObjects } from "../use-object-detection";
import { renderHookWithQueryClient } from "./test-utilities";

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe("useObjectDetection", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("should detect objects successfully", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useDetectObjects());

    const mockImageData = new ArrayBuffer(8);

    result.current.mutate(mockImageData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDetectionResult.objects);
    expect(result.current.error).toBeNull();
  });

  it("should handle detection errors", async () => {
    const { result } = renderHookWithQueryClient(() => useDetectObjects());

    const emptyData = new ArrayBuffer(0);

    result.current.mutate(emptyData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("should return valid detection results", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useDetectObjects());

    const mockImageData = new ArrayBuffer(8);

    result.current.mutate(mockImageData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const detections = result.current.data;
    expect(Array.isArray(detections)).toBe(true);

    if (detections && detections.length > 0) {
      const detection = detections[0];
      expect(detection).toHaveProperty("label");
      expect(detection).toHaveProperty("score");
      expect(detection).toHaveProperty("box");
      expect(typeof detection.score).toBe("number");
      expect(detection.score).toBeGreaterThanOrEqual(0);
      expect(detection.score).toBeLessThanOrEqual(1);
    }
  });

  it("should support multiple detections", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useDetectObjects());

    const mockImageData = new ArrayBuffer(8);

    const mutatePromise = result.current.mutateAsync(mockImageData);

    await expect(mutatePromise).resolves.toEqual(mockDetectionResult.objects);
  });

  it("should reset mutation state", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const { result } = renderHookWithQueryClient(() => useDetectObjects());

    const mockImageData = new ArrayBuffer(8);

    result.current.mutate(mockImageData);

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
});
