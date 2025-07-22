import { fetchPhotoWorks } from '@artloupe/api-fetchers';
import type { ImageType } from '@artloupe/shared-types';
import { useQuery } from '@tanstack/react-query';

type PhotosResponse = { total: number; images: ImageType[]; mock?: boolean };

export const useFetchPhotoWorks = (query: string, enabled = true) => {
  return useQuery<PhotosResponse>({
    queryKey: ['pexels', 'search', query],
    queryFn: () => fetchPhotoWorks(query),
    enabled: enabled && !!query,
  });
};
