import { useCallback, useState } from 'react';
import { getUserFollowersByUserId } from '../../api/relationship';

// ユーザーのフォロワー数を取得するフック
export const useGetUserFollowersByUserId = (userId: number | undefined) => {
  // console.log('handleGetUserFollowerが呼ばれました');
  const [followersCount, setFollowersCount] = useState();

  const handleGetUserFollowersByUserId = useCallback(async () => {
    try {
      const data = await getUserFollowersByUserId(userId);
      const count = data.data.followersCount;
      setFollowersCount(count);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);
  return { followersCount, handleGetUserFollowersByUserId };
};
