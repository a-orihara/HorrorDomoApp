import { createContext, useContext, useState } from 'react';
import { Like } from '../types/like';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  currentUserLikes: Like[] | undefined;
  currentUserLikesCount: number | undefined;
  // postDetailByPostId: Like | undefined;
  // handleGetFollowingCountByUserId: (userId: number | undefined) => Promise<void>;
  // handleGetFollowersCountByUserId: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [currentUserLikes, setCurrentUserLikes] = useState<Like[]>([]);
  const [currentUserLikesCount, setCurrentUserLikesCount] = useState<number | undefined>(undefined);
  return <LikeContext.Provider value={{ currentUserLikes, currentUserLikesCount }}>{children}</LikeContext.Provider>;
};

export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useFollowContextはFollowProvider内で使用しなければならない');
  }
  return context;
};
