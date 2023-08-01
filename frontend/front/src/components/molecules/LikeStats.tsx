import Link from 'next/link';
import { useEffect } from 'react';
import { useLikeContext } from '../../contexts/LikeContext';

type LikeStatsProps = {
  userId: number | undefined;
};

export const LikeStats = ({ userId }: LikeStatsProps) => {
  const { userLikedCount, handleGetAllLikes } = useLikeContext();
  console.log(`LikeStatsのuserLikedCount:${userLikedCount}`);

  useEffect(() => {
    handleGetAllLikes(userId);
  }, [userId, handleGetAllLikes]);
  return (
    <div>
      <Link href={`/users/${userId}/following`}>
        <a className='mr-4 text-xs hover:text-basic-pink md:text-base'>
          <span className='mr-2 underline'>{userLikedCount}</span>
          いいね
        </a>
      </Link>
    </div>
  );
};
