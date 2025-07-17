import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import type { ImageType } from "@artloupe/shared-types";

// Mock React's useContext
vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		useContext: vi.fn(),
	};
});

import { useContext } from "react";
// Import the hook after mocking
import { useMediaSource } from "../media-source-hook";

// Mock the context
const mockContextValue = {
	source: "paintings" as const,
	data: {
		total: 2,
		images: [
			{
				id: "artwork-1",
				title: "Test Artwork 1",
				artist: "Test Artist 1",
				imageUrl: "https://example.com/artwork1.jpg",
				description: "Test description 1",
			} as ImageType,
		],
	},
	isLoading: false,
	error: undefined,
};

describe("useMediaSource", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return context value when context exists", () => {
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(mockContextValue);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current).toBe(mockContextValue);
		expect(result.current.source).toBe("paintings");
		expect(result.current.data?.total).toBe(2);
		expect(result.current.data?.images).toHaveLength(1);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBeUndefined();
	});

	it("should return paintings source type", () => {
		const paintingsContext = {
			...mockContextValue,
			source: "paintings" as const,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(paintingsContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.source).toBe("paintings");
	});

	it("should return photos source type", () => {
		const photosContext = {
			...mockContextValue,
			source: "photos" as const,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(photosContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.source).toBe("photos");
	});

	it("should return loading state", () => {
		const loadingContext = {
			...mockContextValue,
			isLoading: true,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(loadingContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.isLoading).toBe(true);
	});

	it("should return error state", () => {
		const mockError = new Error("Test error message");
		const errorContext = {
			...mockContextValue,
			error: mockError,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(errorContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.error).toBe(mockError);
	});

	it("should return undefined data", () => {
		const undefinedDataContext = {
			...mockContextValue,
			data: undefined,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(
			undefinedDataContext,
		);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data).toBeUndefined();
	});

	it("should return empty artworks array", () => {
		const emptyArtworksContext = {
			...mockContextValue,
			data: {
				total: 0,
				images: [] as ImageType[],
			},
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(
			emptyArtworksContext,
		);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data?.images).toHaveLength(0);
		expect(result.current.data?.total).toBe(0);
	});

	it("should return multiple artworks", () => {
		const multipleArtworks: ImageType[] = [
			{
				id: "artwork-1",
				title: "Test Artwork 1",
				artist: "Test Artist 1",
				imageUrl: "https://example.com/artwork1.jpg",
				description: "Test description 1",
				source: "met",
				metId: "123",
			},
			{
				id: "artwork-2",
				title: "Test Artwork 2",
				artist: "Test Artist 2",
				imageUrl: "https://example.com/artwork2.jpg",
				description: "Test description 2",
				source: "met",
				metId: "456",
			},
		];

		const multipleArtworksContext = {
			...mockContextValue,
			data: {
				total: 2,
				images: multipleArtworks,
			},
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(
			multipleArtworksContext,
		);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data?.images).toHaveLength(2);
		expect(result.current.data?.images[0].id).toBe("artwork-1");
		expect(result.current.data?.images[1].id).toBe("artwork-2");
	});

	it("should return minimal Artwork objects", () => {
		const minimalArtworks: ImageType[] = [
			{
				id: "minimal-1",
				title: "Minimal Artwork",
				source: "met",
				metId: "123",
			},
		];

		const minimalContext = {
			...mockContextValue,
			data: {
				total: 1,
				images: minimalArtworks,
			},
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(minimalContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data?.images[0]).toMatchObject({
			id: "minimal-1",
			title: "Minimal Artwork",
		});
		expect(result.current.data?.images[0].artist).toBeUndefined();
		expect(result.current.data?.images[0].imageUrl).toBeUndefined();
		expect(result.current.data?.images[0].description).toBeUndefined();
	});

	it("should return mock data flag", () => {
		const mockDataContext = {
			...mockContextValue,
			data: {
				...mockContextValue.data,
				mock: true,
			},
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(mockDataContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data?.mock).toBe(true);
	});

	it("should throw error when context is undefined", () => {
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue();

		expect(() => {
			renderHook(() => useMediaSource());
		}).toThrow("useMediaSource must be used within MediaSourceProvider");
	});

	it("should throw error when context is null", () => {
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue();

		expect(() => {
			renderHook(() => useMediaSource());
		}).toThrow("useMediaSource must be used within MediaSourceProvider");
	});

	it("should handle large datasets", () => {
		const largeArtworks: ImageType[] = Array.from(
			{ length: 100 },
			(_, index) => ({
				id: `artwork-${index}`,
				title: `Artwork ${index}`,
				artist: `Artist ${index}`,
				imageUrl: `https://example.com/artwork${index}.jpg`,
				description: `Test description ${index}`,
				source: "met",
				metId: `123-${index}`,
			}),
		);

		const largeContext = {
			...mockContextValue,
			data: {
				total: 100,
				images: largeArtworks,
			},
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(largeContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.data?.images).toHaveLength(100);
		expect(result.current.data?.total).toBe(100);
		expect(result.current.data?.images[99].id).toBe("artwork-99");
	});

	it("should handle complex error objects", () => {
		const complexError = new Error("Complex error");
		const complexErrorContext = {
			...mockContextValue,
			error: complexError,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(
			complexErrorContext,
		);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.error).toBe(complexError);
		expect(result.current.error?.message).toBe("Complex error");
	});

	it("should handle null error", () => {
		const nullErrorContext = {
			...mockContextValue,
			error: null,
		};
		(useContext as ReturnType<typeof vi.fn>).mockReturnValue(nullErrorContext);

		const { result } = renderHook(() => useMediaSource());

		expect(result.current.error).toBeNull();
	});
});
