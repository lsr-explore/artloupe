import { fetchPhotoWorks } from "@artloupe/api-fetchers";
import { useQuery } from "@tanstack/react-query";
import type { ImageType } from "@artloupe/shared-types";

type PhotosResponse = { total: number; images: ImageType[]; mock?: boolean };

export const useFetchPhotoWorks = (query: string, enabled = true) => {
	return useQuery<PhotosResponse>({
		queryKey: ["pexels", "search", query],
		queryFn: () => fetchPhotoWorks(query),
		enabled: enabled && !!query,
	});
};
