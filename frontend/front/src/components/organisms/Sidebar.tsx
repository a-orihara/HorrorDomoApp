import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(`カレント：${JSON.stringify(currentUser, null, 2)}`);
  return (
    <aside className='basic-border h-full w-48 bg-basic-purple p-4'>
      <nav className='h-full'>
        <ul className='flex  h-full flex-col items-center justify-around bg-basic-purple text-white'>
          <h1 className='mb-2'>Acount</h1>
          {/* <li className='mb-2'>
            <Link href='/'>
              <a className='w-40 text-left'>Profile</a>
            </Link>
          </li> */}
          <li className='mb-2'>
            <Link href={`/user/${currentUser?.id}/edit`}>
              <a className='w-40 text-left hover:text-basic-pink'>Settings</a>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href='/'>
              <a className='w-40 text-left hover:text-basic-pink'>Users</a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
