import Link from 'next/link';
import { useEffect } from 'react';
import { useFollowContext } from '../../../contexts/FollowContext';

type FollowStatsProps = {
  userId: number | undefined;
};

const FollowStats = ({ userId }: FollowStatsProps) => {
  const { followingCount, followersCount, handleGetFollowingCountByUserId, handleGetFollowersCountByUserId } =
    useFollowContext();

  useEffect(() => {
    // console.log('FollowStatsのuseEffectが呼ばれました');
    handleGetFollowingCountByUserId(userId);
    handleGetFollowersCountByUserId(userId);
  }, [userId, handleGetFollowingCountByUserId, handleGetFollowersCountByUserId]);
  // 1 handleGetUserFollowingByUserId();

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
適切なのは`useEffect`を使用する方法です。理由は以下の通りです：
- 非同期処理は副作用として扱われ、Reactでは副作用を扱うために`useEffect`を用います。
`handleGetUserFollowingByUserId`は非同期関数なので、`useEffect`内で呼び出すべきです。
- `useEffect`を用いることで、`userId`の変更時のみAPIからデータを取得し直します。これにより、不必要なAPIリクエ
ストを避けることができます。
------------------------------------------------------------------------------------------------
二つの方法の挙動の違いは以下の通りです：
- `useEffect`を使う方法：`useEffect`内で定義した関数は、コンポーネントがレンダリングされた後に実行されます。依
存配列に`userId`と`handleGetUserFollowingByUserId`を指定しているので、これらの値が変更されたときのみ関数が再
実行されます。
- `useEffect`を使わない方法：`handleGetUserFollowingByUserId`はコンポーネントがレンダリングされるたびに実行
されます。この方法では`userId`の変更に関係なく、コンポーネントが再レンダリングされる度にAPIからデータを取得します。
これはパフォーマンスに悪影響を及ぼし、また意図しないデータ取得が行われる可能性があります。

*/