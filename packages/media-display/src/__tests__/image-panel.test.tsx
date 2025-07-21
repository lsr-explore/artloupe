import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { ImageType } from '../../../shared-types/src/types/image-type';
import { mockImageTypes } from '../__stories__/mock-data';
import { ImagePanel } from '../components/image-panel';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
    onError,
    ...properties
  }: {
    src: string;
    alt: string;
    className?: string;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    [key: string]: unknown;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      {...properties}
    />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...properties
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...properties}>
      {children}
    </a>
  ),
}));

const mockImage: ImageType = mockImageTypes[0];
const mockImageWithoutImage: ImageType = { ...mockImageTypes[2], imageUrl: '' };

describe('ImagePanel', () => {
  it('should render image panel with image', () => {
    render(<ImagePanel image={mockImage} />);
    expect(screen.getByText(mockImage.title)).toBeInTheDocument();
    expect(screen.getByText(mockImage.artist!)).toBeInTheDocument();
    expect(screen.getByText(mockImage.description!)).toBeInTheDocument();
    expect(screen.getByText(`ID: ${mockImage.id}`)).toBeInTheDocument();
    expect(screen.getByText('Analyze Image')).toBeInTheDocument();
  });

  it('should render image panel without image', () => {
    render(<ImagePanel image={mockImageWithoutImage} />);
    expect(screen.getByText(mockImageWithoutImage.title)).toBeInTheDocument();
    expect(screen.getByText(mockImageWithoutImage.artist!)).toBeInTheDocument();
    expect(
      screen.getByText(mockImageWithoutImage.description!),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`ID: ${mockImageWithoutImage.id}`),
    ).toBeInTheDocument();
    expect(screen.getByText('🖼️')).toBeInTheDocument();
  });

  it('should have correct CSS classes for card styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-md',
      'overflow-hidden',
      'hover:shadow-lg',
      'transition-shadow',
      'duration-300',
    );
  });

  it('should render image with correct attributes', () => {
    render(<ImagePanel image={mockImage} />);
    const image = screen.getByAltText(mockImage.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImage.imageUrl);
    expect(image).toHaveClass('w-full', 'h-full', 'object-cover');
  });

  it('should have correct link structure for analyze button', () => {
    render(<ImagePanel image={mockImage} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      `/images/analyze/${mockImage.id}?imageUrl=${encodeURIComponent(mockImage.imageUrl)}&title=${encodeURIComponent(mockImage.title)}&artist=${encodeURIComponent(mockImage.artist || '')}&description=${encodeURIComponent(mockImage.description || '')}&id=${mockImage.id}`,
    );
  });

  it('should have correct button styling', () => {
    render(<ImagePanel image={mockImage} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-indigo-500',
      'text-white',
      'text-xs',
      'px-4',
      'py-2',
      'rounded',
      'hover:bg-indigo-600',
      'transition-colors',
      'duration-200',
      'font-medium',
    );
  });

  it('should handle image with missing optional fields', () => {
    const minimalImage: ImageType = {
      id: 'minimal-1',
      title: 'Minimal Image',
      artist: '',
      imageUrl: '',
      description: '',
      source: 'met',
    };
    render(<ImagePanel image={minimalImage} />);
    expect(screen.getByText('Minimal Image')).toBeInTheDocument();
    expect(screen.getByText('ID: minimal-1')).toBeInTheDocument();
    expect(screen.getByText('Analyze Image')).toBeInTheDocument();
  });

  it('should have correct image container styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const imageContainer = container.querySelector('.bg-gray-200');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass(
      'bg-gray-200',
      'relative',
      'aspect-[4/3]',
      'h-48',
    );
  });

  it('should have correct content container styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const contentContainer = container.querySelector('.p-4');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should have correct title styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const title = container.querySelector('h3');
    expect(title).toHaveClass(
      'font-semibold',
      'text-lg',
      'text-gray-900',
      'mb-1',
      'line-clamp-2',
    );
  });

  it('should have correct artist styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const artist = container.querySelector('p');
    expect(artist).toHaveClass('text-gray-600', 'text-sm', 'mb-2');
  });

  it('should have correct description styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const description = container.querySelectorAll('p')[1];
    expect(description).toHaveClass(
      'text-gray-500',
      'text-xs',
      'mb-4',
      'line-clamp-2',
    );
  });

  it('should have correct action container styling', () => {
    const { container } = render(<ImagePanel image={mockImage} />);
    const actionContainer = container.querySelector(
      '.flex.justify-between.items-center',
    );
    expect(actionContainer).toBeInTheDocument();
  });
});
