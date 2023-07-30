import { createContext, useContext } from 'react';

type LikeProviderProps = {
  children: React.ReactNode;
};

type LikeContextProps = {
  // followingCount: number | undefined;
  // followersCount: number | undefined;
  // handleGetFollowingCountByUserId: (userId: number | undefined) => Promise<void>;
  // handleGetFollowersCountByUserId: (userId: number | undefined) => Promise<void>;
};

const LikeContext = createContext<LikeContextProps | undefined>(undefined);

export const LikeProvider = ({ children }: LikeProviderProps) => {
  return <LikeContext.Provider>{children}</LikeContext.Provider>;
};

export const useLikeContext = () => {
  const context = useContext(LikewContext);
  if (context === undefined) {
    throw new Error('useFollowContextはFollowProvider内で使用しなければならない');
  }
  return context;
};
