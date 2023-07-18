import Link from 'next/link';
import { FollowUser } from '../../types/relationship';
import { User } from '../../types/user';

type FollowingListItemProps = {
  // 非同期データ取得の前には、結果がまだ取得されていない（すなわちundefined）可能性がある
  followUser: FollowUser;
  user: User;
};

// followingはフォローしているユーザーの配列
export const FollowingListItem = ({ followUser, user }: FollowingListItemProps) => {
  console.log(`そ:${JSON.stringify(followUser)}`);
  return (
    <div>
      <li className='my-px border-4 border-solid border-orange-200'>
        <div className='flex'>
          <Link href={`/users/${followUser.id}`}>
            <a>
              <img
                src={user.avatarUrl || '/no_image_square.jpg'}
                alt='user avatar'
                className='mt-2 h-16 w-16 rounded-full'
              />
            </a>
          </Link>
          <div>
            <p>
              <Link href={`/users/${followUser.id}`}>
                <a className='text-sm text-black  text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
                  {followUser.name}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </li>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @


================================================================================================
ここFollowingPageの
[{"id":3,
"provider":"email",
"uid":"soso@soso.com",
"allowPasswordChange":false,
"name":"soso",
"email":"soso@soso.com",
"createdAt":"2023-07-15T03:16:00.160Z",
"updatedAt":"2023-07-15T03:16:00.160Z",
"admin":false,
"profile":"撃つ日欧掛けるしょうゆおとといあおい半額救急車さいぼうひかくするがいよう先ずほひんきゃく出版窓平安むこう長唄おどろく。"},
*/