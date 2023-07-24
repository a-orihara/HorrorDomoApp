import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getUserFeed } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { Post } from '../../types/post';

export const useFeedPagination = (itemsPerPage: number, userId: number) => {
  // 指定したuserIdのユーザーの投稿一覧
  const [posts, setPosts] = useState<Post[]>([]);
  // 指定したuserIdのユーザーの投稿数
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // 4 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetUserFeed = useCallback(
    async (page: number) => {
      // ユーザーが認証されていない場合、処理を終了する
      if (!userId) {
        return;
      }
      // console.log('handleGetPostListByUserIdが発火');
      try {
        // 指定したuserIdのpostの総数と、指定したページの1ページ当たりの表示件数分のpostを取得
        // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
        const res = await getUserFeed(page, itemsPerPage, userId);
        // 1 指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分のpostをセット
        setPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿総数をセット
        setTotalPostsCount(res.data.totalCount);
      } catch (err: any) {
        // setAlertSeverity('error');
        // setAlertMessage(`${err.response.data.errors[0]}`);
        // setAlertOpen(true);
        // setTimeout(() => {
        //   router.push('/');
        // }, 2000);
        alert('feedのエラー');
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  // useEffect(() => {
  //   handleGetUserFeed(currentPage);
  // }, [currentPage, handleGetUserFeed]);
  useEffect(() => {
    if (userId) {
      handleGetUserFeed(currentPage);
    }
  }, [currentPage, handleGetUserFeed, userId]);

  // 3
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { posts, totalPostsCount, handlePageChange, currentPage };
};
