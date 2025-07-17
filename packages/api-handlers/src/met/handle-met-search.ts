import type { NextRequest } from "next/server";
import { MOCK_ARTWORKS } from "./mock-response";
import { ImageType, mapMetObjectsToImageType } from "@artloupe/shared-types";

interface MetSearchResponse {
	objectIDs?: number[];
	total?: number;
}

interface MetObjectResponse {
	objectID: number;
	title?: string;
	artistDisplayName?: string;
	primaryImageSmall?: string;
	objectDate?: string;
}

export const handleMetSearch = async (
	request: NextRequest,
): Promise<Response> => {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get("q");

	if (!q) {
		return Response.json({ error: "Missing query param `q`" }, { status: 400 });
	}

	// 🔁 Check for mock mode
	if (process.env.USE_MOCK_MET_API === "true") {
		return Response.json({
			total: 1,
			images: MOCK_ARTWORKS,
			mock: true,
		});
	}

	try {
		// 🔍 Search for object IDs
		const searchResponse = await fetch(
			`${process.env.MET_API_BASE_URL}/search?q=${encodeURIComponent(q)}`,
		);
		const searchData = (await searchResponse.json()) as MetSearchResponse;

		if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
			return Response.json({ artworks: [] });
		}

		const limitedIds = searchData.objectIDs.slice(0, 30); // limit results for performance

		// 🖼️ Fetch artwork details in parallel
		const detailPromises = limitedIds.map(async (id: number) => {
			const objectResponse = await fetch(
				`${process.env.MET_API_BASE_URL}/objects/${id}`,
			);
			const objectData = (await objectResponse.json()) as MetObjectResponse;

			return objectData;

		});

		const artworks = await Promise.all(detailPromises);

		const mappedArtworks = mapMetObjectsToImageType(artworks);

		const filteredArtworks = mappedArtworks.filter((artwork: ImageType) => artwork.imageUrl);

		console.log("🔍 MET API response:", { artworks: filteredArtworks });

		return Response.json({
			total: filteredArtworks.length,
			images: filteredArtworks,
		});
	} catch (error: unknown) {
		console.error("❌ MET API error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return Response.json({ error: errorMessage }, { status: 500 });
	}
};
