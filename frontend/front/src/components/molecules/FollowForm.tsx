import { useEffect, useState } from 'react';
import { isFollowing } from '../../api/follow';
import { useFollowContext } from '../../contexts/FollowContext';
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
  const { handleGetFollowingCountByUserId, handleGetFollowersCountByUserId } = useFollowContext();

  // 1
  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    handleCreateFollow().then(() => setIsFollowed(true));
    handleGetFollowingCountByUserId(userId);
  };

  const handleUnFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (window.confirm('フォローを解除しますか？')) {
      event.preventDefault();
      handleDeleteFollow().then(() => setIsFollowed(false));
      handleGetFollowersCountByUserId(userId);
    }
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
            フォロー中
          </Button>
        ) : (
          <Button
            className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'
            onClick={handleFollowClick}
          >
            フォローする
          </Button>
        )}
      </form>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
isFollowedステートの更新を即時反映するため、handleCreateFollowの後にsetIsFollowed(true)。
------------------------------------------------------------------------------------------------
useCreateFollowフック内のhandleCreateFollow関数で非同期処理とエラーハンドリングが完全にカバーされているので、
ここで下記のようなエラーやasyncの処理は不要。
try {
    await handleCreateFollow();
    setIsFollowed(true);
  } catch (err: any) {
    console.error(err);
  }
------------------------------------------------------------------------------------------------
API呼び出しに失敗した場合でもフォロー済みとして表示が切り替わる可能性を防ぐ為、thenでつなぐ。
*/
