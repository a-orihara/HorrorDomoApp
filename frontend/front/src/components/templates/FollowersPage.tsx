import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useFollowersPagination } from '../../hooks/follow/useFollowersPagination';
import useGetUserById from '../../hooks/user/useGetUserById';
import Pagination from '../molecules/Pagination';
import { FollowList } from '../organisms/list/FollowList';

const FollowersPage = () => {
  const router = useRouter();
  // 1 Next.js の useRouter フックから取得したルーターオブジェクトのプロパティで、URL クエリパラメータを含む
  const { id } = router.query;
  // 2 userIdはnumberかundefined型
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // ルーターパラメーターのidに対応するユーザー情報を取得
  console.log(`FollowersPage.tsxのuserId: ${userId}`);
  const { user, handleGetUserById } = useGetUserById(userId);
  // ルーターパラメーターのidに対応するユーザーのフォローユーザー情報を取得
  const { followers, totalFollowersCount, handlePageChange } = useFollowersPagination(10, userId);
  // console.log(`FollowersPageの:${totalFollowersCount}`);
  // console.log(`FollowersPageの:${JSON.stringify(followers)}`);

  useEffect(() => {
    handleGetUserById();
    // handleGetUserById()にuserIdが渡されているので、依存配列にidよりuserIdを用いる
  }, [userId, handleGetUserById]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-1 flex-col'>
      <FollowList followUsers={followers} title={'All Followers'} noFollowMessage={'フォロワーはいません'}></FollowList>
      <Pagination totalCount={totalFollowersCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default FollowersPage;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
if(!id) { return; }は何も画面に表示されません。return文が実行されると、以降の処理は行われずに関数が終了します。
しかし、それはエラーではありません。存在しないidに対するデータ取得を防ぐ正常な動作です。
------------------------------------------------------------------------------------------------
- Reactでは、非同期に取得するデータを格納するためのState（ここでは`followers`）が更新されると、コンポーネント
が再描画されます。したがって、最初に`followers`が`undefined`であったときには`<div>表示できません</div>`が表示
され、後に`followers`が更新されて`undefined`でなくなると、コンポーネントが再描画されて新しい内容（フォローしてい
るユーザーのリスト）が表示されます。

- この動作は開発環境と本番環境で変わらないです。ReactのStateの更新による再描画の動作は、開発環境と本番環境の両方
で同じように動作します。ただし、非同期処理の速度はネットワークの状態やサーバーの応答速度などにより異なるため、データ
が表示されるまでの時間は環境により異なる可能性があります。

================================================================================================
2
- `id` の型が文字列であり、かつ `Number(id)` が NaN (非数) ではない場合、つまり `id` が数値の文字列である場
合に、`Number(id)` を `userId` に代入します。そうでない場合は `undefined` を代入します。
- 具体的には、条件演算子（三項演算子） `condition ? trueValue : falseValue` を使用しています。`condition`
の評価結果が真の場合は `trueValue` を、偽の場合は `falseValue` を返します。
- この式の目的は、`id` の値が数値の文字列である場合にその数値を取得し、それ以外の場合には `undefined` を設定す
ることです。

例えば、`id` の値が `"123"` の場合、`Number(id)` は `123` に評価され、`userId` には `123` が代入されます。
一方、`id` の値が `"abc"` の場合、`Number(id)` は NaN に評価され、`userId` には `undefined` が代入されま
す。
*/
