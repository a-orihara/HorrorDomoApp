import { createContext, useCallback, useContext, useState } from 'react';
import { getAllLikes } from '../api/like';
import { Like } from '../types/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  userLikes: Like[] | undefined;
  userLikedCount: number | undefined;
  handleGetAllLikes: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [userLikes, setCurrentUserLikes] = useState<Like[]>([]);
  const [userLikedCount, setCurrentUserLikedCount] = useState<number | undefined>(undefined);

  const handleGetAllLikes = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const data = await getAllLikes(userId);
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
    <LikeContext.Provider value={{ userLikes, userLikedCount, handleGetAllLikes }}>{children}</LikeContext.Provider>
  );
};

export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikeContextはLikeProvider内で使用しなければならない');
  }
  return context;
};
