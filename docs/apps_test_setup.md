# Test Setup Documentation

## Overview

This document explains the comprehensive test setup for the ArtworkGrid components using Vitest with React Testing Library.

## Test Structure

### Files Created

1. **Test Configuration**:
   - `vitest.config.ts` - Vitest configuration with React plugin
   - `src/__tests__/setup.ts` - Global test setup with mocks and testing library setup

2. **Test Files**:
   - `src/components/ArtworkGrid/__tests__/ArtworkGrid.test.tsx` (9 tests)
   - `src/components/ArtworkGrid/__tests__/ArtworkGridDataProvider.test.tsx` (4 tests)

3. **Supporting Files**:
   - `src/data-providers/index.tsx` - Data provider exports for the app (TSX for JSX support)
   - `src/__tests__/test-utils.tsx` - Reusable test utilities (for future use)

## Test Coverage

### ArtworkGrid Component (9 tests):
- ✅ Renders empty state message 
- ✅ Renders grid structure and headers
- ✅ Displays artwork information correctly
- ✅ Shows emoji placeholder for missing images
- ✅ Renders analyze buttons for each artwork
- ✅ Handles AI analysis button clicks and API calls
- ✅ Shows loading state during analysis
- ✅ Displays AI analysis results
- ✅ Handles image load errors
- ✅ Shows correct footer with artwork count

### ArtworkGridDataProvider Component (4 tests):
- ✅ Shows loading spinner during data fetch
- ✅ Displays error component on fetch failure
- ✅ Renders ArtworkGrid with data when loaded
- ✅ Calls useMetSearch hook with correct parameters

## Coverage Results
- **ArtworkGrid.tsx**: 91.66% statement coverage
- **ArtworkGridDataProvider.tsx**: 100% statement coverage

## Key Features Tested

### Component Integration
- Full integration between ArtworkGridDataProvider and ArtworkGrid
- Proper data flow from hook to component
- Error handling and loading states

### User Interactions
- Button clicks and API calls
- Image error handling
- Responsive design elements

### Data Handling
- Mock artwork data with realistic structure
- Empty state handling
- API response simulation

## Mocking Strategy

### External Dependencies
- **Next.js Image**: Mocked to render simple img tags for testing
- **Next.js Link**: Mocked to render anchor tags
- **Global fetch**: Mocked for API call testing
- **React Query**: Uses real implementation with test client
- **Error components**: Mocked for clean test output

### Mock Data
```typescript
const mockArtworks = [
  {
    id: "1",
    title: "Sunflowers",
    artist: "Vincent van Gogh",
    imageUrl: "https://example.com/sunflowers.jpg",
    description: "A painting of sunflowers by Vincent van Gogh",
    metId: "123",
  },
  // ... more artworks
];
```

## Running Tests

### Commands Available:
```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# Coverage report
npm run test:coverage

# From project root
npm run test:main
npm run test:main:coverage
```

### Expected Output:
```
Test Files  2 passed (2)
Tests  13 passed (13)
```

## Dependencies Installed

- `@testing-library/user-event` - For user interaction simulation
- `@vitejs/plugin-react` - For React JSX transformation in tests

## Build Fixes Applied

### Next.js Configuration Fix
- Removed deprecated `appDir: true` from `next.config.js` experimental options
- Next.js 14 has app directory stable by default

### JSX Compilation Fix
- Renamed `src/data-providers/index.ts` to `index.tsx` for JSX support
- Added React import for JSX components
- Fixed QueryClient import for proper TypeScript compilation

### Coverage Report Improvements
- Excluded `.next/`, `coverage/`, and test-related files from coverage
- Added exclusions for build artifacts and development files
- Cleaner coverage reports focusing on actual source code

## Configuration Notes

### Vitest Setup:
- JSdom environment for browser simulation
- React plugin for JSX support
- Global test utilities available
- Coverage with v8 provider
- Setup files for mocks and globals

### Alias Configuration:
- `@` points to `src/` directory
- `data-providers` points to `src/data-providers`

## Future Enhancements

### Potential Test Additions:
1. **Edge Cases**: Test with malformed data, network failures
2. **Accessibility**: Add a11y testing with @testing-library/jest-dom
3. **Visual Regression**: Add screenshot testing for UI consistency
4. **Performance**: Add tests for component render performance
5. **E2E Integration**: Connect with existing Cypress tests

### Mock Improvements:
1. **More Realistic API Responses**: Add delay simulation, error scenarios
2. **Image Loading**: Test actual image loading behavior
3. **State Management**: Test more complex state scenarios

## Troubleshooting

### Common Issues:
1. **Mock Conflicts**: Ensure Next.js components are mocked before imports
2. **React Query**: Use separate QueryClient instances for each test
3. **Async Operations**: Always use `waitFor` for async state changes
4. **Coverage Exclusions**: Build files and generated code are excluded

### Debug Tips:
- Use `screen.debug()` to see rendered output
- Check mock function calls with `expect(mockFn).toHaveBeenCalledWith(...)`
- Use `--ui` flag for interactive debugging
