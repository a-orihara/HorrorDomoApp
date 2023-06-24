import { useCallback, useState } from 'react';
import { getUserById } from '../../api/user';
import { User } from '../../types/user';

// 1 idで指定したユーザーのユーザー情報を取得する
const useGetUserDataById = (id: string | string[] | undefined) => {
  // ユーザー情報を格納するステート
  const [user, setUser] = useState<User | null>(null);
  // const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 2
  const handleGetUserDataById = useCallback(async () => {
    if (!id) return;
    console.log('getUserDataById is called');
    try {
      const res = await getUserById(id as string);
      const fetchedUser: User = res.data;
      // const fetchAvatarUrl = res.data.avatarUrl;
      // console.log(`fetchedUser:${JSON.stringify(fetchedUser)}`);
      // console.log(`fetchAvatarUrl:${JSON.stringify(fetchAvatarUrl)}`);
      setUser(fetchedUser);
      // setAvatarUrl(fetchAvatarUrl);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [id]);

  // return { user, avatarUrl, handleGetUserDataById };
  return { user, handleGetUserDataById };
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
useGetUserDataById.tsでは、handleGetUserDataByIdをuseEffect内で使用しない。
useGetUserDataById.ts` において、`useCallback` を使用しない場合、レンダリング毎にuseEffactにより、
新しい `handleGetUserDataById` 関数が作成され、`ProfilePage` が依存している `handleGetUserDataById` 関
数がレンダリング毎に変わるため、不必要な再レンダリングを引き起こす。これは、コンポーネントが複雑な場合や再レンダリン
グが多い場合に、パフォーマンスの問題につながる可能性があります。
------------------------------------------------------------------------------------------------
`handleGetUserDataById`に `useCallback` を使用する目的は、関数をメモ化することです。つまり、依存関係の1つが
変更された場合にのみ関数を変更します。この場合、`handleGetUserDataById`は、`id`が変更された場合にのみ変更され
ます。これにより、不必要な再レンダリングを防ぎ、パフォーマンスを向上させることができます。
------------------------------------------------------------------------------------------------
さらにuseCallback`により新しい `handleGetUserDataById` 関数が作成されますが、useCallbackは生成するだけで、
この関数は自動的に実行されません。ProfilePage.tsx`の `useEffect` 内のように、明示的に呼び出されたときのみ実行
されます。
*/
