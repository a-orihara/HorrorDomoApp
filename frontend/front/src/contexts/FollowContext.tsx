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
  const [followingCount, setFollowingCount] = useState<number | undefined>(undefined);
  const [followersCount, setFollowersCount] = useState<number | undefined>(undefined);

  // 1
  const handleGetFollowingCountByUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const data = await getFollowingCountByUserId(userId);
      if (data.status == 200) {
        const count: number = data.data.followingCount;
        setFollowingCount(count);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, []);

  const handleGetFollowersCountByUserId = useCallback(async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const data = await getFollowersCountByUserId(userId);
      if (data.status == 200) {
        const count: number = data.data.followersCount;
        console.log(`handleGetFollowersCountByUserIdのcount:${count}`);
        setFollowersCount(count);
      }
    } catch (error) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
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

// Postを取得するカスタムフック
export const useFollowContext = () => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollowContextはPostProvider内で使用しなければならない');
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
*/
