import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className='basic-border h-full w-48 bg-basic-purple p-4'>
      <nav className='h-full'>
        <ul className='flex  h-full flex-col items-center justify-around bg-basic-purple text-white'>
          <h1 className='mb-2'>MyProfile</h1>
          {/* <li className='mb-2'>
            <Link href='/'>
              <a className='w-40 text-left'>Profile</a>
            </Link>
          </li> */}
          <li className='mb-2'>
            <Link href='/'>
              <a className='w-40 text-left hover:text-basic-pink'>Settings</a>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href='/'>
              <a className='w-40 text-left hover:text-basic-pink'>Users</a>
            </Link>
          </li>
          {/* 他のリンクを追加 */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
