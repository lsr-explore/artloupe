// A shared type for both Met artworks and Pexels photos
export type ImageType = {
  id: string;
  title: string;
  artist?: string;
  imageUrl: string;
  description?: string;
  source: 'met' | 'pexels';
  metId?: string;
  aiAnalysis?: string;
};

// Met API object response type (copied from handle-met-search)
export interface MetObjectResponse {
  objectID: number;
  title?: string;
  artistDisplayName?: string;
  primaryImageSmall?: string;
  objectDate?: string;
}

// Pexels API photo type (copied from handle-photo-search)
export interface PexelsPhoto {
  id: number;
  alt: string;
  photographer: string;
  src: {
    medium: string;
  };
}

/**
 * Maps an array of Met API object responses to ImageType[]
 */
export function mapMetObjectsToImageType(
  metObjects: MetObjectResponse[],
): ImageType[] {
  return metObjects
    .filter((metObject) => !!metObject.primaryImageSmall)
    .map((metObject) => {
      const image: ImageType = {
        id: String(metObject.objectID),
        title: metObject.title || 'Untitled',
        artist: metObject.artistDisplayName || 'Unknown Artist',
        imageUrl: metObject.primaryImageSmall || '',
        description: metObject.objectDate || '',
        source: 'met',
        metId: String(metObject.objectID),
      };
      return image;
    });
}

/**
 * Maps an array of Pexels API photo objects to ImageType[]
 */
export function mapPexelsPhotosToImageType(
  pexelsPhotos: PexelsPhoto[],
): ImageType[] {
  return pexelsPhotos
    .filter((pexelsPhoto) => !!pexelsPhoto.src.medium)
    .map((pexelsPhoto) => {
      const image: ImageType = {
        id: String(pexelsPhoto.id),
        title: pexelsPhoto.alt || 'Untitled',
        artist: pexelsPhoto.photographer || 'Unknown Photographer',
        imageUrl: pexelsPhoto.src.medium,
        description: '',
        source: 'pexels',
      };
      return image;
    });
}
