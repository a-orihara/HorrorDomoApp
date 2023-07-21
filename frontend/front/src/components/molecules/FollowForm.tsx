import { useEffect, useState } from 'react';
import { isFollowing } from '../../api/follow';
import Button from '../atoms/Button';

type FollowFormProps = {
  userId: number;
  otherUserId: number | undefined;
};

export const FollowForm = ({ userId, otherUserId }: FollowFormProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  useEffect(() => {
    const checkFollow = async () => {
      // userId（currentId）と otherUserId が undefined でないことを確認する
      if (userId !== undefined && otherUserId !== undefined) {
        const response = await isFollowing(userId, otherUserId);
        setIsFollowed(response.data.isFollowing);
      }
    };
    checkFollow();
  }, [userId, otherUserId]);
  console.log(`FollowFormの判定${isFollowed}`);
  console.log(`FollowFormのuserId:${userId}`);
  console.log(`FollowFormのotherUserId:${otherUserId}`);

  // const test = () => {
  //   console.log('FollowForm');
  // };

  return (
    <div>
      <form className='bg-red-200' action='post'>
        {isFollowed ? (
          <Button className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'>
            unfollow
          </Button>
        ) : (
          <Button className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'>follow</Button>
        )}
      </form>
    </div>
  );
};
