import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getFollowersByUserId } from '../../api/relationship';
import { useAlertContext } from '../../contexts/AlertContext';
import { Follower } from '../../types/relationship';

export const useFollowersPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのフォローユーザー一覧
  const [followers, setFollowers] = useState<Follower[]>([]);
  // 指定したuserIdのフォローユーザーの総数
  const [totalFollowersCount, setTotalFollowersCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // const { followersCount, followers, followersPagination, handleGetUserFollowersByUserId } =
  //   useGetUserFollowersByUserId(userId);
  console.log(`OK:useFollowersPaginationの${userId}`);

  const handleGetFollowersByUserId = useCallback(
    async (page: number) => {
      try {
        const res = await getFollowersByUserId(page, itemsPerPage, userId);
        setFollowers(res.data.followers);
        setTotalFollowersCount(res.data.followersCount);
        // console.log(`OK:handleGetFollowersByUserIdのtotalFollowers:${res.data.followersCount}`);
        // console.log(`OK:handleGetFollowersByUserIdのfollowers:${JSON.stringify(res.data.followers)}`);
      } catch (err: any) {
        setAlertSeverity('error');
        // setAlertMessage(`${err.response.data.errors[0]}`);
        setAlertMessage(`${err.response.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  // router.queryの値が、初期レンダリング時にはまだundefinedである可能性がある為、条件分岐を記載
  useEffect(() => {
    if (userId !== undefined) {
      handleGetFollowersByUserId(currentPage);
    }
  }, [handleGetFollowersByUserId, currentPage, userId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { followers, totalFollowersCount, handlePageChange, currentPage };
};