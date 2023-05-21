import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  // ================================================================================================
  return (
    <aside className='basic-border h-full w-32 bg-basic-purple p-4 md:w-48'>
      <nav className='h-full'>
        <ul className='flex  h-full flex-col items-center justify-around bg-basic-purple text-white md:text-2xl'>
          <h1 className='mb-2 text-black'>Account</h1>
          <li className='mb-2'>
            <Link href={`/users/${currentUser?.id}/edit`}>
              <a className='w-40 text-left hover:text-basic-pink'>Settings</a>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href='/users/'>
              <a className='w-40 text-left hover:text-basic-pink'>Users</a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
