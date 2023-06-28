import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getPostIndexByUserId } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';
import { Post } from '../../types/post';

export const usePostsPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのユーザーの投稿一覧
  const [posts, setPosts] = useState<Post[]>([]);
  // 指定したuserIdのユーザーの投稿数
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納
  const handleGetPostIndexByUserId = useCallback(
    async (page: number) => {
      try {
        // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
        const res = await getPostIndexByUserId(page, itemsPerPage, userId);
        // 1 指定したuserIdのユーザーの投稿一覧をセット
        setPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿数をセット
        setTotalPostsCount(res.data.totalPosts);
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
    handleGetPostIndexByUserId(currentPage);
  }, [currentPage, handleGetPostIndexByUserId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { posts, totalPostsCount, handlePageChange };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
railsから、render json: { status: '200', data: @posts, total_posts: total_posts }を受け取るので、
(res.data.data)でpostsの配列を取得する。
2
railsから来たtotal_postsキーが、applyCaseMiddlewareにより、totalPostsキーに変換されるため、
setTotalPostsCount(res.data.totalPosts);で受け取る。
*/
