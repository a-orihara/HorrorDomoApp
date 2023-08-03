import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getPostListByUserId } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';
import { useLikeContext } from '../../contexts/LikeContext';
import { Post } from '../../types/post';

// 指定userIDのlikedPost一覧、likedPost総数、現在のページ番号を返す
export const useLikedPostsPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのlikedPost一覧
  const [LikedPosts, setLikedPosts] = useState<Post[]>([]);
  // 指定したuserIdのlikedPost総数
  const [totalLikedPostsCount, setTotalLikedPostsCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const {
    handleGetTotalLikesCountByCurrentUserId,
    handleGetTotalLikesCountByOtherUserId,
    currentUserLikedPosts,
    otherUserLikedPosts,
  } = useLikeContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // 指定userIdのlikedPost一覧を取得、likedPost一覧とlikedPost総数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetPostListByUserId = useCallback(
    async (page: number) => {
      // console.log('handleGetPostListByUserIdが発火');
      try {
        // 指定したuserIdのpostの総数と、指定したページの1ページ当たりの表示件数分のpostを取得
        // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
        const res = await getPostListByUserId(page, itemsPerPage, userId);
        // 1 指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分のpostをセット
        setLikedPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿総数をセット
        setTotalLikedPostsCount(res.data.totalPosts);
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage(`${err.response.data.errors[0]}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  useEffect(() => {
    handleGetPostListByUserId(currentPage);
  }, [currentPage, handleGetPostListByUserId]);

  // 3
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { posts, totalLikedPostsCount, handlePageChange, currentPage };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
