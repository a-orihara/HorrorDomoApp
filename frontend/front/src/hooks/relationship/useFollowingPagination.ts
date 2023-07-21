import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getFollowingByUserId } from '../../api/follow';
import { useAlertContext } from '../../contexts/AlertContext';
import { FollowUser } from '../../types/relationship';

export const useFollowingPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのフォローユーザー一覧
  const [following, setFollowing] = useState<FollowUser[]>([]);
  // 指定したuserIdのフォローユーザーの総数
  const [totalFollowingCount, setTotalFollowingCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // const { followingCount, following, followingPagination, handleGetUserFollowingByUserId } =
  //   useGetUserFollowingByUserId(userId);
  console.log(`OK:useFollowingPaginationの${userId}`);

  const handleGetFollowingByUserId = useCallback(
    async (page: number) => {
      try {
        const res = await getFollowingByUserId(page, itemsPerPage, userId);
        setFollowing(res.data.following);
        setTotalFollowingCount(res.data.followingCount);
        // console.log(`OK:handleGetFollowingByUserIdのtotalFollowing:${res.data.followingCount}`);
        // console.log(`OK:handleGetFollowingByUserIdのfollowing:${JSON.stringify(res.data.following)}`);
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
      handleGetFollowingByUserId(currentPage);
    }
  }, [handleGetFollowingByUserId, currentPage, userId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { following, totalFollowingCount, handlePageChange, currentPage };
};
