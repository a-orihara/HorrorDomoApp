import Link from 'next/link';
import { useEffect } from 'react';
import { useFollowContext } from '../../../contexts/FollowContext';

type FollowStatsProps = {
  userId: number | undefined;
};

const FollowStats = ({ userId }: FollowStatsProps) => {
  const { followingCount, followersCount, handleGetFollowingCountByUserId, handleGetFollowersCountByUserId } =
    useFollowContext();

  // 1
  useEffect(() => {
    handleGetFollowingCountByUserId(userId);
    handleGetFollowersCountByUserId(userId);
  }, [userId, handleGetFollowingCountByUserId, handleGetFollowersCountByUserId]);

  return (
    <div className='mb-4'>
      <Link href={`/users/${userId}/following`}>
        <a className='mr-4 text-xs hover:text-basic-pink md:text-base'>
          <span className='mr-2 underline'>{followingCount}</span>
          フォロー
        </a>
      </Link>
      <Link href={`/users/${userId}/followers`}>
        <a className='text-xs hover:text-basic-pink md:text-base'>
          <span className='mr-2 underline'>{followersCount}</span>
          フォロワー
        </a>
      </Link>
    </div>
  );
};

export default FollowStats;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- useEffect:コンポーネントの初回レンダリング時にのみ実行。依存配列で再実行。基本的に非同期処理はここに記載。
- `handleGetUserFollowingByUserId`は非同期関数なので、`useEffect`内で呼び出すべきです。
------------------------------------------------------------------------------------------------
useEffectの依存配列。例えばuserIdをコメントアウトすると警告が出る。
- 警告は `userId` が `useEffect` 内で使用されているが、依存関係の配列にされていないことを示す
- 依存関係の配列は、Reactに監視すべき値を伝えます。これらの値のいずれかが変更された場合、`useEffect`は再度実行。
- 例えば、`userId`が変更されたのに依存関係の配列にない場合、`useEffect`は実行されるべき時に実行されないかもしれ
ない。これは、異なるユーザーを見たときに、統計が正しく更新されない可能性があることを意味し、バグにつながる可能性があ
る。userId` を含めることで、`userId` が変更されるたびに `useEffect` が再実行して正しいイイネ数を取得するように
なります。これにより、表示されるデータが閲覧しているユーザーと同期した状態に保たれる。
- つまり、ユーザーを切り替えたときにイイネ数が正しく更新されるように、`useEffect`の依存配列に `userId` を追加する
ように警告が表示。その他の値をコメントアウトすると警告が出るのも同じ理由。
------------------------------------------------------------------------------------------------
- `useEffect`を用いることで、`userId`の変更時のみAPIからデータを取得し直します。これにより、不必要なAPIリクエ
ストを避けることができます。
------------------------------------------------------------------------------------------------
二つの方法の挙動の違いは以下の通りです：
- `useEffect`を使う方法：`useEffect`内で定義した関数は、コンポーネントがレンダリングされた後に実行されます。依
存配列に`userId`と`handleGetUserFollowingByUserId`を指定しているので、これらの値が変更されたときのみ関数が再
実行されます。
- 例えば`useEffect`内で`handleGetUserFollowingByUserId`を使わない方法：
`handleGetUserFollowingByUserId`はコンポーネントがレンダリングされるたびに実行されます。この方法では`userId`
の変更に関係なく、コンポーネントが再レンダリングされる度にAPIからデータを取得します。これはパフォーマンスに悪影響を
及ぼし、また意図しないデータ取得が行われる可能性があります。
*/
