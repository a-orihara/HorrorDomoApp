import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useAuthContext();
  // ================================================================================================
  return (
    <aside className='basic-border bg-basic-purple  py-4 lg:h-full lg:w-48'>
      <nav className=''>
        <ul className='flex flex-row items-center justify-around  text-white lg:flex lg:flex-col lg:justify-start lg:text-2xl'>
          <h1 className=' text-black lg:mb-4 lg:mt-20'>Account</h1>
          <li className='lg:mb-4 lg:mt-32'>
            <Link href={`/users/${currentUser?.id}/edit`}>
              <a className='w-40 text-left hover:text-basic-pink'>Settings</a>
            </Link>
          </li>
          <li className='lg:mb-4 lg:mt-32'>
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
