import { useCallback, useEffect, useState } from 'react';
import { getUserLikedPostsByUserId } from '../../api/like';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { useAlertContext } from '../../contexts/AlertContext';

// 指定userIDのlikedPost一覧、likedPost総数、現在のページ番号を返す
export const useLikedPostsPagination = (itemsPerPage: number, userId?: number) => {
  // 指定userIdのlikedPost一覧
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  // 指定userIdのlikedPost総数
  const [totalLikedPostsCount, setTotalLikedPostsCount] = useState(0);
  // 指定userIdのlikedUser一覧
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();


  // currentUserがいいねした投稿の集合と、その総数を取得し、currentUserのstateに格納する
  const handleGetUserLikedPostsByUserId = useCallback(
    async (userId: number | undefined, page: number, itemsPerPage: number) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        // currentUserがいいねした投稿の集合と、その総数を取得する
        const data = await getUserLikedPostsByUserId(userId, page, itemsPerPage);
        if (data.status === 200) {
          const likedPost: Post[] = data.data.likedPosts;
          setLikedPosts(likedPost);
          const totalLikedCount: number = data.data.totalLikedCounts;
          setTotalLikedPostsCount(totalLikedCount);
          const likedUsers: User[] = data.data.likedUsers;
          // console.log(`likedUsers: ${JSON.stringify(likedUsers)}`);
          setLikedUsers(likedUsers);
        }
      } catch (err:any) {
        setAlertSeverity('error');
        setAlertMessage(err.response.message);
        setAlertOpen(true);
      }finally {
        // リクエスト完了後、ロードを停止する
        setIsLoading(false);
      }
    },
    [setAlertSeverity,setAlertMessage,setAlertOpen]
  );

  useEffect(() => {
    handleGetUserLikedPostsByUserId(userId, currentPage, itemsPerPage);
  }, [currentPage, userId, itemsPerPage, handleGetUserLikedPostsByUserId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { likedPosts, totalLikedPostsCount, likedUsers, handlePageChange, currentPage, isLoading };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
