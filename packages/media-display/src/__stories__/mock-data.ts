import type { ImageType } from '@artloupe/shared-types';

export const mockImageTypes: ImageType[] = [
  {
    id: 'img-1',
    title: 'Sunrise Over Mountains',
    artist: 'Jane Doe',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    description: 'A beautiful sunrise over the mountain range.',
    source: 'met',
    metId: '12345',
    aiAnalysis: 'Bright colors, serene landscape.',
  },
  {
    id: 'img-2',
    title: 'City Lights',
    artist: 'John Smith',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    description: 'Night view of a city illuminated by lights.',
    source: 'pexels',
    aiAnalysis: 'Urban, vibrant, energetic.',
  },
  {
    id: 'img-3',
    title: 'Forest Path',
    artist: 'Alex Green',
    imageUrl: '',
    description: 'A quiet path through a dense forest.',
    source: 'met',
    metId: '67890',
    aiAnalysis: 'Calm, natural, green hues.',
  },
];
