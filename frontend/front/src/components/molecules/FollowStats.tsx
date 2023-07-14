import Link from 'next/link';
import { useEffect } from 'react';
import { useGetUserFollowersByUserId } from '../../hooks/relationship/useGetUserFollowersByUserId';
import { useGetUserFollowingByUserId } from '../../hooks/relationship/useGetUserFollowingByUserId';
const FollowStats = ({ userId }: { userId: number }) => {
  const { followingCount, handleGetUserFollowingByUserId } = useGetUserFollowingByUserId(userId);
  const { followersCount, handleGetUserFollowersByUserId } = useGetUserFollowersByUserId(userId);

  useEffect(() => {
    handleGetUserFollowingByUserId();
    handleGetUserFollowersByUserId();
  }, [userId, handleGetUserFollowingByUserId, handleGetUserFollowersByUserId]);
  // 1 handleGetUserFollowingByUserId();

  return (
    <div>
      <Link href={'/'}>
        <a className='hover:text-basic-pink'>
          フォロー
          <span className='underline'>{followingCount}</span>
        </a>
      </Link>
      <Link href={'/'}>
        <a className='hover:text-basic-pink'>
          フォロワー
          <span className='underline'>{followersCount}</span>
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
