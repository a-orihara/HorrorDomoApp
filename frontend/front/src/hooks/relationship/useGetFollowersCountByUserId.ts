import { useCallback, useState } from 'react';
import { getFollowersCountByUserId } from '../../api/relationship';

// ユーザーのフォロワー数を取得するフック
export const useGetFollowersCountByUserId = (userId: number | undefined) => {
  // console.log('handleGetUserFollowerが呼ばれました');
  const [followersCount, setFollowersCount] = useState();

  const handleGetFollowersCountByUserId = useCallback(async () => {
    try {
      const data = await getFollowersCountByUserId(userId);
      const count = data.data.followersCount;
      setFollowersCount(count);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);
  return { followersCount, handleGetFollowersCountByUserId };
};
