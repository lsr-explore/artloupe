import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { detectObjects } from "../object-detection/detect-objects";

// Mock NextRequest
const mockRequest = (body: Record<string, unknown>) =>
  ({
    json: vi.fn().mockResolvedValue(body),
  }) as any;

describe("detectObjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  beforeAll(() => {
    process.env.HF_TOKEN = "test-token";
  });

  it("should return mock data when USE_MOCK_DETECTION is true", async () => {
    const originalValue = process.env.USE_MOCK_DETECTION;
    process.env.USE_MOCK_DETECTION = "true";

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockModelId = "facebook/detr-resnet-50";

    const request = mockRequest({
      imageUrl: mockImageUrl,
      modelId: mockModelId,
    });
    const result = await detectObjects(request);

    expect(result).toBeInstanceOf(Response);

    const data = await result.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("label");
    expect(data[0]).toHaveProperty("score");
    expect(data[0]).toHaveProperty("box");

    // Restore original value
    process.env.USE_MOCK_DETECTION = originalValue;
  });

  it("should call HuggingFace API with correct parameters when not using mock", async () => {
    const originalValue = process.env.USE_MOCK_DETECTION;
    delete process.env.USE_MOCK_DETECTION;

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockModelId = "facebook/detr-resnet-50";
    const mockResponse = [{ label: "person", score: 0.95 }];

    // Mock fetch to return successful response
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const request = mockRequest({
      imageUrl: mockImageUrl,
      modelId: mockModelId,
    });
    const result = await detectObjects(request);

    expect(result).toBeInstanceOf(Response);
    const data = await result.json();
    expect(data).toEqual(mockResponse);

    // Verify fetch was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api-inference.huggingface.co/models/${mockModelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ inputs: mockImageUrl }),
      },
    );

    // Restore original value
    process.env.USE_MOCK_DETECTION = originalValue;
  });

  it("should return response data from API", async () => {
    const originalValue = process.env.USE_MOCK_DETECTION;
    delete process.env.USE_MOCK_DETECTION;

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockModelId = "facebook/detr-resnet-50";
    const mockResponseData = [{ label: "person", score: 0.95 }];

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const mockPostRequest = mockRequest({
      imageUrl: mockImageUrl,
      modelId: mockModelId,
    });

    const result = await detectObjects(mockPostRequest);

    expect(result.status).toBe(200);
    const data = await result.json();
    expect(data).toEqual(mockResponseData);

    // Restore original value
    process.env.USE_MOCK_DETECTION = originalValue;
  });

  it("should handle fetch errors", async () => {
    const originalValue = process.env.USE_MOCK_DETECTION;
    delete process.env.USE_MOCK_DETECTION;

    const mockImageUrl = "https://example.com/test-image.jpg";
    const mockModelId = "facebook/detr-resnet-50";

    const request = mockRequest({
      imageUrl: mockImageUrl,
      modelId: mockModelId,
    });

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "API Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await detectObjects(request);
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(500);

    // Restore original value
    process.env.USE_MOCK_DETECTION = originalValue;
  });
});
