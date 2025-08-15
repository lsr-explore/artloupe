'use client';

import {
  useFetchArtworks,
  useFetchPhotoWorks,
} from '@artloupe/react-query-hooks';
import type { ArtworksResponse } from '@artloupe/shared-types';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { MediaSourceContext } from './media-source-context';

type SourceType = 'paintings' | 'photos';

export const MediaSourceProvider = ({
  children,
  searchType,
  searchQuery,
  shouldSearch = false,
}: {
  children: ReactNode;
  searchType: string;
  searchQuery: string;
  shouldSearch?: boolean;
}) => {
  const [source, setSource] = useState<SourceType>(searchType as SourceType);
  const [query, setQuery] = useState<string>(searchQuery);

  // Sync internal state with props when they change
  useEffect(() => {
    setSource(searchType as SourceType);
    setQuery(searchQuery);
  }, [searchType, searchQuery]);

  const {
    data: metData,
    isLoading: loadingMet,
    error: errorMet,
  } = useFetchArtworks(query, shouldSearch && source === 'paintings');

  const {
    data: pexelsData,
    isLoading: loadingPexels,
    error: errorPexels,
  } = useFetchPhotoWorks(query, shouldSearch && source === 'photos');

  const data = source === 'paintings' ? metData : pexelsData;
  const isLoading = source === 'paintings' ? loadingMet : loadingPexels;
  const error = source === 'paintings' ? errorMet : errorPexels;

  const value = useMemo(
    () => ({
      source,
      query,
      data: data as ArtworksResponse, // Type assertion needed since data could be either artworks or photos
      isLoading,
      error,
      setSource,
      setQuery,
    }),
    [source, query, data, isLoading, error],
  );

  return (
    <MediaSourceContext.Provider value={value}>
      {children}
    </MediaSourceContext.Provider>
  );
};
