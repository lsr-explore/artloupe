export const mockAnalysisResult = {
  result:
    'This artwork demonstrates exceptional use of color and composition, characteristic of the Post-Impressionist movement.',
};

export const mockErrorResponse = {
  error: 'Something went wrong',
  message: 'An unexpected error occurred',
};

export const mockApiResponse = {
  success: true,
  data: {
    id: 1,
    message: 'Test response',
  },
};

export const mockOpenAiResponse = {
  choices: [
    {
      message: {
        content: 'This is a test critique of the artwork.',
      },
    },
  ],
};

export const mockMetMuseumResponse = {
  total: 1,
  objectIDs: [1, 2, 3],
  objects: [
    {
      objectID: 1,
      title: 'Test Artwork',
      artist: 'Test Artist',
      primaryImage: 'https://example.com/image.jpg',
      department: 'Paintings',
      culture: 'American',
      period: '19th century',
      medium: 'Oil on canvas',
      dimensions: '24 x 36 in.',
      objectDate: '1850',
      creditLine: 'Gift of Test Donor',
      repository: 'Metropolitan Museum of Art',
    },
  ],
};

export const mockPexelsResponse = {
  photos: [
    {
      id: 1,
      url: 'https://example.com/photo1.jpg',
      src: {
        medium: 'https://example.com/photo1-medium.jpg',
        large: 'https://example.com/photo1-large.jpg',
      },
      photographer: 'Test Photographer',
      alt: 'Test photo description',
    },
  ],
};
