import { createContext, useCallback, useContext, useState } from 'react';
import { getTotalLikesCountByUserId } from '../api/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  // 1
  currentUserLikedPostCount: number | undefined;
  otherUserLikedPostsCount: number | undefined;
  handleGetTotalLikesCountByCurrentUserId: (userId: number | undefined) => Promise<void>;
  handleGetTotalLikesCountByOtherUserId: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  // currentUserのLikedPostsの総数（currentUserのLikedPostsの集合はuseFeedPaginationで取得）
  const [currentUserLikedPostCount, setCurrentUserLikedPostCount] = useState<number | undefined>(undefined);
  // otherUserのLikedPostsの総数（otherUserのLikedPostsの集合は、otherUserにはFeedがないので不要）
  const [otherUserLikedPostsCount, setOtherUserLikedPostsCount] = useState<number | undefined>(undefined);

  // currentUserのLikedPostsの総数を取得し、状態変数にセットする関数／useCallbackがなくても発火しまくらない
  // const handleGetTotalLikesCountByCurrentUserId = useCallback(async (userId: number | undefined) => {
  //   if (!userId) return;
  //   try {
  //     // currentUserがいいねした投稿の集合と、その総数を取得する
  //     const data = await getTotalLikesCountByUserId(userId);
  //     if (data.status === 200) {
  //       const totalLikedCount: number = data.data.totalLikedCounts;
  //       setCurrentUserLikedPostCount(totalLikedCount);
  //     }
  //   } catch (err) {
  //     alert('ユーザーのいいね数を取得出来ませんでした');
  //   }
  // }, []);
  const handleGetTotalLikesCountByCurrentUserId = async (userId: number | undefined) => {
    if (!userId) return;
    try {
      // currentUserがいいねした投稿の集合と、その総数を取得する
      console.log("handleGetTotalLikesCountByCurrentUserId発火しまくり")
      const data = await getTotalLikesCountByUserId(userId);
      if (data.status === 200) {
        const totalLikedCount: number = data.data.totalLikedCounts;
        setCurrentUserLikedPostCount(totalLikedCount);
      }
    } catch (err) {
      alert('ユーザーのいいね数を取得出来ませんでした');
    }
  };

  // otherUserのLikedPostsの総数を取得し、状態変数にセットする関数
  const handleGetTotalLikesCountByOtherUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      // otherUserがいいねした投稿の集合と、その総数を取得する
      const data = await getTotalLikesCountByUserId(userId);
      if (data.status === 200) {
        const totalLikedCount: number = data.data.totalLikedCounts;
        setOtherUserLikedPostsCount(totalLikedCount);
      }
    } catch (err) {
      alert('他のユーザーのいいね数を取得出来ませんでした');
    }
  }, []);

  return (
    <LikeContext.Provider
      value={{
        currentUserLikedPostCount,
        handleGetTotalLikesCountByCurrentUserId,
        otherUserLikedPostsCount,
        handleGetTotalLikesCountByOtherUserId,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikeContextはLikeProvider内で使用しなければならない');
  }
  return context;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Next.jsやRailsアプリケーションでは、`[数値 | undefined]`のようなコンテキストタイプで`undefined`を使うことで
、アプリケーションの状態をより効率的に管理することができます。以下に簡単な説明をします：
------------------------------------------------------------------------------------------------
. **コンテキストとundefinedを理解する。
- アプリでは `FollowContext` や `LikeContext` といったコンテキストが特定の値（`followingCount` や
`currentUserLikedPostCount` など）を記録しています。
- これらの値がすぐに利用できないこともある。例えば、アプリが最初に起動したときや、ユーザーがログインしていないとき
には、フォロー数やいいね投稿数はまだありません。
------------------------------------------------------------------------------------------------
. **なぜundefinedを使うのか？
- これらの値を`undefined`にすることで、"今この情報がなくても大丈夫です "と言っていることになります。
- これはエラーを防ぐのに役立ちます。例えば、まだ持っていない値を使おうとすると（ログインしていないユーザーのアカウ
ントを表示しようとするなど）、アプリに問題が発生する可能性があります。しかし、その値が`undefined`である可能性があ
ることを知っていれば、それをチェックして安全に処理することができます（カウントが利用できないことをメッセージで表示す
るなど）。
------------------------------------------------------------------------------------------------
. **コードの中で未定義を扱う
- コンポーネントでこれらの値を使用する場合（ユーザーが「いいね！」を押した投稿の数を表示するような場合）、まずその
値が `undefined` かどうかをチェックします。
- もし `undefined` なら、どうするか決めることができます。ローディングスピナーを表示したり、メッセージを表示した
り、あるいは何も表示しなかったりします。こうすれば、アプリがクラッシュしたり、間違った情報を表示したりすることはない。
------------------------------------------------------------------------------------------------
まとめると、コンテキストタイプで `undefined` を許可することは、特定の情報をまだ持っていないかもしれない状況に対処
する方法です。これは、アプリがエラーを回避できるようにするための安全策です。
*/
