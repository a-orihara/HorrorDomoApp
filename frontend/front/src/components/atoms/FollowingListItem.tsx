import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGetUserById from '../../hooks/user/useGetUserById';
import { FollowUser } from '../../types/relationship';

type FollowingListItemProps = {
  // 非同期データ取得の前には、結果がまだ取得されていない（すなわちundefined）可能性がある
  following: FollowUser[] | undefined;
};

// followingはフォローしているユーザーの配列
export const FollowingListItem = ({ following }: FollowingListItemProps) => {
  // 選択したidに紐付くuserとpostsを取得

  const router = useRouter();
  // 1 Next.js の useRouter フックから取得したルーターオブジェクトのプロパティで、URL クエリパラメータを含む
  const { id } = router.query;
  // userIdはnumberかundefined型
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // ルーターパラメーターのidに対応するユーザー情報を取得
  const { user, handleGetUserById } = useGetUserById(userId);
  if (following) {
    const fa = following[0];
    console.log(fa);
  }

  useEffect(() => {
    handleGetUserById();
  }, [id, handleGetUserById]);

  // 1
  if (!user) {
    return <div>Loading...</div>;
  }

  return following ? (
    <div>
      <p>FollowingListItem</p>
      <ol>
        {following.map((followUser) => (
          <div key={followUser.id}>
            <p>{followUser.name}</p>
          </div>
        ))}
      </ol>
      <p>{following[0].name}</p>
      <li>
        <Link href={`/users/${following[0].id}`}>
          <a>
            <img
              src={user.avatarUrl || '/no_image_square.jpg'}
              alt='user avatar'
              className='mt-2 h-16 w-16 rounded-full'
            />
          </a>
        </Link>
        <p>
          <Link href={`/users/${user.id}`}>
            <a className='text-xs lg:text-base lg:tracking-wider'>{user.name}</a>
          </Link>
        </p>
      </li>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
if(!id) { return; }は何も画面に表示されません。return文が実行されると、以降の処理は行われずに関数が終了します。
しかし、それはエラーではありません。存在しないidに対するデータ取得を防ぐ正常な動作です。
------------------------------------------------------------------------------------------------
- Reactでは、非同期に取得するデータを格納するためのState（ここでは`following`）が更新されると、コンポーネント
が再描画されます。したがって、最初に`following`が`undefined`であったときには`<div>表示できません</div>`が表示
され、後に`following`が更新されて`undefined`でなくなると、コンポーネントが再描画されて新しい内容（フォローしてい
るユーザーのリスト）が表示されます。

- この動作は開発環境と本番環境で変わらないです。ReactのStateの更新による再描画の動作は、開発環境と本番環境の両方
で同じように動作します。ただし、非同期処理の速度はネットワークの状態やサーバーの応答速度などにより異なるため、データ
が表示されるまでの時間は環境により異なる可能性があります。

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
