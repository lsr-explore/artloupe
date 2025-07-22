import { fetchArtworks } from '@artloupe/api-fetchers';
import type { ImageType } from '@artloupe/shared-types';
import { useQuery } from '@tanstack/react-query';

type ArtworksResponse = { total: number; images: ImageType[]; mock?: boolean };

export const useFetchArtworks = (query: string, enabled = true) => {
  return useQuery<ArtworksResponse>({
    queryKey: ['met', 'search', query],
    queryFn: () => fetchArtworks(query),
    enabled: enabled && !!query,
  });
};
