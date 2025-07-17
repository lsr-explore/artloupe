# Storybook Setup

This project includes Storybook for both the `palette-studio` and `media-display` packages.

## Available Scripts

### Top-level scripts (run from project root)

- `npm run storybook` - Start both storybooks concurrently
- `npm run storybook:palette-studio` - Start only palette-studio storybook (port 6006)
- `npm run storybook:media-display` - Start only media-display storybook (port 6007)
- `npm run build-storybook` - Build both storybooks
- `npm run build-storybook:palette-studio` - Build only palette-studio storybook
- `npm run build-storybook:media-display` - Build only media-display storybook

### Package-level scripts

Each package has its own storybook scripts:
- `npm run storybook` - Start storybook dev server
- `npm run build-storybook` - Build storybook for production

## Package-specific Storybooks

### Palette Studio (`packages/palette-studio`)

**Port:** 6006

**Components:**
- `LoadingSpinner` - A loading spinner component with various styling options

**Stories:**
- Default - Basic loading spinner
- WithCustomStyling - Spinner with custom background styling
- InContainer - Spinner within a bordered container

### Media Display (`packages/media-display`)

**Port:** 6007

**Components:**
- `ArtworkPanel` - Displays artwork information in a card format
- `PhotoPanel` - Displays photo information in a card format
- `MediaLayout` - Layout component for displaying collections of media items
- `MediaArtContainer` - Container component that uses context to display media

**Stories:**

#### ArtworkPanel
- Default - Basic artwork display
- WithLongTitle - Artwork with long title to test text overflow
- WithLongDescription - Artwork with long description
- WithoutImage - Artwork without image (shows placeholder)
- WithoutArtist - Artwork without artist information
- WithoutDescription - Artwork without description
- MultipleArtworks - Grid of multiple artwork panels

#### PhotoPanel
- Default - Basic photo display
- WithLongTitle - Photo with long title
- WithLongDescription - Photo with long description
- WithoutImage - Photo without image
- WithoutArtist - Photo without artist information
- WithoutDescription - Photo without description
- MultiplePhotos - Grid of multiple photo panels

#### MediaLayout
- WithArtworks - Layout with artwork collection
- WithPhotos - Layout with photo collection
- EmptyState - Empty state with custom message
- WithCustomEmptyMessage - Empty state with different message
- WithoutTitle - Layout without title
- WithLongTitle - Layout with very long title

#### MediaArtContainer
- WithArtworks - Container with artwork data
- WithPhotos - Container with photo data
- Loading - Loading state
- ErrorState - Error state
- Empty - Empty state

## Development

### Adding new stories

1. Create a `.stories.tsx` file in the component's directory
2. Import the component and any necessary mock data
3. Define the meta object with component metadata
4. Create story exports for different scenarios

### Mock Data

Mock data is located in `packages/media-display/src/__stories__/mock-data.ts` and includes:
- `mockArtworks` - Array of artwork objects for testing
- `mockPhotoArtworks` - Array of photo objects for testing

### Context Mocking

For components that use React Context (like `MediaArtContainer`), use decorators to provide mock context values:

```tsx
export const WithData: Story = {
  decorators: [
    (Story) => (
      <MediaSourceContext.Provider value={mockContextValue}>
        <Story />
      </MediaSourceContext.Provider>
    ),
  ],
};
```

## Configuration

### Storybook Configuration Files

- `packages/palette-studio/.storybook/main.ts` - Main configuration
- `packages/palette-studio/.storybook/preview.ts` - Preview configuration
- `packages/media-display/.storybook/main.ts` - Main configuration
- `packages/media-display/.storybook/preview.ts` - Preview configuration

### CSS Imports

- Palette Studio imports `packages/palette-studio/src/index.css`
- Media Display imports `packages/media-display/src/components/media-layout.css`

## Troubleshooting

### Port Conflicts
If you get port conflicts, you can run storybooks individually:
- `npm run storybook:palette-studio` (port 6006)
- `npm run storybook:media-display` (port 6007)

### Build Issues
If you encounter build issues:
1. Ensure all dependencies are installed: `npm install`
2. Build packages first: `npm run build:packages`
3. Clear caches: `npm run clean:caches`

### TypeScript Errors
If you see TypeScript errors in stories:
1. Ensure proper type imports
2. Check that mock data matches expected interfaces
3. Verify context types match component expectations 