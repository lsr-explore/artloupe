// Mock data for palette-studio components
export const mockColorPalette = [
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
];

export const mockImageData = {
  width: 300,
  height: 200,
  dominantColors: mockColorPalette,
  palette: mockColorPalette.map((color, index) => ({
    color,
    percentage: Math.floor(Math.random() * 30) + 5,
    index,
  })),
};
