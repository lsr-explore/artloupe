export const NoArtworksFound = () => {
  return (
    <div className='text-center p-12'>
      <div className='text-gray-400 text-6xl mb-4'>🎨</div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>
        No artworks found
      </h3>
      <p className='text-gray-500'>
        Check your server connection and try again.
      </p>
    </div>
  );
};
