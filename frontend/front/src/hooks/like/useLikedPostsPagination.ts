import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getUserLikedPostsByUserId } from '../../api/like';
// import { useAlertContext } from '../../contexts/AlertContext';
import { Post } from '../../types/post';
import { User } from '../../types/user';
// import { useLikeContext } from '../../contexts/LikeContext';

// 指定userIDのlikedPost一覧、likedPost総数、現在のページ番号を返す
export const useLikedPostsPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのlikedPost一覧
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  // 指定したuserIdのlikedPost総数
  const [totalLikedPostsCount, setTotalLikedPostsCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  // const {
  //   handleGetTotalLikesCountByCurrentUserId,
  //   handleGetTotalLikesCountByOtherUserId,
  //   currentUserLikedPosts,
  //   currentUserLikedPostCount,
  //   otherUserLikedPosts,
  //   handleGetCurrentUserLikedPosts,
  // } = useLikeContext();
  // const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // currentUserがいいねした投稿の集合と、その総数を取得し、currentUserのstateに格納する
  const handleGetCurrentUserLikedPosts = useCallback(
    async (userId: number | undefined, page: number, itemsPerPage: number) => {
      if (!userId) return;
      try {
        // currentUserがいいねした投稿の集合と、その総数を取得する
        const data = await getUserLikedPostsByUserId(userId, page, itemsPerPage);
        if (data.status === 200) {
          const likedPost: Post[] = data.data.likedPosts;
          setLikedPosts(likedPost);
          const totalLikedCount: number = data.data.totalLikedCounts;
          setTotalLikedPostsCount(totalLikedCount);
          const likedUsers: User[] = data.data.likedUsers;
          console.log(`likedUsers: ${JSON.stringify(likedUsers)}`);
          setLikedUsers(likedUsers);
        }
      } catch (err) {
        // ◆エラー仮実装
        alert('ユーザーが存在しません');
      }
    },
    []
  );

  useEffect(() => {
    handleGetCurrentUserLikedPosts(userId, currentPage, itemsPerPage);
  }, [currentPage, userId, itemsPerPage, handleGetCurrentUserLikedPosts]);

  // 3
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { likedPosts, totalLikedPostsCount, likedUsers, handlePageChange, currentPage };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
