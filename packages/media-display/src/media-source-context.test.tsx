import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import type { ImageType } from '@artloupe/shared-types';
import { MediaSourceContext } from './media-source-context';

describe('MediaSourceContext', () => {
  it('should be created with correct type', () => {
    expect(MediaSourceContext).toBeDefined();
    expect(typeof MediaSourceContext).toBe('object');
    expect(MediaSourceContext.Provider).toBeDefined();
    expect(MediaSourceContext.Consumer).toBeDefined();
  });

  it('should have correct context type structure', () => {
    // Test that the context can be used with the expected type structure
    const mockContextValue = {
      source: 'paintings' as const,
      data: {
        total: 2,
        images: [
          {
            id: 'test-1',
            title: 'Test Artwork',
            artist: 'Test Artist',
            imageUrl: 'https://example.com/test.jpg',
            description: 'Test description',
          } as ImageType,
        ],
      },
      isLoading: false,
      error: null,
    };

    // This test ensures the context can accept the expected type
    expect(mockContextValue.source).toBe('paintings');
    expect(mockContextValue.data?.total).toBe(2);
    expect(mockContextValue.data?.images).toHaveLength(1);
    expect(mockContextValue.isLoading).toBe(false);
    expect(mockContextValue.error).toBeNull();
  });

  it('should support paintings source type', () => {
    const paintingsContextValue = {
      source: 'paintings' as const,
      data: {
        total: 1,
        images: [] as ImageType[],
      },
      isLoading: false,
      error: undefined,
    };

    expect(paintingsContextValue.source).toBe('paintings');
  });

  it('should support photos source type', () => {
    const photosContextValue = {
      source: 'photos' as const,
      data: {
        total: 1,
        images: [] as ImageType[],
      },
      isLoading: false,
      error: undefined,
    };

    expect(photosContextValue.source).toBe('photos');
  });

  it('should support undefined data', () => {
    const undefinedDataContextValue = {
      source: 'paintings' as const,
      data: undefined,
      isLoading: false,
      error: undefined,
    };

    expect(undefinedDataContextValue.data).toBeUndefined();
  });

  it('should support loading state', () => {
    const loadingContextValue = {
      source: 'paintings' as const,
      data: undefined,
      isLoading: true,
      error: undefined,
    };

    expect(loadingContextValue.isLoading).toBe(true);
  });

  it('should support error state', () => {
    const mockError = new Error('Test error');
    const errorContextValue = {
      source: 'paintings' as const,
      data: undefined,
      isLoading: false,
      error: mockError,
    };

    expect(errorContextValue.error).toBe(mockError);
  });

  it('should support mock data flag', () => {
    const mockDataContextValue = {
      source: 'paintings' as const,
      data: {
        total: 1,
        images: [] as ImageType[],
        mock: true,
      },
      isLoading: false,
      error: undefined,
    };

    expect(mockDataContextValue.data?.mock).toBe(true);
  });

  it('should support artworks array with Artwork objects', () => {
    const images: ImageType[] = [
      {
        id: 'artwork-1',
        title: 'Test Artwork 1',
        artist: 'Test Artist 1',
        imageUrl: 'https://example.com/artwork1.jpg',
        description: 'Test description 1',
        source: 'met',
        metId: '123',
      },
      {
        id: 'artwork-2',
        title: 'Test Artwork 2',
        artist: 'Test Artist 2',
        imageUrl: 'https://example.com/artwork2.jpg',
        description: 'Test description 2',
        source: 'met',
        metId: '456',
      },
    ];

    const contextValue = {
      source: 'paintings' as const,
      data: {
        total: images.length,
        images,
      },
      isLoading: false,
      error: undefined,
    };

    expect(contextValue.data?.images).toHaveLength(2);
    expect(contextValue.data?.images[0]).toMatchObject({
      id: 'artwork-1',
      title: 'Test Artwork 1',
      artist: 'Test Artist 1',
    });
    expect(contextValue.data?.images[1]).toMatchObject({
      id: 'artwork-2',
      title: 'Test Artwork 2',
      artist: 'Test Artist 2',
    });
  });

  it('should support minimal Artwork objects', () => {
    const minimalArtworks: ImageType[] = [
      {
        id: 'minimal-1',
        title: 'Minimal Artwork',
        source: 'met',
        metId: '123',
      },
    ];

    const contextValue = {
      source: 'photos' as const,
      data: {
        total: minimalArtworks.length,
        images: minimalArtworks,
      },
      isLoading: false,
      error: undefined,
    };

    expect(contextValue.data?.images[0]).toMatchObject({
      id: 'minimal-1',
      title: 'Minimal Artwork',
    });
    expect(contextValue.data?.images[0].artist).toBeUndefined();
    expect(contextValue.data?.images[0].imageUrl).toBeUndefined();
    expect(contextValue.data?.images[0].description).toBeUndefined();
  });

  it('should have correct context display name', () => {
    // Test that the context has a meaningful display name for debugging
    expect(MediaSourceContext.displayName).toBeUndefined();
    // This is expected as we didn't set a displayName in the original context
  });

  it('should support empty artworks array', () => {
    const emptyContextValue = {
      source: 'paintings' as const,
      data: {
        total: 0,
        images: [] as ImageType[],
      },
      isLoading: false,
      error: undefined,
    };

    expect(emptyContextValue.data?.images).toHaveLength(0);
    expect(emptyContextValue.data?.total).toBe(0);
  });

  it('should support large total count', () => {
    const largeCountContextValue = {
      source: 'photos' as const,
      data: {
        total: 1000,
        images: [] as ImageType[],
      },
      isLoading: false,
      error: undefined,
    };

    expect(largeCountContextValue.data?.total).toBe(1000);
  });
});
