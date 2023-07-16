import { useEffect } from 'react';
import { useGetUserFollowingByUserId } from '../../hooks/relationship/useGetUserFollowingByUserId';

const FollowingPage = ({ userId }: { userId: number | undefined }) => {
  const { following, handleGetUserFollowingByUserId } = useGetUserFollowingByUserId(userId);

  useEffect(() => {
    console.log('FollowingPageのuseEffectが呼ばれました');
    handleGetUserFollowingByUserId();
  }, [userId, handleGetUserFollowingByUserId]);

  console.log(`ここFollowingPageの${JSON.stringify(following)}`);

  return <div>FollowingPage</div>;
};

export default FollowingPage;
