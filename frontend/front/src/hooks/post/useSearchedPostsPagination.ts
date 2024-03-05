import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getSearchedPosts } from '../../api/post';
import { Post } from '../../types/post';
import { User } from '../../types/user';

export const useSearchedPostsPagination = (itemsPerPage: number, query: string) => {
  // タイトル検索したsearchedPost一覧
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  // タイトル検索したsearchedPostの総数
  const [searchedTotalPostsCount, setSearchedTotalPostsCount] = useState(0);
  const [searchedPostUsers, setSearchedPostUsers] = useState<User[]>([]);
  // 説明はuseLikedPostsPaginationの1.1へ 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  // loading状態の管理。loading中はtrue
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 4 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetSearchedPosts = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        // 指定したuserIdのpostの総数と、指定したページの1ページ当たりの表示件数分のpostを取得
        // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
        const res = await getSearchedPosts({ query, page, itemsPerPage });
        // 1 指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分のpostsをセット
        setSearchedPosts(res.data.posts);
        // 指定したuserIdのユーザーの投稿総数をセット
        setSearchedTotalPostsCount(res.data.totalPostsCount);
        setSearchedPostUsers(res.data.users);
      } catch (err: any) {
        console.log("投稿を取得出来ませんでした");
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }finally {
        // リクエスト完了後、ロードを停止する
        setIsLoading(false);
      }
    },
    [itemsPerPage, router, query]
  );

  // useUsersPaginationの4を参照
  useEffect(() => {
    handleGetSearchedPosts(currentPage);
  }, [currentPage, handleGetSearchedPosts]);

  // 3と説明はuseLikedPostsPaginationの1.2へ
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return {
    searchedPosts,
    searchedTotalPostsCount,
    searchedPostUsers,
    handlePageChange,
    currentPage,
    handleGetSearchedPosts,
    isLoading
  };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
railsから、render json: { status: '200', data: @posts, total_posts: total_posts }を受け取るので、
(res.data.data)でpostsの配列を取得する。

================================================================================================
2
railsから来たtotal_postsキーが、applyCaseMiddlewareにより、totalPostsキーに変換されるため、
setTotalPostsCount(res.data.totalPosts);で受け取る。

================================================================================================
3
handlePageChange
ページネーションのページがクリックされた時に実行され、クリックされたページ番号を受け取り、
setCurrentPage関数を使用して現在のページ番号を更新します。
------------------------------------------------------------------------------------------------
(selectedItem: { selected: number }) *ReactPaginateによって渡される
引数はselectedプロパティを持つオブジェクトです。selectedプロパティには、クリックされたページ番号が格納されます。
------------------------------------------------------------------------------------------------
handlePageChange関数が発火すると、setCurrentPageが呼び出されてcurrentPageのステートが更新されます。
このcurrentPageの更新により、useEffectの依存配列にcurrentPageが含まれているため、useEffectが発火します。これに
よりhandleGetUsers関数が呼び出され、新しいページのユーザーデータが取得されます。
一方、useCallbackは依存配列にitemsPerPageとrouterが含まれているため、これらの値が変化しない限り発火しません。
handlePageChange関数はこれらの値を変更しないので、useCallbackは発火しません。
ただし、useCallbackによってメモ化されたhandleGetUsers関数がuseEffectによって呼び出されるため、関数自体は実行さ
れます。
------------------------------------------------------------------------------------------------
`selectedItemオブジェクト`は、`ReactPaginate` コンポーネントからページ遷移時に提供されます。
. `ReactPaginate`は`onPageChange`関数を呼び出すとき、その引数として選択されたページの情報を含むオブジェクトを
渡します。このオブジェクトには`selected`という名前のプロパティがあり、これが新しく選択されたページの番号（0から始
まる）です。

================================================================================================
4
`handleGetPostListByUserId`の引数 `(page: number)` は、`ReactPaginate` コンポーネントから来ています。

1. `ProfilePage`コンポーネントで `useSearchedPostsPagination` フックを呼び出し、その結果として得られた
`handlePageChange` 関数が `SearchedPostsPagination` コンポーネントの `handlePageChange` プロップとして渡される。
2. `SearchedPostsPagination`コンポーネントは、この `handlePageChange` プロップを `ReactPaginate` コンポーネントの
`onPageChange` プロップとして渡す。
3. `ReactPaginate` コンポーネントはページネーションを制御します。ユーザーがページネーションの異なる部分をクリック
すると、その新しいページ番号（0から始まるインデックス）を含むオブジェクト `{selected: number}` を
`onPageChange` プロップに渡された関数（ここでは `handlePageChange`）に引数として渡します。
------------------------------------------------------------------------------------------------
handleGetPostListByUserId の引数 page: number は、ReactPaginate から渡される {selected: number} オブ
ジェクトからくる。これが可能なのは、handlePageChange 関数が内部で handleGetPostListByUserId を呼び出し、そ
の際に selected 値を page 引数として渡しているから。
以下のようなイメージになります。
const handlePageChange = (data: { selected: number }) => {
  // ReactPaginateからの新しいページ番号(selected)を使用してhandleGetPostListByUserIdを呼び出す。
  handleGetPostListByUserId(data.selected, itemsPerPage, userId);
};

*/
