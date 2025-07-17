/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MOCK_ARTWORKS } from "./mock-response";
import { mapPexelsPhotosToImageType } from "@artloupe/shared-types";
import { logger, withLogging } from "@artloupe/logger";

interface PexelsPhoto {
	id: number;
	alt: string;
	photographer: string;
	src: {
		medium: string;
	};
}

interface PexelsSearchResponse {
	per_page: number;
	photos: PexelsPhoto[];
}

const handlePhotoSearchInternal = async (
	request: NextRequest,
): Promise<NextResponse> => {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get("q");
	const requestLogger = logger.withContext({ 
		query: q,
		endpoint: 'pexels-search',
		userAgent: request.headers.get('user-agent') || 'unknown'
	});

	if (!q) {
		requestLogger.warn({ query: q }, "Missing query parameter 'q'");
		return NextResponse.json({ error: "Missing query param `q`" }, { status: 400 });
	}

	requestLogger.info({ query: q }, "Starting Pexels photo search");

	// 🔁 Check for mock mode
	if (process.env.USE_MOCK_PEXELS_API === "true") {
		requestLogger.info({ mock: true }, "Using mock Pexels API response");
		return NextResponse.json({
			total: 1,
			images: MOCK_ARTWORKS,
			mock: true,
		});
	}

	try {
		// 🔍 Search for object IDs
		const apiUrl = `${process.env.PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(q)}`;
		requestLogger.debug({ apiUrl }, "Making request to Pexels API");

		const searchResponse = await fetch(apiUrl, {
			method: "GET",
			headers: {
				Authorization: `${process.env.PEXELS_API_KEY}`,
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});

		if (!searchResponse.ok) {
			requestLogger.error({ 
				status: searchResponse.status,
				statusText: searchResponse.statusText 
			}, "Pexels API request failed");
			return NextResponse.json({ error: "External API error" }, { status: 500 });
		}

		const searchData = (await searchResponse.json()) as PexelsSearchResponse;

		if (searchData.per_page === 0 || searchData.photos.length === 0) {
			requestLogger.info({ query: q, results: 0 }, "No photos found for query");
			return NextResponse.json({ artworks: [] });
		}

		const mappedArtworks = mapPexelsPhotosToImageType(searchData.photos);
		let filteredArtworks = mappedArtworks.filter((artwork) => artwork.imageUrl);

		if (filteredArtworks.length === 0) {
			requestLogger.warn({ query: q, mappedCount: mappedArtworks.length }, "No valid artworks after filtering");
			return NextResponse.json({ artworks: [] });
		}

		if (filteredArtworks.length > 10) {
			const originalCount = filteredArtworks.length;
			filteredArtworks = filteredArtworks.slice(0, 10);
			requestLogger.info({ 
				query: q, 
				originalCount, 
				finalCount: filteredArtworks.length 
			}, "Limited results to 10 artworks");
		}

		requestLogger.info({ 
			query: q, 
			results: filteredArtworks.length,
			images: filteredArtworks.map(a => a.id)
		}, "Successfully found artworks");

		return NextResponse.json({
			total: filteredArtworks.length,
			images: filteredArtworks,
		});
	} catch (error: unknown) {
		requestLogger.error({ 
			query: q,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		}, "Pexels API error occurred");
		
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
};

export const handlePhotoSearch = withLogging(handlePhotoSearchInternal, {
	logRequest: true,
	logResponse: true,
	logErrors: true,
});
