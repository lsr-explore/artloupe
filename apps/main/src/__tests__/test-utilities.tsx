/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type React from 'react';
import type { ReactElement } from 'react';

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data factories
export const createMockArtwork = (overrides = {}) => ({
  id: '1',
  title: 'Test Artwork',
  artist: 'Test Artist',
  imageUrl: 'https://example.com/image.jpg',
  description: 'Test description',
  metId: '123',
  ...overrides,
});

export const createMockArtworks = (count = 3) =>
  Array.from({ length: count }, (_, index) =>
    createMockArtwork({
      id: String(index + 1),
      title: `Test Artwork ${index + 1}`,
      artist: `Test Artist ${index + 1}`,
      imageUrl: `https://example.com/image${index + 1}.jpg`,
      description: `Test description ${index + 1}`,
      metId: String(100 + index),
    }),
  );

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { customRender as render };
