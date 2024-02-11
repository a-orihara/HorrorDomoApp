import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getFollowersByUserId } from '../../api/follow';
import { useAlertContext } from '../../contexts/AlertContext';
import { FollowUser } from '../../types/follow';

export const useFollowersPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのフォローユーザー一覧
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  // 指定したuserIdのフォローユーザーの総数
  const [totalFollowersCount, setTotalFollowersCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  // loading状態の管理。loading中はtrue/解説はuseFollowingPaginationの2へ
  const [isLoading, setIsLoading] = useState(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // console.log(`OK:useFollowersPaginationのfollowers:${JSON.stringify(followers)}`);

  const handleGetFollowersByUserId = useCallback(
    async (page: number) => {
      setIsLoading(true);
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
      }finally {
        // リクエスト完了後、ロードを停止する
        setIsLoading(false);
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

  return { followers, totalFollowersCount, handlePageChange, currentPage, isLoading };
};
