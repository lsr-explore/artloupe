import type { Decorator, Preview } from '@storybook/react';
// Import CSS from all packages
import '../packages/palette-studio/src/index.css';
import '../packages/media-display/src/components/media-layout.css';
import '../apps/main/src/app/globals.css';

// Optional: mock `next/image` to render as <img /> in Storybook
import NextImage, * as MockImage from 'next/image';
import NextLink, * as MockLink from 'next/link';

// // This mock helps avoid SSR/Image optimization issues in Storybook
// Object.defineProperty(NextImage, "default", {
// 	configurable: true,
// 	value: (properties: any) => {
// 		return <img {...properties} alt={properties.alt || ""} />;
// 	},
// });

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: MockImage,
});

Object.defineProperty(NextLink, 'default', {
  configurable: true,
  value: MockLink,
});

export const decorators: Decorator[] = [
  (Story) => (
    // <QueryClientProvider client={queryClient}>
    <div className='p-4'>
      <Story />
    </div>
    // </QueryClientProvider>
  ),
];

// Optional: You can add global decorators here for layout or providers
// For example, if you use React Query or ThemeProvider

const preview: Preview = {
  decorators,
  parameters: {
    layout: 'centered', // "padded" | "fullscreen" | "centered"
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
