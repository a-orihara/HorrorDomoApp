// type FooterProps = React.ComponentProps<'footer'>;

const Footer = () => {
  return (
    <footer className='basic-border flex h-8 items-center justify-center bg-basic-yellow text-sm text-black outline md:h-12'>
      <h1>© 2023 ori</h1>
    </footer>
  );
};

export default Footer;

/*
@          @@          @@          @@          @@          @@          @@          @@          @

// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">&copy; 2023 YourAppName. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

*/
