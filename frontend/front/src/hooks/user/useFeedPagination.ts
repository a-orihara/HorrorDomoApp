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

  // 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetUserFeed = useCallback(
    async (page: number) => {
      try {
        // 1 ユーザーのフィード情報を取得
        const res = await getUserFeed(page, itemsPerPage, userId);
        // ユーザーとそのフォローユーザーの両方の、指定したページの1ページ当たりの表示件数分の投稿をセット
        setFeedPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿総数をセット
        setTotalFeedPostsCount(res.data.feedTotalCount);
        setFeedUsers(res.data.feedUsers);
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage(`${err.response.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  useEffect(() => {
    if (userId) {
      handleGetUserFeed(currentPage);
    }
  }, [currentPage, handleGetUserFeed, userId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange, currentPage };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- ユーザーがページネーションコントロールを操作して特定のページを選択した時に、そのページ番号がhandleGetUserFeed
関数に渡され、選択されたページに対応するフィードのデータを取得するために使われます。
------------------------------------------------------------------------------------------------
- useFeedPagination` フック内の `handleGetUserFeed` 関数の `page` 引数は、アプリケーションのフロントエン
ドに実装されているページネーションの仕組みに由来します。この引数の値はページネーションコンポーネント
(`ReactPaginate`) とユーザーとの対話によって決定されます。
------------------------------------------------------------------------------------------------
- useFeedPagination`フックは状態変数 `currentPage` を保持し、この変数は `0` に初期化される。この状態は、ユ
ーザがフィードを表示している現在のページ番号を表す。
------------------------------------------------------------------------------------------------
- このフックは関数 `handlePageChange` を提供します。これは、ページネーションコンポーネントとの対話に基づいて
`currentPage` の状態を更新するためのものです。この関数は `selected` プロパティを持つオブジェクト (新しいページ
が選択されたときに `ReactPaginate` によって提供される) を受け取り、新しく選択されたページを反映するために
`currentPage` を更新します。
------------------------------------------------------------------------------------------------
- ユーザーがページネーションコンポーネントを使用してページを選択すると、 `ReactPaginate` は選択されたページイン
デックス (ゼロベース) を使用して `handlePageChange` 関数をトリガーする。この関数は `currentPage` の状態を新
しいページ番号で更新する。
------------------------------------------------------------------------------------------------
- UseFeedPagination` 内の `useEffect` フックは `currentPage` ステートの変更を監視する。currentPage` が
変化するたびに（ユーザーが新しいページを選択したことを示す）、 `useEffect` フックは自動的に `currentPage` の現
在の値を引数として `handleGetUserFeed` を呼び出す。
------------------------------------------------------------------------------------------------
- handleGetUserFeed` 関数はこの `page` 引数を使用して、フィードデータの対応するページをバックエンド API に要
求します。
*/
