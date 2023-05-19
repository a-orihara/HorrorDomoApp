import { useEffect, useState } from 'react';
import { getUserById } from '../../api/user';
import { User } from '../../types';

// 1 idで指定したユーザーのユーザー情報を取得する
const useGetUserDataById = (id: string | string[] | undefined) => {
  // ユーザー情報を格納するステート
  const [user, setUser] = useState<User | null>(null);

  // 2
  useEffect(() => {
    // idがない場合は何もしない
    if (!id) return;
    // idで指定したユーザーのユーザー情報を取得
    const getUserData = async () => {
      try {
        const res = await getUserById(id as string);
        const fetchedUser: User = res.data;
        setUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    getUserData();
  }, [id]);

  return { user };
};

export default useGetUserDataById;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
(id: string | string[] | undefined)
id` の型が `string | string[] | undefined` である理由は、Next.js の `router.query` が返す型がこれである
ためです。query`オブジェクトには、URLからパースされた現在のルートのクエリパラメータが格納されます。これらのパラメ
ータは `string` 、`array of strings` 、またはパラメータが存在しない場合は `undefined` である可能性がありま
す。
`id` の型に `string` を使用するだけでは、 `router.query` が返す可能性のあるすべての型を網羅することはできませ
ん。なぜなら、TypeScriptは `id` が `string[]` や `undefined` にもなりうると想定しているからです。
フックの `useUser` に `id` を渡す場合、実際には `router.query.id` の結果を渡すことになるので、`id` のすべて
の可能な型を考慮する必要がある。

余談ですが、関数 `getUserById` では、`id as string` を使っていますね。このタイプアサーションは TypeScript
に `id` を `string` として扱うように指示するもので、もし `id` が実際には `array of strings` や
`undefined` であれば、安全ではない可能性がある。しかし、すでに `!id` をチェックしているので、 `id` は
`undefined` でもなく、空文字列でもないことがわかります。id` が配列の場合はまだ問題があるかもしれませんが、これ
は `router.query` がアプリケーションでどのように使用されているかによります。もし `id` が単一の文字列であるこ
とが確実であれば、 `router.query` が常に `string` を返すようにアプリケーションを変更し、おそらく単一の文字列
のクエリパラメータしか使用しないようにする方が安全かもしれません。

================================================================================================
2
idに合うユーザー情報を取得

if(!id) return;
idがundefinedの場合は何もしないようにするための処理です。この場合は、idがまだ設定されていない初回レンダリング時に
は何もしないようになっている。

関数コンポーネントのレンダリング後に非同期処理を実行し、idが変更された場合に再度処理を実行する。
具体的には、idが存在する場合にgetUserByIdという関数を実行し、取得したユーザーデータをsetUser関数を使ってuserス
テートにセットしています。
[id]はuseEffectの依存配列であり、idの値が変わった場合に再度このuseEffectが実行されるようにしています。
利用意図としては、指定したidに対応するユーザーデータを非同期的に取得し、画面に表示するためです。

------------------------------------------------------------------------------------------------
getUserById(id as string);
as string
TypeScriptの型アサーションと呼ばれるもので、idがstring型であることを明示的に示している。
*/
