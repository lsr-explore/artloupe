import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAnalysisResult, mockArtwork } from "@artloupe/mock-data";
import { postAnalyzeArt } from "../post-analyze-art";

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe("postAnalyzeArt", () => {
	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
	});

	it("should analyze artwork successfully", async () => {
		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue(mockAnalysisResult),
		} as unknown as Response);

		const result = await postAnalyzeArt(mockArtwork);

		expect(result).toBeDefined();
		expect(result.result).toBe(mockAnalysisResult.result);
	});

	it("should handle artwork without description", async () => {
		const artworkWithoutDescription = {
			id: mockArtwork.id,
			title: mockArtwork.title,
			artist: mockArtwork.artist,
			imageUrl: mockArtwork.imageUrl,
			metId: mockArtwork.metId,
			aiAnalysis: mockArtwork.aiAnalysis,
		};

		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue(mockAnalysisResult),
		} as unknown as Response);

		const result = await postAnalyzeArt(artworkWithoutDescription);
		expect(result).toBeDefined();
		expect(typeof result.result).toBe("string");
	});

	it("should throw error for invalid artwork", async () => {
		const invalidArtwork = {
			id: "",
			title: "",
			artist: "",
		};

		await expect(postAnalyzeArt(invalidArtwork as never)).rejects.toThrow();
	});

	it("should return meaningful analysis", async () => {
		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue(mockAnalysisResult),
		} as unknown as Response);

		const result = await postAnalyzeArt(mockArtwork);

		expect(result.result).toBeTruthy();
		expect(result.result.length).toBeGreaterThan(10);
		expect(typeof result.result).toBe("string");
	});

	it("should throw error when fetch fails", async () => {
		// Mock failed response
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: vi.fn().mockResolvedValue({ error: "Analysis failed" }),
		} as unknown as Response);

		await expect(postAnalyzeArt(mockArtwork)).rejects.toThrow(
			"Analysis failed",
		);
	});
});
