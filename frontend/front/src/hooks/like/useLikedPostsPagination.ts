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
  // 1.1 現在のページ番号
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
        console.log(`注目handleGetUserLikedPostsByUserIdの:${currentPage}`)
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

  // 1.2
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { likedPosts, totalLikedPostsCount, likedUsers, handlePageChange, currentPage, isLoading };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
. **currentPage` の初期値が 0 である理由と `forcePage` との関係:**
- useLikedPostsPagination` の `currentPage` の初期値は 0 に設定され、ページ分割の開始点を示す。このアプロー
チは、APIとやりとりするときや、フロントエンドでリスト/配列を管理するときに、ページオフセットの計算とデータの最初のペ
ージへのアクセスを単純化します。
- Pagination` コンポーネントの `forcePage` プロパティは、この `currentPage` の状態に直接関係する。forcePage`
を `currentPage` に設定することで、ページネーションコンポーネントは `currentPage` インデックスに対応するページ
をアクティブページとしてレンダリングするように指示される。これにより、ページネーションの UI は常に
`useLikedPostsPagination` フックによって管理される現在のページ状態と同期され、一貫性のある直感的なユーザーエク
スペリエンスが提供される。
------------------------------------------------------------------------------------------------
.`currentPage`の初期値が0であることは、最初のページ（この文脈では0番目のインデックスと見なされる）でページネーシ
ョン状態を初期化するために重要である。
- currentPage`の初期値が0であることは、最初のページ(この文脈では0番目のインデックスと見なされる)でページネーショ
ンの状態を初期化するために重要である。この設定はページ分割ロジックの基礎となるもので、コンポーネントがマウントされた
ときに、気に入った投稿の最初のページをロードしようとすることを保証します。
- handleGetUserLikedPostsByUserId` において、 `page` 引数はリクエストされた現在のページを表します。しかし、
`getUserLikedPostsByUserId` を通してバックエンドとやり取りする場合、ページ番号は 1 ずつ増加する (`page: page + 1`) 。
この調整が必要なのは、バックエンド API がページ分割を 1 ページ目から開始することを期待しているのに対し、フロントエ
ンドのページ分割ロジックは 0 ページ目から開始するからです。
- setCurrentPage` 関数は `handlePageChange` によって呼び出され、ページネーションコンポーネントとのユーザーイ
ンタラクションに基づいて `currentPage` の状態を更新する。ユーザーが別のページを選択すると、`handlePageChange`
は `currentPage` を更新し、`currentPage` の変更をリッスンするエフェクトフックを通して、新しいページに対する「
いいね！」された投稿の再取得をトリガーする。これにより、ユーザーのページ選択に基づいて UI と取得されたデータが常に同
期される、動的でレスポンシブなページネーションシステムが作成される。

================================================================================================
1.2
.**handlePageChange`はいつ発生しますか？
- handlePageChange` は、ユーザが `ReactPaginate` コンポーネント内のページネーションコントロールを操作したとき。
具体的には、前のラベル<(`previousLabel`)、次のラベル>(`nextLabel`)、またはコンポーネントによって表示されたペー
ジ番号のいずれかをクリックしたときに発生します。
------------------------------------------------------------------------------------------------
. **handlePageChange` の動作メカニズム：*** `handlePageChange` 関数は、ページ分割されたデータセット内のペー
ジ遷移を管理するように設計されています。
- handlePageChange` 関数は、ページ分割されたデータセット内のページ遷移を管理するために設計されています。通常は
`selected` プロパティを含むイベントオブジェクトを受け取ることによって動作する。
- イベントオブジェクトを呼び出すと、 `handlePageChange` は `selected` ページインデックスを指定して
`setCurrentPage` を呼び出すことで、 `useLikedPostsPagination` フック内の `currentPage` 状態を更新する。
この状態の更新は、フックを使用してコンポーネントを再レンダリングするトリガーとなる。
- 同時に、依存関係に `currentPage` を持つ `useEffect` フックが有効になる。このフックは
`handleGetUserLikedPostsByUserId` を呼び出し、更新された `currentPage` インデックスで API リクエストを行
うことで、新しく選択されたページのデータを取得する。
- このメカニズムにより、表示されるコンテンツがユーザーによって選択されたページに対応することが保証され、ページ分割
されたデータに対してインタラクティブで直感的なナビゲーション体験を提供することができる。handlePageChange`、ステ
ート管理、エフェクト駆動型のデータ取得の間のシームレスな相互作用が、このレスポンシブなページネーションシステムの中核
を形成している。
------------------------------------------------------------------------------------------------
. **selected`プロパティとは何ですか？
- selected`プロパティは、ユーザが移動した新しいページのインデックスを表します。これは、ユーザがページネーションコン
トロールを操作したとき（例えば、ページ番号や次のボタン、前のボタンをクリックしたとき）に `handlePageChange` 関数
に提供されるオブジェクトの一部です。
. **なぜ引数はオブジェクトなのか？
- 引数（`selectedItem: { selected: number }`）がオブジェクトであるのは、`ReactPaginate`コンポーネントが、
自身のプロパティの`onPageChange`コールバックを呼び出す際に、ページ番号（`selected`インデックス）と一緒に追加情
報を渡すように設計されているからです。この設計により、関数のシグネチャを変更することなく、より多くのデータを渡す必要
がある場合でも、より柔軟に拡張することができます。
. **この値はどこから来るのか？
- この値は `ReactPaginate` コンポーネントから直接得られます。ユーザーが特定のページ番号、または次/前のボタンをク
リックすると、`ReactPaginate`は内部的に新しい現在のページを反映するために状態を更新し、イベントオブジェクトの一部
として新しいページインデックスで`onPageChange`コールバックプロップ（この場合、`handlePageChange`）を呼び出しま
す。その際引数が渡される。
- **簡略化した説明
- ページ数の多い本があり、現在5ページにいるとします。あなたは7ページに行きたい。あなたが私（`ReactPaginate`コンポ
ーネント）に7ページに移動するように言うと、私（ReactPaginateコンポーネント）は「わかりました、7ページに移動します
」と言い、あなた（`handlePageChange`関数）に`selected: 6`というノート（`selectedItem`オブジェクト）を渡しま
す（コンテキスト内のページ番号は0から始まるので、7ページはインデックス6です）。このノートによって、どのページをリクエ
ストしたかが正確にわかるので、アプリケーションの残りの部分（そのページのデータを取得するなど）に、7ページに関連する情
報を表示するように更新するように指示することができます。
*/
