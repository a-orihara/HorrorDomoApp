import { useEffect, useState } from 'react';
import { isFollowing } from '../../api/follow';
import Button from '../atoms/Button';

type FollowFormProps = {
  userId: number;
  otherUserId: number;
};

export const FollowForm = ({ userId, otherUserId }: FollowFormProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  useEffect(() => {
    const checkFollow = async () => {
      const response = await isFollowing(userId, otherUserId);
      setIsFollowed(response.data.is_following);
    };
    checkFollow();
  }, [userId, otherUserId]);

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
