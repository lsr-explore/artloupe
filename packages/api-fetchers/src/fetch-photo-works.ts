import type { ImageType } from "@artloupe/shared-types";
type PhotosResponse = { total: number; images: ImageType[]; mock?: boolean };

export const fetchPhotoWorks = async (query: string): Promise<PhotosResponse> => {
	if (!query || query.trim() === "") {
		throw new Error("Query cannot be empty");
	}

	const response = await fetch(
		`/api/pexels/search?q=${encodeURIComponent(query)}`,
	);
	if (!response.ok) throw new Error("Failed to fetch artworks");
	return response.json() as Promise<PhotosResponse>;
};
