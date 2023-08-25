import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getUserFeed } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { Post } from '../../types/post';
import { User } from '../../types/user';

export const useFeedPagination = (itemsPerPage: number, userId: number) => {
  // 指定したuserIdのユーザーの投稿一覧
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  // 指定したuserIdのユーザーの投稿数
  const [totalFeedPostsCount, setTotalFeedPostsCount] = useState(0);
  // 指定idユーザーのfeedのusers
  const [feedUsers, setFeedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // 4 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetUserFeed = useCallback(
    async (page: number) => {
      try {
        // ユーザーのフィード情報を取得
        const res = await getUserFeed(page, itemsPerPage, userId);
        // 1 ユーザーとそのフォローユーザーの両方の、指定したページの1ページ当たりの表示件数分の投稿をセット
        setFeedPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿総数をセット
        setTotalFeedPostsCount(res.data.feedTotalCount);
        setFeedUsers(res.data.feedUsers);
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage(`${err.response.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
        alert('feedのエラー');
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  useEffect(() => {
    if (userId) {
      handleGetUserFeed(currentPage);
    }
  }, [currentPage, handleGetUserFeed, userId]);

  // 3
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange, currentPage };
};
