import Link from 'next/link';
import { FollowUser } from '../../types/relationship';
import { User } from '../../types/user';

type FollowListItemProps = {
  // 非同期データ取得の前には、結果がまだ取得されていない（すなわちundefined）可能性がある
  targetUser: FollowUser;
  user: User;
};

export const FollowListItem = ({ targetUser, user }: FollowListItemProps) => {
  return (
    <div>
      <li className='my-px flex flex-row justify-center divide-y divide-slate-200 '>
        <Link href={`/users/${targetUser.id}`}>
          <a>
            <img
              src={user.avatarUrl || '/no_image_square.jpg'}
              alt='user avatar'
              className='mr-4 mt-2 h-16 w-16 rounded-full'
            />
          </a>
        </Link>
        <div className='flex  items-center justify-center'>
          <Link href={`/users/${targetUser.id}`}>
            <a className='ml-4  text-sm text-black text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
              {targetUser.name}
            </a>
          </Link>
        </div>
      </li>
    </div>
  );
};
