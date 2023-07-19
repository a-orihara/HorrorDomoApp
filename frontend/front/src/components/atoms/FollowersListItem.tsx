import Link from 'next/link';
import { Follower } from '../../types/relationship';
import { User } from '../../types/user';

type FollowersListItemProps = {
  // 非同期データ取得の前には、結果がまだ取得されていない（すなわちundefined）可能性がある
  follower: Follower;
  user: User;
};

// followersはフォローしているユーザーの配列
export const FollowersListItem = ({ follower, user }: FollowersListItemProps) => {
  console.log(`そ:${JSON.stringify(follower)}`);
  return (
    <div>
      <li className='my-px flex flex-row justify-center divide-y divide-slate-200'>
        <Link href={`/users/${follower.id}`}>
          <a>
            <img
              src={user.avatarUrl || '/no_image_square.jpg'}
              alt='user avatar'
              className='mr-4 mt-2 h-16 w-16 rounded-full'
            />
          </a>
        </Link>
        <div className='flex  items-center justify-center'>
          <Link href={`/users/${follower.id}`}>
            <a className='ml-4  text-sm text-black text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
              {follower.name}
            </a>
          </Link>
        </div>
      </li>
    </div>
  );
};
