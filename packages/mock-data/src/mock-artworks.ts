import type { ImageType } from '@artloupe/shared-types';

export const mockArtwork: ImageType = {
  id: '1',
  title: 'The Starry Night',
  artist: 'Vincent van Gogh',
  description: 'A famous painting depicting a swirling night sky',
  imageUrl: 'https://example.com/starry-night.jpg',
  aiAnalysis:
    "This masterpiece showcases Van Gogh's distinctive style with bold brushstrokes and vibrant colors.",
  source: 'met',
};

export const mockArtworks: ImageType[] = [
  mockArtwork,
  {
    id: '2',
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    description: 'A portrait painting of Lisa Gherardini',
    imageUrl: 'https://example.com/mona-lisa.jpg',
    source: 'met',
  },
  {
    id: '3',
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    description: 'A woodblock print depicting a large wave',
    imageUrl: 'https://example.com/great-wave.jpg',
    source: 'met',
  },
];
