import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { critiqueImage } from "../critique-image/critique-image";

// Mock NextRequest
const mockRequest = (body: Record<string, unknown>) =>
  ({
    json: vi.fn().mockResolvedValue(body),
  }) as any;

describe("critiqueImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  beforeAll(() => {
    process.env.HF_TOKEN = "test-token";
  });

  it("should return mock data when USE_MOCK_CRITIQUE is true", async () => {
    const originalValue = process.env.USE_MOCK_CRITIQUE;
    process.env.USE_MOCK_CRITIQUE = "true";

    const mockImageUrl = "https://example.com/test-image.jpg";

    const request = mockRequest({ imageUrl: mockImageUrl });
    const result = await critiqueImage(request);

    expect(result).toBeInstanceOf(Response);

    const data = await result.json();
    expect(data).toHaveProperty("score");
    expect(data).toHaveProperty("analysis");
    expect(data).toHaveProperty("strengths");
    expect(data).toHaveProperty("areas_for_improvement");
    expect(typeof data.score).toBe("number");
    expect(typeof data.analysis).toBe("string");
    expect(Array.isArray(data.strengths)).toBe(true);
    expect(Array.isArray(data.areas_for_improvement)).toBe(true);

    // Restore original value
    process.env.USE_MOCK_CRITIQUE = originalValue;
  });

  it("should call HuggingFace API with correct parameters when not using mock", async () => {
    const originalValue = process.env.USE_MOCK_CRITIQUE;
    delete process.env.USE_MOCK_CRITIQUE;

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockResponse = { score: 0.95 };

    // Mock fetch to return successful response
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const request = mockRequest({ imageUrl: mockImageUrl });
    const result = await critiqueImage(request);

    expect(result).toBeInstanceOf(Response);
    const data = await result.json();
    expect(data).toEqual(mockResponse);

    // Verify fetch was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api-inference.huggingface.co/models/vinvino02/saliency-model",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: mockImageUrl }),
      },
    );

    // Restore original value
    process.env.USE_MOCK_CRITIQUE = originalValue;
  });

  it("should return response data from API", async () => {
    const originalValue = process.env.USE_MOCK_CRITIQUE;
    delete process.env.USE_MOCK_CRITIQUE;

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockResponse = { score: 0.95 };

    // Mock fetch to return successful response
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const request = mockRequest({ imageUrl: mockImageUrl });
    const result = await critiqueImage(request);

    expect(result).toBeInstanceOf(Response);

    const data = await result.json();
    expect(data).toEqual(mockResponse);

    // Restore original value
    process.env.USE_MOCK_CRITIQUE = originalValue;
  });

  it("should handle fetch errors", async () => {
    const originalValue = process.env.USE_MOCK_CRITIQUE;
    delete process.env.USE_MOCK_CRITIQUE;

    const mockImageUrl = "https://example.com/test-image.jpg";

    // Mock fetch to return error response
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "mocked error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const request = mockRequest({ imageUrl: mockImageUrl });

    // Since critiqueImage throws errors, we need to expect it to throw
    await expect(critiqueImage(request)).rejects.toThrow(
      "HTTP error! status: 500",
    );

    // Restore original value
    process.env.USE_MOCK_CRITIQUE = originalValue;
  });
});
