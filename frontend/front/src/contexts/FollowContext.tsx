import { createContext, useCallback, useContext, useState } from 'react';
import { getFollowersCountByUserId, getFollowingCountByUserId } from '../api/follow';

type FollowProviderProps = {
  children: React.ReactNode;
};

// 1
type FollowContextProps = {
  followingCount: number | undefined;
  followersCount: number | undefined;
  handleGetFollowingCountByUserId: (userId: number | undefined) => Promise<void>;
  handleGetFollowersCountByUserId: (userId: number | undefined) => Promise<void>;
};

const FollowContext = createContext<FollowContextProps | undefined>(undefined);

export const FollowProvider = ({ children }: FollowProviderProps) => {
  // フォローしているuserの総数
  const [followingCount, setFollowingCount] = useState<number | undefined>(undefined);
  // フォローされているuserの総数
  const [followersCount, setFollowersCount] = useState<number | undefined>(undefined);

  // 1 1.3 フォローしているuserの総数を取得し、状態変数にセットする関数
  const handleGetFollowingCountByUserId = useCallback(async (userId: number | undefined) => {
    // userIdがなければ処理をしない
    if (!userId) return;
    try {
      console.log("handleGetFollowingCountByUserId発火しまくり")
      const data = await getFollowingCountByUserId(userId);
      // 1.1
      if (data.status === 200) {
        const count: number = data.data.followingCount;
        setFollowingCount(count);
      }
    } catch (err) {
      console.error(err);
      alert('ユーザーのフォロー数を取得出来ませんでした');
    }
  }, []);

  // フォローされているuserの総数を取得し、状態変数にセットする関数
  const handleGetFollowersCountByUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const data = await getFollowersCountByUserId(userId);
      if (data.status == 200) {
        const count: number = data.data.followersCount;
        setFollowersCount(count);
      }
    } catch (err) {
      console.error(err);
      alert('ユーザーのフォロワー数を取得出来ませんでした');
    }
  }, []);

  return (
    <FollowContext.Provider
      value={{
        followingCount,
        followersCount,
        handleGetFollowingCountByUserId,
        handleGetFollowersCountByUserId,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollowContext = () => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollowContextはFollowProvider内で使用しなければならない');
  }
  return context;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
以前`useGetFollowingCountByUserId`の内容（handleGetFollowingCountByUserId等）だったものを、
`FollowContext`内で直接記述する理由は、ステート管理とその更新処理を同一のコンテキスト内で行うことで、データの一
貫性を保つためです。
また、ステート更新処理が同一コンテキスト内にあることで、そのステートを利用するすべてのコンポーネントで一貫した処理を
保証できます。
カスタムフックはコンテキスト内で使用しても問題ありません。カスタムフックは、ロジックを再利用し、コンポーネントの内部
を整理するためのツールです。
ただし、特定のステートとその更新処理をコンテキスト内でまとめて管理する方が、関連するコンポーネント間でのデータの一貫
性を保つことが可能です。
そのため、カスタムフックを直接コンテキスト内で使用するよりも、コンテキスト内で直接ステート管理と更新処理を行う方が一
般的です。

================================================================================================
1.1
何でも成功、エラーの際にモーダルを表示を追加しない。モーダル表示の連続になる。

================================================================================================
1.3
handleGetFollowingCountByUserId` 関数で観察されている動作は、React がコンポーネントの再レンダリングを処理す
る方法と `useCallback` の使用に関連しています。
. **useCallback`**を使用しない場合：
- `index.tsx` がリロードされると、すべての子コンポーネントとコンテキストが再レンダリングされます。
- handleGetFollowingCountByUserId` は `FollowContext` 内で通常の関数として定義されているため、
`FollowContext` を再レンダリングするたびに再作成されます。
- FollowContext` の `handleGetFollowingCountByUserId` を使用する `FollowStats` コンポーネントは、親コ
ンポーネント（`UserInfo` や `HomePage`など）の再レンダリングによって複数回レンダリングされる。
- 各 `FollowStats` のレンダリングは `useEffect` フックをトリガーし、`handleGetFollowingCountByUserId` を
呼び出す。
- handleGetFollowingCountByUserId` はレンダリングごとに新しい関数であるため、`FollowStats` の `useEffect`
が複数回実行されることになり、結果として "handleGetFollowingCountByUserId 発火しまくり" メッセージが複数回ログ
に記録されます。
------------------------------------------------------------------------------------------------
. **useCallback`** を使用する：
- useCallback` は関数 `handleGetFollowingCountByUserId` をメモする。つまり、依存関係が変更されない限り、関
数は保存され、`FollowContext` の再レンダリング時に再利用されます（この場合、空の依存関係配列 `[]` が示すように、
依存関係はありません）。
- index.tsx`をリロードすると、`FollowContext`とそのコンシューマー（`FollowStats`など）は再レンダリングされる
が、`handleGetFollowingCountByUserId`関数は再作成されない。
- 関数の参照は再レンダリングしても変わらないため、`FollowStats` の `useEffect` は
`handleGetFollowingCountByUserId` を複数回呼び出すトリガーにはなりません。
- したがって、"handleGetFollowingCountByUserId発火しまくり "のログは一度しか表示されません。
------------------------------------------------------------------------------------------------
まとめると、`handleGetFollowingCountByUserId` に `useCallback` を使用することで、再レンダリング時に関数参照
が一定に保たれ、`FollowStats` の `useEffect` での不要な複数回の実行を防ぐことができます。これは不要な計算やネッ
トワークリクエストを回避するための React における一般的なパフォーマンスの最適化である。
------------------------------------------------------------------------------------------------
handleGetFollowingCountByUserId`で`useCallback`が使用されず、結果的に3回トリガーされた場合のレンダリングの
流れを説明
1. **`index.tsx`:**の初期ロードとレンダリング
- index.tsx`ページはロードされるルートコンポーネント。
- index.tsx`の内部では、`HomePage`コンポーネントがレンダリング。
2. **HomePage`コンポーネントのレンダリング:**
- HomePage`がレンダリングされると、ユーザがサインインしているかどうかがチェックされ、それに基づいて様々なコンポー
ネントがレンダリング。
- ユーザがサインインしている場合、`HomePage` は `UserInfo` コンポーネントなどをレンダリング。
3. **UserInfo` コンポーネントのレンダリング:**
- UserInfo` は `user` オブジェクトを prop として受け取る。
- UserInfo` の内部では、`userId` オブジェクトから `userId` を受け取って `FollowStats` コンポーネントがレン
ダリング。
4. **FollowStats` コンポーネントのレンダリングとコンテキストの使用法:**
- `FollowStats` は `user` オブジェクトから `userId` を受け取ってレンダリングする。
- FollowStats` は `useFollowContext` を使用して `handleGetFollowingCountByUserId` にアクセスする。
- handleGetFollowingCountByUserId` はメモ化されていない（`useCallback` を使用していない）ので、
`FollowProvider` が再レンダリングするたびに再定義される。
5. **FollowStats` 内の `useEffect` と複数回の呼び出し:**.
- FollowStats` の `useEffect` は `userId` または `handleGetFollowingCountByUserId` が変更されるたびに
`handleGetFollowingCountByUserId` を呼び出します。
- FollowStats` またはその親コンポーネントを再レンダリングするたびに `handleGetFollowingCountByUserId` が再
定義され、再び `useEffect` がトリガーされる。
6. **関数が3回呼び出される理由:**)
- Reactのレンダリングと照合処理の仕組みにより、この関数は複数回呼び出されます。index.tsx`がリロードされると、コン
ポーネントツリーの下に再レンダリングのカスケードが発生します。
- これらの再レンダリングのそれぞれは、コンポーネントツリーで状態やpropsがどのように変化しているかに応じて、
`FollowStats`の`useEffect`をトリガーする可能性があります。
- あなたのケースでは、これらのリレンダリングの組み合わせにより、`handleGetFollowingCountByUserId`が3回トリガー
されるようです。
*/
