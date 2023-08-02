import { createContext, useCallback, useContext, useState } from 'react';
import { getTotalLikesCountByUserId } from '../api/like';
import { Like } from '../types/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  // 1
  currentUserLikedPosts: Like[] | undefined;
  currentUserLikedPostCount: number | undefined;
  otherUserLikedPosts: Like[] | undefined;
  otherUserLikedPostsCount: number | undefined;
  handleGetAllLikesByCurrentUserId: (userId: number | undefined) => Promise<void>;
  handleGetAllLikesByOtherUserId: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [currentUserLikedPosts, setCurrentUserLikedPosts] = useState<Like[]>([]);
  const [currentUserLikedPostCount, setCurrentUserLikedPostCount] = useState<number | undefined>(undefined);
  const [otherUserLikedPosts, setOtherUserLikedPosts] = useState<Like[]>([]);
  const [otherUserLikedPostsCount, setOtherUserLikedPostsCount] = useState<number | undefined>(undefined);

  // currentUserがいいねした投稿の集合と、その総数を取得し、currentUserのstateに格納する
  // const handleGetAllLikesByCurrentUserId = useCallback(async (userId: number | undefined) => {
  //   if (!userId) return;
  //   try {
  //     // currentUserがいいねした投稿の集合と、その総数を取得する
  //     const data = await getAllLikesByUserId(userId);
  //     if (data.status === 200) {
  //       const likes: Like[] = data.data.likedPosts;
  //       setCurrentUserLikedPosts(likes);
  //       const totalLikedCount: number = data.data.totalLikedCounts;
  //       setCurrentUserLikedPostCount(totalLikedCount);
  //     }
  //   } catch (err) {
  //     // ◆エラー仮実装
  //     alert('ユーザーが存在しません');
  //   }
  // }, []);
  const handleGetAllLikesByCurrentUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      // currentUserがいいねした投稿の集合と、その総数を取得する
      const data = await getTotalLikesCountByUserId(userId);
      if (data.status === 200) {
        const likes: Like[] = data.data.likedPosts;
        setCurrentUserLikedPosts(likes);
        const totalLikedCount: number = data.data.totalLikedCounts;
        setCurrentUserLikedPostCount(totalLikedCount);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, []);

  // otherUserがいいねした投稿の集合と、その総数を取得し、otherUserのstateに格納する
  // const handleGetAllLikesByOtherUserId = useCallback(async (userId: number | undefined) => {
  //   if (!userId) return;
  //   try {
  //     // otherUserがいいねした投稿の集合と、その総数を取得する
  //     const data = await getAllLikesByUserId(userId);
  //     if (data.status === 200) {
  //       const likes: Like[] = data.data.likedPosts;
  //       setOtherUserLikedPosts(likes);
  //       const totalLikedCount: number = data.data.totalLikedCounts;
  //       setOtherUserLikedPostsCount(totalLikedCount);
  //     }
  //   } catch (err) {
  //     // ◆エラー仮実装
  //     alert('ユーザーが存在しません');
  //   }
  // }, []);
  const handleGetAllLikesByOtherUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      // otherUserがいいねした投稿の集合と、その総数を取得する
      const data = await getTotalLikesCountByUserId(userId);
      if (data.status === 200) {
        const likes: Like[] = data.data.likedPosts;
        setOtherUserLikedPosts(likes);
        const totalLikedCount: number = data.data.totalLikedCounts;
        setOtherUserLikedPostsCount(totalLikedCount);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, []);

  return (
    <LikeContext.Provider
      value={{
        currentUserLikedPosts,
        currentUserLikedPostCount,
        handleGetAllLikesByCurrentUserId,
        otherUserLikedPosts,
        otherUserLikedPostsCount,
        handleGetAllLikesByOtherUserId,
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
Contextの値の型にundefinedの扱いに悩ませられるのは、コードの健全性や安全性を確保するためによくあるケースです。
undefinedが入る可能性がある場合、その処理を考慮することでランタイムエラーを防ぎ、コードの堅牢性を高めることができ
ます。
------------------------------------------------------------------------------------------------
undefinedを適切に処理するための処置は、その値を利用する側であるLikeStatsコンポーネントに書くのが適切です。
AuthContextでは値がundefinedであることを許容しているため、undefinedに対して適切な処理を行うのは使用側の責任と
なります。
------------------------------------------------------------------------------------------------
. `currentUser: User | undefined`のような型定義がcontextでなされる理由は、変数`currentUser`が、
`undefined`を取る可能性があるからです。最初にアプリが起動した際やログアウト状態など、ユーザーが特定されていない場
合が想定されるため、この型定義によってその状態を表現しています。
------------------------------------------------------------------------------------------------
. Contextの値の型に`undefined`を設定する理由は、実際のアプリケーションの動作に合わせて、型システム上でも正確に表
現するためです。例えば、ユーザーが未ログインの状態であれば`undefined`となる場合があるため、その状態を型で表現しま
す。このことによって、`undefined`の場合の処理を明示的にコーディングする必要があり、エラーを未然に防ぐ助けになりま
す。
*/
