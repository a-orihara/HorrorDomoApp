import { useEffect } from 'react';
import { useGetUserFollowingByUserId } from '../../hooks/relationship/useGetUserFollowingByUserId';
import { FollowingListItem } from '../atoms/FollowingListItem';

const FollowingPage = ({ userId }: { userId: number | undefined }) => {
  // const FollowingPage = ({ userId }: { userId: number }) => {
  const { following, handleGetUserFollowingByUserId } = useGetUserFollowingByUserId(userId);

  useEffect(() => {
    console.log('FollowingPageのuseEffectが呼ばれました');
    handleGetUserFollowingByUserId();
  }, [userId, handleGetUserFollowingByUserId]);

  console.log(`ここFollowingPageの${JSON.stringify(following)}`);

  return (
    <div>
      <p>FollowingPage</p>
      <FollowingListItem following={following}></FollowingListItem>
    </div>
  );
};

export default FollowingPage;
