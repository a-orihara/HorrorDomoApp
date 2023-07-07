import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useAuthContext();
  // ================================================================================================
  return (
    <aside className='basic-border h-full bg-basic-purple p-4'>
      <nav className='h-full '>
        <ul className='flex h-full flex-row items-center justify-around  text-white md:flex md:flex-col md:text-2xl'>
          <h1 className=' text-black md:mb-4'>Account</h1>
          <li className='md:mb-4'>
            <Link href={`/users/${currentUser?.id}/edit`}>
              <a className='w-40 text-left hover:text-basic-pink'>Settings</a>
            </Link>
          </li>
          <li className='md:mb-4'>
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
