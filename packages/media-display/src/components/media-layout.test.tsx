import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { ImageType } from '@artloupe/shared-types';
import { MediaLayout } from './media-layout';

// Mock react-masonry-css
vi.mock('react-masonry-css', () => ({
  default: ({ children, className, columnClassName }: any) => (
    <div className={className} data-testid='masonry-grid'>
      <div className={columnClassName} data-testid='masonry-column'>
        {children}
      </div>
    </div>
  ),
}));

const mockArtworks: ImageType[] = [
  {
    id: 'artwork-1',
    title: 'First Artwork',
    artist: 'Artist One',
    imageUrl: 'https://example.com/artwork1.jpg',
    description: 'First artwork description',
  },
  {
    id: 'artwork-2',
    title: 'Second Artwork',
    artist: 'Artist Two',
    imageUrl: 'https://example.com/artwork2.jpg',
    description: 'Second artwork description',
  },
];

const mockRenderItem = (artwork: Artwork) => (
  <div key={artwork.id} data-testid={`artwork-item-${artwork.id}`}>
    <h3>{artwork.title}</h3>
    <p>{artwork.artist}</p>
  </div>
);

describe('MediaLayout', () => {
  it('should render artworks with default title', () => {
    render(<MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />);

    expect(screen.getByText('Media Collection')).toBeInTheDocument();
    expect(screen.getByText('First Artwork')).toBeInTheDocument();
    expect(screen.getByText('Second Artwork')).toBeInTheDocument();
    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Artist Two')).toBeInTheDocument();
  });

  it('should render with custom title and subtitle', () => {
    render(
      <MediaLayout
        artworks={mockArtworks}
        renderItem={mockRenderItem}
        title='Custom Gallery'
        subtitle='A beautiful collection of artworks'
      />,
    );

    expect(screen.getByText('Custom Gallery')).toBeInTheDocument();
    expect(
      screen.getByText('A beautiful collection of artworks'),
    ).toBeInTheDocument();
  });

  it('should render empty state when no artworks', () => {
    render(<MediaLayout artworks={[]} renderItem={mockRenderItem} />);

    expect(screen.getByText('No items found.')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
  });

  it('should render custom empty message', () => {
    render(
      <MediaLayout
        artworks={[]}
        renderItem={mockRenderItem}
        emptyMessage='No artworks available'
      />,
    );

    expect(screen.getByText('No artworks available')).toBeInTheDocument();
  });

  it('should render without title when title is not provided', () => {
    render(
      <MediaLayout
        artworks={mockArtworks}
        renderItem={mockRenderItem}
        title=''
      />,
    );

    expect(screen.queryByText('Media Collection')).not.toBeInTheDocument();
    expect(screen.getByText('First Artwork')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = render(
      <MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />,
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass(
      'max-w-7xl',
      'mx-auto',
      'px-4',
      'sm:px-6',
      'lg:px-8',
      'py-8',
    );
  });

  it('should have correct title styling', () => {
    const { container } = render(
      <MediaLayout
        artworks={mockArtworks}
        renderItem={mockRenderItem}
        title='Test Title'
      />,
    );

    const title = container.querySelector('h1');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'mb-2');
  });

  it('should have correct subtitle styling', () => {
    const { container } = render(
      <MediaLayout
        artworks={mockArtworks}
        renderItem={mockRenderItem}
        title='Test Title'
        subtitle='Test Subtitle'
      />,
    );

    const subtitle = container.querySelector('p');
    expect(subtitle).toHaveClass('text-gray-600');
  });

  it('should render masonry grid', () => {
    render(<MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />);

    expect(screen.getByTestId('masonry-grid')).toBeInTheDocument();
    expect(screen.getByTestId('masonry-column')).toBeInTheDocument();
  });

  it('should render all artwork items', () => {
    render(<MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />);

    expect(screen.getByTestId('artwork-item-artwork-1')).toBeInTheDocument();
    expect(screen.getByTestId('artwork-item-artwork-2')).toBeInTheDocument();
  });

  it('should have correct empty state styling', () => {
    const { container } = render(
      <MediaLayout artworks={[]} renderItem={mockRenderItem} />,
    );

    const emptyContainer = container.querySelector('.text-center.p-12');
    expect(emptyContainer).toBeInTheDocument();
  });

  it('should have correct empty state icon styling', () => {
    const { container } = render(
      <MediaLayout artworks={[]} renderItem={mockRenderItem} />,
    );

    const iconContainer = container.querySelector(
      '.text-gray-400.text-6xl.mb-4',
    );
    expect(iconContainer).toBeInTheDocument();
  });

  it('should have correct empty state message styling', () => {
    const { container } = render(
      <MediaLayout artworks={[]} renderItem={mockRenderItem} />,
    );

    const message = container.querySelector(
      '.text-lg.font-medium.text-gray-900.mb-2',
    );
    expect(message).toBeInTheDocument();
  });

  it('should show correct count in footer', () => {
    render(
      <MediaLayout
        artworks={mockArtworks}
        renderItem={mockRenderItem}
        title='Artworks'
      />,
    );

    expect(screen.getByText('Showing 2 artworks')).toBeInTheDocument();
  });

  it('should show correct count with default title', () => {
    render(<MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />);

    expect(screen.getByText('Showing 2 media collection')).toBeInTheDocument();
  });

  it('should have correct footer styling', () => {
    const { container } = render(
      <MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />,
    );

    const footer = container.querySelector('.mt-12.text-center');
    expect(footer).toBeInTheDocument();
  });

  it('should have correct footer text styling', () => {
    const { container } = render(
      <MediaLayout artworks={mockArtworks} renderItem={mockRenderItem} />,
    );

    const footerText = container.querySelector('.text-gray-500.text-sm');
    expect(footerText).toBeInTheDocument();
  });

  it('should handle single artwork', () => {
    const singleArtwork = [mockArtworks[0]];

    render(
      <MediaLayout artworks={singleArtwork} renderItem={mockRenderItem} />,
    );

    expect(screen.getByText('First Artwork')).toBeInTheDocument();
    expect(screen.queryByText('Second Artwork')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 media collection')).toBeInTheDocument();
  });
});
