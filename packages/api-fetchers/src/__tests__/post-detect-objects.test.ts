import { mockDetectionResult } from "@artloupe/mock-data";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { postDetectObjects } from "../post-detect-objects";

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe("postDetectObjects", () => {
  const mockImageData = new ArrayBuffer(8);

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

    const result = await postDetectObjects(mockImageData);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(mockDetectionResult.objects.length);
  });

  it("should return objects with required properties", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const result = await postDetectObjects(mockImageData);

    if (result.length > 0) {
      const detection = result[0];
      expect(detection).toHaveProperty("label");
      expect(detection).toHaveProperty("score");
      expect(detection).toHaveProperty("box");
      expect(detection.box).toHaveProperty("xmin");
      expect(detection.box).toHaveProperty("ymin");
      expect(detection.box).toHaveProperty("xmax");
      expect(detection.box).toHaveProperty("ymax");
    }
  });

  it("should handle empty image data", async () => {
    const emptyData = new ArrayBuffer(0);
    await expect(postDetectObjects(emptyData)).rejects.toThrow();
  });

  it("should return valid confidence scores", async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockDetectionResult),
    } as unknown as Response);

    const result = await postDetectObjects(mockImageData);

    for (const detection of result) {
      expect(detection.score).toBeGreaterThanOrEqual(0);
      expect(detection.score).toBeLessThanOrEqual(1);
    }
  });

  it("should throw error when fetch fails", async () => {
    // Mock failed response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Detection failed" }),
    } as unknown as Response);

    await expect(postDetectObjects(mockImageData)).rejects.toThrow(
      "Detection failed",
    );
  });
});
