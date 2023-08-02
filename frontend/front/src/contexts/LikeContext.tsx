import { createContext, useCallback, useContext, useState } from 'react';
import { getAllLikesByUserId } from '../api/like';
import { Like } from '../types/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  currentUserLikes: Like[] | undefined;
  currentUserLikedCount: number | undefined;
  handleGetAllLikesByCurrentUserId: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [currentUserLikes, setCurrentUserLikes] = useState<Like[]>([]);
  const [currentUserLikedCount, setCurrentUserLikedCount] = useState<number | undefined>(undefined);

  // 指定userIDがいいねした投稿の集合と、その総数を取得し、stateに格納する
  const handleGetAllLikesByCurrentUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      // 指定userIDがいいねした投稿の集合と、その総数を取得する
      const data = await getAllLikesByUserId(userId);
      if (data.status === 200) {
        const likes: Like[] = data.data.likedPosts;
        setCurrentUserLikes(likes);
        const totalLikedCount: number = data.data.totalLikedCounts;
        setCurrentUserLikedCount(totalLikedCount);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, []);

  return (
    <LikeContext.Provider value={{ currentUserLikes, currentUserLikedCount, handleGetAllLikesByCurrentUserId }}>
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
