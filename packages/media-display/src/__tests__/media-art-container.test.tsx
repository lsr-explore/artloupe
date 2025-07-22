import { render, screen } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { ImageType } from '../../../shared-types/src/types/image-type';
import { MediaArtContainer } from '../components/media-art-container';

// Mock the media source hook
const mockUseMediaSource = vi.fn();
vi.mock('../media-source-hook', () => ({
  useMediaSource: () => mockUseMediaSource(),
}));

// Mock the ImagePanel component
vi.mock('../components/image-panel', () => ({
  ImagePanel: ({ image }: { image: ImageType }) => (
    <div data-testid={`image-panel-${image.id}`}>
      <h3>{image.title}</h3>
      <p>{image.artist}</p>
    </div>
  ),
}));

// Mock the MediaLayout component
vi.mock('../components/media-layout', () => ({
  MediaLayout: ({
    artworks,
    renderItem,
    title,
    subtitle,
  }: {
    artworks: ImageType[];
    renderItem: (artwork: ImageType) => React.ReactElement;
    title: string;
    subtitle: string;
  }) => (
    <div data-testid='media-layout'>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div data-testid='artworks-container'>
        {artworks.map((artwork: ImageType) => renderItem(artwork))}
      </div>
    </div>
  ),
}));

const mockImages: ImageType[] = [
  {
    id: 'image-1',
    title: 'Test Image 1',
    artist: 'Test Artist 1',
    imageUrl: 'https://example.com/image1.jpg',
    description: 'Test description 1',
    source: 'met',
  },
  {
    id: 'image-2',
    title: 'Test Image 2',
    artist: 'Test Artist 2',
    imageUrl: 'https://example.com/image2.jpg',
    description: 'Test description 2',
    source: 'pexels',
  },
];

describe('MediaArtContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseMediaSource.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const mockError = new Error('Test error message');
    mockUseMediaSource.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error message')).toHaveClass(
      'p-6',
      'text-center',
      'text-red-600',
    );
  });

  it('should render no results state when data is undefined', () => {
    mockUseMediaSource.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('should render no results state when images array is empty', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: [], total: 0 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('should render paintings with correct title and image panels', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: mockImages, total: 2 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(
      screen.getByText('Metropolitan Museum of Art Collection'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Discover and analyze beautiful imagery with AI'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-1')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-2')).toBeInTheDocument();
    expect(screen.getByText('Test Image 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
  });

  it('should render photos with correct title and image panels', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: mockImages, total: 2 },
      isLoading: false,
      error: undefined,
      source: 'photos',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('Pexels Photo Collection')).toBeInTheDocument();
    expect(
      screen.getByText('Discover and analyze beautiful imagery with AI'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-1')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-2')).toBeInTheDocument();
    expect(screen.getByText('Test Image 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
  });

  it('should pass correct props to MediaLayout', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: mockImages, total: 2 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByTestId('media-layout')).toBeInTheDocument();
    expect(screen.getByTestId('artworks-container')).toBeInTheDocument();
  });

  it('should handle images with missing optional fields', () => {
    const minimalImages: ImageType[] = [
      {
        id: 'minimal-1',
        title: 'Minimal Image',
        imageUrl: 'https://example.com/minimal.jpg',
        source: 'met',
      },
    ];

    mockUseMediaSource.mockReturnValue({
      data: { images: minimalImages, total: 1 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByText('Minimal Image')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-minimal-1')).toBeInTheDocument();
  });

  it('should handle multiple images correctly', () => {
    const multipleImages: ImageType[] = [
      ...mockImages,
      {
        id: 'image-3',
        title: 'Test Image 3',
        artist: 'Test Artist 3',
        imageUrl: 'https://example.com/image3.jpg',
        description: 'Test description 3',
        source: 'met',
      },
    ];

    mockUseMediaSource.mockReturnValue({
      data: { images: multipleImages, total: 3 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    render(<MediaArtContainer />);

    expect(screen.getByTestId('image-panel-image-1')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-2')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-3')).toBeInTheDocument();
  });

  it('should have correct loading message styling', () => {
    mockUseMediaSource.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      source: 'paintings',
    });

    const { container } = render(<MediaArtContainer />);

    const loadingMessage = container.querySelector('.p-6.text-center');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('should have correct no results message styling', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: [], total: 0 },
      isLoading: false,
      error: undefined,
      source: 'paintings',
    });

    const { container } = render(<MediaArtContainer />);

    const noResultsMessage = container.querySelector('.p-6.text-center');
    expect(noResultsMessage).toBeInTheDocument();
  });

  it('should handle undefined source gracefully', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: mockImages, total: 2 },
      isLoading: false,
      error: undefined,
      source: undefined,
    });

    render(<MediaArtContainer />);

    // Should default to photos behavior when source is undefined
    expect(screen.getByText('Pexels Photo Collection')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-1')).toBeInTheDocument();
  });

  it('should handle unknown source type gracefully', () => {
    mockUseMediaSource.mockReturnValue({
      data: { images: mockImages, total: 2 },
      isLoading: false,
      error: undefined,
      source: 'unknown' as 'paintings' | 'photos',
    });

    render(<MediaArtContainer />);

    // Should default to photos behavior for unknown source
    expect(screen.getByText('Pexels Photo Collection')).toBeInTheDocument();
    expect(screen.getByTestId('image-panel-image-1')).toBeInTheDocument();
  });
});
