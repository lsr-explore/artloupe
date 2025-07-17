import { fetchArtworks } from "../fetch-artworks";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockArtworks } from "@artloupe/mock-data";

// Get the mocked fetch function
const mockFetch = vi.mocked(fetch);

describe("fetchArtworks", () => {
	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
	});

	it("should fetch artworks successfully", async () => {
		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue({ images: mockArtworks }),
		} as unknown as Response);

		const result = await fetchArtworks("sunflowers");

		expect(result).toBeDefined();
		expect(result.images).toHaveLength(mockArtworks.length);
		expect(result.images[0]).toMatchObject({
			id: expect.any(String),
			title: expect.any(String),
			artist: expect.any(String),
		});
	});

	it("should handle empty search results", async () => {
		// Mock response with empty results
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue({ images: [] }),
		} as unknown as Response);

		const result = await fetchArtworks("nonexistentquery");

		expect(result).toBeDefined();
		expect(Array.isArray(result.images)).toBe(true);
	});

	it("should throw error for invalid queries", async () => {
		await expect(fetchArtworks("")).rejects.toThrow();
	});

	it("should include all required artwork properties", async () => {
		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValue({ images: mockArtworks }),
		} as unknown as Response);

		const result = await fetchArtworks("test");

		if (result.images.length > 0) {
			const artwork = result.images[0];
			expect(artwork).toHaveProperty("id");
			expect(artwork).toHaveProperty("title");
			expect(artwork).toHaveProperty("artist");
		}
	});

	it("should throw error when fetch fails", async () => {
		// Mock failed response
		mockFetch.mockResolvedValueOnce({
			ok: false,
		} as Response);

		await expect(fetchArtworks("test")).rejects.toThrow(
			"Failed to fetch artworks",
		);
	});
});
