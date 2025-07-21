export const Footer = () => {
  return (
    <footer className='bg-gray-100 text-gray-600 text-sm p-6'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center'>
        <p className='mb-4 md:mb-0'>
          &copy; {new Date().getFullYear()} ArtLoupe.ai. All rights reserved.
        </p>
        <div className='space-x-4'>
          <a href='/info/accessibility' className='hover:underline'>
            Accessibility Statement
          </a>
          <a href='/info/privacy' className='hover:underline'>
            Privacy Policy
          </a>
          <a href='/info/about' className='hover:underline'>
            About
          </a>
        </div>
      </div>
      <div className='text-center mt-4 italic text-gray-400'>
        Enhancing human vision with the lens of AI.
      </div>
    </footer>
  );
};
