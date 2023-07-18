import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAlertContext } from '../../contexts/AlertContext';
import { FollowUser } from '../../types/relationship';
import { useGetUserFollowingByUserId } from './useGetUserFollowingByUserId';

export const useFollowingPagination = (userId: number | undefined) => {
  // 指定したuserIdのフォローユーザー一覧
  const [followingIndex, setFollowingIndex] = useState<FollowUser[]>([]);
  // 指定したuserIdのフォローユーザーの総数
  const [totalFollowingCount, setTotalFollowingCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  const { followingCount, following, followingPagination, handleGetUserFollowingByUserId } =
    useGetUserFollowingByUserId(userId);

  useEffect(() => {
    handleGetUserFollowingByUserId();
  }, [handleGetUserFollowingByUserId]);
};
