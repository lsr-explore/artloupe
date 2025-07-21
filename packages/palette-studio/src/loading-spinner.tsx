import './index.css';

export const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center min-h-64'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Loading artworks...</p>
      </div>
    </div>
  );
};
