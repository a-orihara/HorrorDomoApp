import { useRouter } from 'next/router';
import FollowingPage from '../../../components/templates/FollowingPage';

const Following = () => {
  const router = useRouter();

  const { id } = router.query;

  // 数値もしくはundefinedが返る
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  return (
    <div>
      {/* <FollowingPage userId={userId}></FollowingPage>
       */}
      {/* 2 */}
      {userId !== undefined ? <FollowingPage userId={userId}></FollowingPage> : <div>表示できません</div>}
    </div>
  );
};

export default Following;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- `id` の型が文字列であり、かつ `Number(id)` が NaN (非数) ではない場合、つまり `id` が数値の文字列である場
合に、`Number(id)` を `userId` に代入します。そうでない場合は `undefined` を代入します。
- 具体的には、条件演算子（三項演算子） `condition ? trueValue : falseValue` を使用しています。`condition`
の評価結果が真の場合は `trueValue` を、偽の場合は `falseValue` を返します。
- この式の目的は、`id` の値が数値の文字列である場合にその数値を取得し、それ以外の場合には `undefined` を設定す
ることです。

例えば、`id` の値が `"123"` の場合、`Number(id)` は `123` に評価され、`userId` には `123` が代入されます。
一方、`id` の値が `"abc"` の場合、`Number(id)` は NaN に評価され、`userId` には `undefined` が代入されま
す。

================================================================================================
2
- この部分は、条件式 `{userId !== undefined}` の評価結果によって、異なる要素を表示します。
- 条件式が真（true）の場合、つまり `userId` が `undefined` ではない場合には、`<FollowingPage>` コンポーネ
ントが表示されます。
- 条件式が偽（false）の場合、つまり `userId` が `undefined` の場合には、`<div>表示できません</div>` が表示
されます。
- このような表現は、条件に応じて異なる要素を描画するために使用されます。
*/
