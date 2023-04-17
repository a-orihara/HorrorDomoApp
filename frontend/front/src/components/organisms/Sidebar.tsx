import Link from 'next/link';
import Button from '../atoms/Button';

const Sidebar = () => {
  return (
    <aside className='min-h-screen w-64 bg-gray-200 p-4'>
      <nav>
        <ul>
          <li className='mb-2'>
            <Link href='/profile'>
              <a>
                <Button className='w-full text-left'>Profile</Button>
              </a>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href='/settings'>
              <a>
                <Button className='w-full text-left'>Settings</Button>
              </a>
            </Link>
          </li>
          {/* 他のリンクを追加 */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
