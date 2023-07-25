import { useCallback, useState } from 'react';
import { getFollowersCountByUserId } from '../../api/follow';

// idユーザーのフォローワーの総数を取得するフック
export const useGetFollowersCountByUserId = (userId: number | undefined) => {
  // console.log('handleGetUserFollowerが呼ばれました');
  const [followersCount, setFollowersCount] = useState<number>();

  const handleGetFollowersCountByUserId = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFollowersCountByUserId(userId);
      if (data.status == 200) {
        const count: number = data.data.followersCount;
        setFollowersCount(count);
      }
    } catch (error) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, [userId]);

  return { followersCount, handleGetFollowersCountByUserId };
};
