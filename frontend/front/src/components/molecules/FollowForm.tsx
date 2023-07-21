import { useEffect, useState } from 'react';
import { isFollowing } from '../../api/follow';
import { useCreateFollow } from '../../hooks/relationship/useCreateFollow';
import { useDeleteFollow } from '../../hooks/relationship/useDeleteFollow';
import Button from '../atoms/Button';

type FollowFormProps = {
  userId: number;
  otherUserId: number | undefined;
};

export const FollowForm = ({ userId, otherUserId }: FollowFormProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const { handleCreateFollow } = useCreateFollow(otherUserId);
  const { handleDeleteFollow } = useDeleteFollow(otherUserId);

  // 1
  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    handleCreateFollow();
  };

  const handleUnFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    handleDeleteFollow();
  };

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
      <form className='bg-red-200'>
        {isFollowed ? (
          <Button
            className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'
            onClick={handleUnFollowClick}
          >
            unfollow
          </Button>
        ) : (
          <Button
            className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'
            onClick={handleFollowClick}
          >
            follow
          </Button>
        )}
      </form>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1

*/
