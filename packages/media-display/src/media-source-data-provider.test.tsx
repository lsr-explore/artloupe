import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { ImageType } from '@artloupe/shared-types';
import { MediaSourceContext } from './media-source-context';
import { MediaSourceProvider } from './media-source-data-provider';

// Mock the react-query hooks
const mockUseFetchArtworks = vi.fn();
const mockUseFetchPhotoWorks = vi.fn();

vi.mock('@artloupe/react-query-hooks', () => ({
  useFetchArtworks: () => mockUseFetchArtworks(),
  useFetchPhotoWorks: () => mockUseFetchPhotoWorks(),
}));

// Test component that consumes the context
const TestConsumer = () => {
  const context = React.useContext(MediaSourceContext);
  if (!context) return <div>No context</div>;

  return (
    <div data-testid='context-consumer'>
      <div data-testid='source'>{context.source}</div>
      <div data-testid='total'>{context.data?.total ?? ''}</div>
      <div data-testid='artworks-count'>
        {context.data?.images.length ?? ''}
      </div>
      <div data-testid='loading'>{context.isLoading.toString()}</div>
      <div data-testid='error'>{context.error?.message || 'no error'}</div>
    </div>
  );
};

const mockArtworks: ImageType[] = [
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

describe('MediaSourceProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <div data-testid='test-child'>Test Child</div>
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should initialize with paintings source and use met data', () => {
    const metData = {
      total: 2,
      images: mockArtworks,
    };

    mockUseFetchArtworks.mockReturnValue({
      data: metData,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('source')).toHaveTextContent('paintings');
    expect(screen.getByTestId('total')).toHaveTextContent('2');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('2');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
  });

  it('should initialize with photos source and use pexels data', () => {
    const pexelsData = {
      total: 1,
      images: [mockArtworks[0]],
    };

    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: pexelsData,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='photos'
        searchQuery='nature'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('source')).toHaveTextContent('photos');
    expect(screen.getByTestId('total')).toHaveTextContent('1');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('1');
  });

  it('should handle loading state for paintings', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle loading state for photos', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='photos'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle error state for paintings', () => {
    const mockError = new Error('Met API error');
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Met API error');
  });

  it('should handle error state for photos', () => {
    const mockError = new Error('Pexels API error');
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    render(
      <MediaSourceProvider
        searchType='photos'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Pexels API error');
  });

  it('should enable search when shouldSearch is true for paintings', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={true}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    // Verify that the provider renders correctly
    expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
  });

  it('should enable search when shouldSearch is true for photos', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='photos'
        searchQuery='nature'
        shouldSearch={true}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    // Verify that the provider renders correctly
    expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
  });

  it('should disable search when shouldSearch is false', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
  });

  it('should handle undefined data gracefully', () => {
    mockUseFetchArtworks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('total')).toHaveTextContent('');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('');
  });

  it('should handle empty artworks array', () => {
    const emptyData = {
      total: 0,
      images: [] as ImageType[],
    };

    mockUseFetchArtworks.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('total')).toHaveTextContent('0');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('0');
  });

  it('should handle props changes', async () => {
    const { rerender } = render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='initial'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    mockUseFetchArtworks.mockReturnValue({
      data: { total: 1, images: mockArtworks },
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    // Change props
    rerender(
      <MediaSourceProvider
        searchType='photos'
        searchQuery='updated'
        shouldSearch={true}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('photos');
    });
  });

  it('should handle minimal Artwork objects', () => {
    const minimalArtworks: ImageType[] = [
      {
        id: 'minimal-1',
        title: 'Minimal Artwork',
        artist: 'Test Artist 1',
        imageUrl: 'https://example.com/artwork1.jpg',
        description: 'Test description 1',
        source: 'met',
        metId: '123',
      },
    ];

    const minimalData = {
      total: 1,
      images: minimalArtworks,
    };

    mockUseFetchArtworks.mockReturnValue({
      data: minimalData,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('total')).toHaveTextContent('1');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('1');
  });

  it('should handle large datasets', () => {
    const largeArtworks: ImageType[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: `artwork-${index}`,
        title: `Artwork ${index}`,
        artist: `Artist ${index}`,
        imageUrl: `https://example.com/artwork${index}.jpg`,
        description: `Test description ${index}`,
        source: 'met',
        metId: `123-${index}`,
      }),
    );

    const largeData = {
      total: 100,
      images: largeArtworks,
    };

    mockUseFetchArtworks.mockReturnValue({
      data: largeData,
      isLoading: false,
      error: undefined,
    });

    mockUseFetchPhotoWorks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    render(
      <MediaSourceProvider
        searchType='paintings'
        searchQuery='test'
        shouldSearch={false}>
        <TestConsumer />
      </MediaSourceProvider>,
    );

    expect(screen.getByTestId('total')).toHaveTextContent('100');
    expect(screen.getByTestId('artworks-count')).toHaveTextContent('100');
  });
});
