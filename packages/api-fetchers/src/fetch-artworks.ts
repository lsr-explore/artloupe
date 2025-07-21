import type { ImageType } from "@artloupe/shared-types";

type ArtworksResponse = { total: number; images: ImageType[]; mock?: boolean };

export const fetchArtworks = async (
  query: string,
): Promise<ArtworksResponse> => {
  if (!query || query.trim() === "") {
    throw new Error("Query cannot be empty");
  }

  const response = await fetch(
    `/api/met/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) throw new Error("Failed to fetch artworks");
  return response.json() as Promise<ArtworksResponse>;
};
