import { useCallback, useState } from 'react';
import { getUserById } from '../../api/user';
import { User } from '../../types/user';

// 1 idで指定したユーザーのユーザー情報を取得する
const useGetUserById = (id: number | undefined) => {
  // ユーザー情報を格納するステート
  const [user, setUser] = useState<User | null>(null);
  // 2
  const handleGetUserById = useCallback(async () => {
    // 3
    if (!id) return;
    try {
      const res = await getUserById(id);
      const fetchedUser: User = res.data;
      // console.log(`fetchedUser:${JSON.stringify(fetchedUser)}`);
      setUser(fetchedUser);
    } catch (err) {
      alert("ユーザー情報を取得出来ませんでした")
    }
  }, [id]);

  return { user, handleGetUserById };
};

export default useGetUserById;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
(id: string | string[] | undefined)
- id` の型が `string | string[] | undefined` である理由は、Next.js の `router.query` が返す型がこれである
ためです。query`オブジェクトには、URLからパースされた現在のルートのクエリパラメータが格納されます。これらのパラメ
ータは `string` 、`array of strings` 、またはパラメータが存在しない場合は `undefined` である可能性がありま
す。
------------------------------------------------------------------------------------------------
- `id` の型に `string` を使用するだけでは、 `router.query` が返す可能性のあるすべての型を網羅することはできませ
ん。なぜなら、TypeScriptは `id` が `string[]` や `undefined` にもなりうると想定しているからです。
フックの `useUser` に `id` を渡す場合、実際には `router.query.id` の結果を渡すことになるので、`id` のすべて
の可能な型を考慮する必要がある。

================================================================================================
2
useGetUserDataById.tsでは、handleGetUserDataByIdをuseEffect内で使用しない。
useGetUserDataById.ts` において、`useCallback` を使用しない場合、レンダリング毎にProfilePageのuseEffectに
より、新しい `handleGetUserDataById` 関数が作成され、`ProfilePage` が依存している `handleGetUserDataById`
関数がレンダリング毎に変わるため、不必要な再レンダリングを引き起こす。これは、コンポーネントが複雑な場合や再レンダリン
グが多い場合に、パフォーマンスの問題につながる可能性があります。
------------------------------------------------------------------------------------------------
関数が「変わる」とは、新しいインスタンスが生成されることを指します。JavaScriptでは、関数もオブジェクトとして扱われ
ます。したがって、同じ機能を持つ関数を二度実行しても、それぞれ異なるオブジェクト（つまり異なる関数）として扱われます
。
useEffectの第二引数（依存配列）に含まれる値が変わると、useEffect内の関数は再度実行されます。したがって、
handleGetUserDataById関数が新たに生成される（つまり「変わる」）たびに、useEffectは再度実行されます。
------------------------------------------------------------------------------------------------
しかし、handleGetUserDataById関数をuseCallbackでラップすることで、idが変わらない限り、
handleGetUserDataById関数は新たに生成されず（つまり「変わらない」）、useEffectは再度実行されません。
------------------------------------------------------------------------------------------------
`handleGetUserDataById`に `useCallback` を使用する目的は、関数をメモ化することです。つまり、依存関係の1つが
変更された場合にのみ関数を変更します。この場合、`handleGetUserDataById`は、`id`が変更された場合にのみ変更され
ます。これにより、不必要な再レンダリングを防ぎ、パフォーマンスを向上させることができます。
------------------------------------------------------------------------------------------------
さらにuseCallback`により新しい `handleGetUserDataById` 関数が作成されますが、useCallbackは生成するだけで、
この関数は自動的に実行されません。ProfilePage.tsx`の `useEffect` 内のように、明示的に呼び出されたときのみ実行
されます。

================================================================================================
3
idがない場合があるかどうか:
通常、URLパラメータから取得するidは存在するはずですが、コードのバグや意図しない挙動、あるいはユーザーがURLを直接編
集するなどの理由で、idが取得できない場合があります。また、このコードが実行されるタイミングによっては、ルーターから
idがまだ取得できない場合もあります。
そのような場合に備えて、if (!id) return;のようなチェックを行うことが一般的です。
*/
