import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getPostListByUserId } from '../../api/post';
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

  // 4 指定したuserIdのユーザーの投稿一覧を取得、post一覧と全post数をステートに格納。
  // 引数pageは、ページネーションで選択したページ。
  const handleGetPostListByUserId = useCallback(
    async (page: number) => {
      console.log('%chandleGetPostListByUserIdが発火', 'color: yellow;');
      try {
        // 指定したuserIdのpostの総数と、指定したページの1ページ当たりの表示件数分のpostを取得
        // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
        const res = await getPostListByUserId(page, itemsPerPage, userId);
        // 1 指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分のpostをセット
        setPosts(res.data.data);
        // 指定したuserIdのユーザーの投稿総数をセット
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
    handleGetPostListByUserId(currentPage);
  }, [currentPage, handleGetPostListByUserId]);

  // 3
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { posts, totalPostsCount, handlePageChange, currentPage };
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

1. `handlePageChange`は`ReactPaginate`コンポーネントの`onPageChange`プロパティに指定されたコールバック関数
です。
2. ユーザーがページネーションで新しいページを選択すると、`ReactPaginate`はこの`onPageChange`関数を自動的に呼び
出します。
3. `ReactPaginate`は`onPageChange`関数を呼び出すとき、その引数として選択されたページの情報を含むオブジェクトを
渡します。このオブジェクトには`selected`という名前のプロパティがあり、これが新しく選択されたページの番号（0から始
まる）です。
4. したがって、`handlePageChange`関数が呼び出されると、その引数として`selected`プロパティを持つオブジェクト
（`selectedItem`）が渡されます。
5. `handlePageChange`関数内で、`setCurrentPage(selectedItem.selected)`という記述により、ステートの現在の
ページ番号が新しく選択されたページの番号に更新されます。

以上の流れにより、ページネーションでページ遷移するたびに、新しく選択されたページの内容が取得されて表示されます。
================================================================================================
4
`handleGetPostListByUserId`の引数 `(page: number)` は、`ReactPaginate` コンポーネントから来ています。

1. `ProfilePage`コンポーネントで `usePostsPagination` フックを呼び出し、その結果として得られた
`handlePageChange` 関数が `PostsPagination` コンポーネントの `handlePageChange` プロップとして渡される。
2. `PostsPagination`コンポーネントは、この `handlePageChange` プロップを `ReactPaginate` コンポーネントの
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
