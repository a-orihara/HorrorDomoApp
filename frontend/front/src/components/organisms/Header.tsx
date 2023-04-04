import React from 'react';
import Navigation from '../molecules/Navigation';

const Header = () => {
  return (
    <header className='text-s  flex h-16 flex-row items-center justify-around  bg-basic-yellow font-spacemono font-semibold outline md:text-2xl'>
      <div className=' flex-grow'>
        <h1 className=' text-s ml-3 mr-auto text-center font-spacemono font-semibold tracking-tighter md:text-4xl'>
          Horror Domo App
        </h1>
      </div>
      <div className='mr-8 flex-grow'>
        <Navigation></Navigation>
      </div>
    </header>
  );
};

export default Header;

/*
@          @@        @@          @@          @@          @@          @@          @@          @
// components/Header.tsx
import React from 'react';
import Navigation from './Navigation';

const Header: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="container mx-auto px-4 py-2">
        <Navigation isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
};

export default Header;


*/
