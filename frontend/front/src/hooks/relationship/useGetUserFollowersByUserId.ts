import { useState } from 'react';
import { getUserFollowersByUserId } from '../../api/relationship';

// ユーザーのフォロワー数を取得するフック
export const useGetUserFollowersByUserId = (userId: number) => {
  const [followersCount, setFollowersCount] = useState();
  const handleGetUserFollowersByUserId = async () => {
    try {
      const data = await getUserFollowersByUserId(userId);
      const count = data.data.followersCount;
      setFollowersCount(count);
    } catch (error) {
      console.log(error);
    }
  };
  return { followersCount, handleGetUserFollowersByUserId };
};
