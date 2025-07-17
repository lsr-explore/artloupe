import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeArt } from "../open-ai/analyze-art";

// Mock NextRequest
const mockRequest = (body: any) =>
	({
		json: vi.fn().mockResolvedValue(body),
	}) as any;

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("analyzeArt", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return mock analysis when USE_LOCAL_AI is true", async () => {
		const originalValue = process.env.USE_LOCAL_AI;
		process.env.USE_LOCAL_AI = "true";

		const mockArtwork = {
			id: "1",
			title: "Test Artwork",
			artist: "Test Artist",
			description: "A test artwork",
		};

		const request = mockRequest(mockArtwork);
		const response = await analyzeArt(request);
		const data = await response.json();

		expect(data.result).toContain(
			'AI Analysis of "Test Artwork" by Test Artist:',
		);

		// Restore original value
		process.env.USE_LOCAL_AI = originalValue;
	});

	it("should handle different environment configurations", async () => {
		const originalValue = process.env.USE_LOCAL_AI;

		// Test with undefined USE_LOCAL_AI (should not equal "true")
		delete process.env.USE_LOCAL_AI;

		const mockArtwork = {
			id: "1",
			title: "Test Artwork",
			artist: "Test Artist",
		};

		// Mock a successful fetch response
		mockFetch.mockResolvedValueOnce({
			json: vi.fn().mockResolvedValue({
				choices: [
					{
						message: {
							content: "AI generated analysis",
						},
					},
				],
			}),
		});

		const request = mockRequest(mockArtwork);
		const response = await analyzeArt(request);

		expect(response).toBeInstanceOf(Response);

		// Restore original value
		process.env.USE_LOCAL_AI = originalValue;
	});

	it("should handle basic functionality", async () => {
		const originalValue = process.env.USE_LOCAL_AI;
		process.env.USE_LOCAL_AI = "true";

		const mockArtwork = {
			id: "1",
			title: "Starry Night",
			artist: "Vincent van Gogh",
		};

		const request = mockRequest(mockArtwork);
		const response = await analyzeArt(request);

		expect(response).toBeInstanceOf(Response);

		const data = await response.json();
		expect(data).toHaveProperty("result");
		expect(typeof data.result).toBe("string");
		expect(data.result.length).toBeGreaterThan(0);

		// Restore original value
		process.env.USE_LOCAL_AI = originalValue;
	});

	it("should handle artwork without artist", async () => {
		const originalValue = process.env.USE_LOCAL_AI;
		process.env.USE_LOCAL_AI = "true";

		const mockArtwork = {
			id: "1",
			title: "Unknown Artwork",
		};

		const request = mockRequest(mockArtwork);
		const response = await analyzeArt(request);
		const data = await response.json();

		expect(data.result).toContain('AI Analysis of "Unknown Artwork"');

		// Restore original value
		process.env.USE_LOCAL_AI = originalValue;
	});
});
