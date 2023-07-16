import Link from 'next/link';
import { useRouter } from 'next/router';
import useGetUserById from '../../hooks/user/useGetUserById';
import { Following } from '../../types/relationship';

type FollowingListItemProps = {
  following: Following;
};

// followingはフォローしているユーザーの配列
export const FollowingListItem = ({ following }: FollowingListItemProps) => {
  // 選択したidに紐付くuserとpostsを取得

  const router = useRouter();
  // 1
  const { id } = router.query;
  const { user, handleGetUserById } = useGetUserById(id);
  return (
    <div>
      <p>FollowingListItem</p>
      <p>{following.name}</p>
      <li>
        <Link href={`/users/${following.id}`}>
          <a>
            <img
              src={user.avatarUrl || '/no_image_square.jpg'}
              alt='user avatar'
              className='mt-2 h-16 w-16 rounded-full'
            />
          </a>
        </Link>
      </li>
    </div>
  );
};

/*
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
