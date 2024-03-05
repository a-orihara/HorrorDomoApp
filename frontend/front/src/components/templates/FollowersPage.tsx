import { useRouter } from 'next/router';
// import { useEffect } from 'react';
import { useFollowersPagination } from '../../hooks/follow/useFollowersPagination';
// import useGetUserById from '../../hooks/user/useGetUserById';
import Pagination from '../molecules/Pagination';
import { FollowList } from '../organisms/list/FollowList';

const FollowersPage = () => {
  const router = useRouter();
  // 1 Next.js の useRouter フックから取得したルーターオブジェクトのプロパティで、URL クエリパラメータを含む
  const { id } = router.query;
  // 2 userIdはnumberかundefined型
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // ルーターパラメーターのidに対応するユーザーのフォローユーザー情報を取得
  const { followers, totalFollowersCount, handlePageChange, isLoading, currentPage } = useFollowersPagination(10, userId);
  // isLoadingがtrue(loading中)のときに "Loading... "をレンダ。
  if (isLoading) {
    return <div className='flex flex-1 items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='flex flex-1 flex-col'>
      <FollowList followUsers={followers} title={'All Followers'} noFollowMessage={'フォロワーはいません'}></FollowList>
      <Pagination totalCount={totalFollowersCount} itemsPerPage={10} handlePageChange={handlePageChange} currentPage={currentPage}></Pagination>
    </div>
  );
};

export default FollowersPage;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1

================================================================================================
2
- `id` の型が文字列であり、かつ `Number(id)` が NaN (非数) ではない場合、つまり `id` が数値の文字列である場
合に、`Number(id)` を `userId` に代入します。そうでない場合は `undefined` を代入します。
- 具体的には、条件演算子（三項演算子） `condition ? trueValue : falseValue` を使用しています。`condition`
の評価結果が真の場合は `trueValue` を、偽の場合は `falseValue` を返します。
- この式の目的は、`id` の値が数値の文字列である場合にその数値を取得し、それ以外の場合には `undefined` を設定す
ることです。
------------------------------------------------------------------------------------------------
例えば、`id` の値が `"123"` の場合、`Number(id)` は `123` に評価され、`userId` には `123` が代入されます。
一方、`id` の値が `"abc"` の場合、`Number(id)` は NaN に評価され、`userId` には `undefined` が代入されま
す。
*/
