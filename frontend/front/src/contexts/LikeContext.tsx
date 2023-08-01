import { createContext, useContext, useState } from 'react';
import { getAllLikes } from '../api/like';
import { Like } from '../types/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  currentUserLikes: Like[] | undefined;
  currentUserLikedCount: number | undefined;
  handleGetAllLikes: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [currentUserLikes, setCurrentUserLikes] = useState<Like[]>([]);
  const [currentUserLikedCount, setCurrentUserLikedCount] = useState<number | undefined>(undefined);

  const handleGetAllLikes = async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const data = await getAllLikes(userId);
      if (data.status === 200) {
        const likes: Like[] = data.data.likedPosts;
        setCurrentUserLikes(likes);
        const totalLikedCount: number = data.data.totalLikedCount;
        setCurrentUserLikedCount(totalLikedCount);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  };
  return (
    <LikeContext.Provider value={{ currentUserLikes, currentUserLikedCount, handleGetAllLikes }}>
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
