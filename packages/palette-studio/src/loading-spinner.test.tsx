import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading artworks...')).toBeInTheDocument();
  });

  it('should have correct CSS classes for centering', () => {
    const { container } = render(<LoadingSpinner />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'min-h-64',
    );
  });

  it('should have animated spinner with correct classes', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-b-2',
      'border-blue-600',
      'mx-auto',
    );
  });

  it('should have correct text styling', () => {
    const { container } = render(<LoadingSpinner />);

    const text = container.querySelector('p');
    expect(text).toHaveClass('mt-4', 'text-gray-600');
    expect(text).toHaveTextContent('Loading artworks...');
  });
});
