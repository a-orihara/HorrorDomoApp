import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { userIndex } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { User } from '../../types/user';

// ユーザー一覧ページネーション用のカスタムフック
export const useUsersPagination = (itemsPerPage: number) => {
  // 1 user一覧の状態を管理するステート。User型の配列を保持する。
  const [users, setUsers] = useState<User[]>([]);
  // 総ユーザー数を保持するステート
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  // 現在のページ番号を保持するステート
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  // 3.1 ユーザー一覧を取得して、ステートに格納し、ページネーションを表示し、ページをクリックした時の処理を定義
  const handleGetUsers = useCallback(
    async (page: number) => {
      try {
        // res:指定したページの指定した表示件数分のユーザーと総ユーザー数
        const res = await userIndex(page, itemsPerPage);
        // 指定したページの指定した表示件数分のユーザーの一覧をstateに格納
        setUsers(res.data.users);
        // 総ユーザー数をステートに格納する
        setTotalUsersCount(res.data.totalUsers);
        // 3.2
      } catch (err: any) {
        // userIndexのエラー処理
        setAlertSeverity('error');
        setAlertMessage("ユーザー情報を取得出来ませんでした");
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity]
  );

  // 4 ページネーションのページをクリックした時に実行、指定したページの指定した表示件数分のユーザーと総ユーザー数を取得
  useEffect(() => {
    handleGetUsers(currentPage);
  }, [currentPage, handleGetUsers]);

  // 5
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { users, totalUsersCount, handlePageChange };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
useState<User[]>() を使用して、users の型を User[] に設定します。これにより、users にはユーザー情報の配列が
格納されます。

================================================================================================
3.1
useCallbackは、Reactのフックの一つであり、コンポーネント内で定義された関数をキャッシュするためのメモ化関数です。
useCallbackを使用すると、同じ関数インスタンスを再生成せず、再利用することができ、パフォーマンスを改善することがで
きます。
第1引数には、メモ化する関数の定義を記述。第2引数には、依存関係を配列で指定する。
ReactのコンポーネントでReactPaginateを使用して非同期のAPI呼び出しを行う場合、useEffectとuseCallbackを使うこ
とが一般的です。
useEffectの依存関係に関数を入れると、再評価されるたびにuseEffectが実行され、無限ループが発生するためです。
------------------------------------------------------------------------------------------------
[itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity]
useCallbackは第二引数の依存配列の値が変化した時にのみコールバック関数を再生成します。
ここではitemsPerPageとrouterが依存配列に指定されており、これらの値が変わった時にのみhandleGetUsers関数が再生
成されます。
itemsPerPageはユーザー一覧取得の際に1ページあたりの表示件数として使用されます。この値が変化すると取得するユーザー
一覧が変わるため、handleGetUsers関数を再生成する必要があります。
routerはエラー発生時にルートへリダイレクトするために使用されます。通常、router自体の値が変わることはありませんが、
依存配列に含めることでrouterの参照が常に最新のものであることを保証します。
------------------------------------------------------------------------------------------------
（setAlertMessage, setAlertOpen,setAlertSeverity）を指定する理由
useCallbackフックは、特定の関数をメモ化するためのフックです。メモ化とは、同じ引数で関数が呼ばれた場合に、前回の結
果を再利用することです。
useCallbackは、依存配列（第二引数）に指定された変数が変化した時のみ新しい関数を生成します。それ以外の時は、以前の
関数を再利用します。
依存配列に指定されていない変数がその関数内で使われると、その変数が変更されたときにも関数が新しく生成されず、古い値を
参照し続けてしまいます。そのため、関数内で使用している変数は依存配列に含める必要があります。
useCallbackフックは、その依存配列にリストされた値が変更されたときだけ再計算される関数をメモ化します。
を使用しているために発生しています。依存配列に含まれていない変数を使用すると、その変数の値が変更されても、
useCallbackでメモ化された関数は更新されません。
useAlertContextというカスタムフックから得られているこれらの関数（setAlertMessage,
setAlertOpen,setAlertSeverity）は、状態変更関数です。つまり、これらはReactの状態を変更するための関数です。
useCallback内でこれらの関数を利用している場合、それらは依存配列に含めるべきです。なぜなら、これらの関数が変わると、
useCallbackで作られた関数の動作が変わる可能性があるからです。

================================================================================================
3.2
バックエンドの `users_controller.rb` の `index` アクションにエラー処理がなくても、`useUsersPagination` フ
ック内の `handleGetUsers` のエラー処理は発火して有効です。
- バックエンドで問題が発生した場合 (サーバーエラーやデータベースエラーなど)、通常はエラーレスポンスを返します。エラ
ーレスポンスには HTTP エラーのステータスコードなどが含まれます。
- バックエンドがエラーに遭遇してエラーレスポンスを送り返すと、 `handleGetUsers` の `catch` ブロックが実行。
- エラーだと、Axiosのプロミスは拒否されます。プロミスが拒否されると、コントロールは `catch` に移動する


================================================================================================
4
[currentPage, handleGetUsers]
依存配列にcurrentPageとhandleGetUsersを指定する理由
------------------------------------------------------------------------------------------------
currentPage
ページ番号が変更された時に、handleGetUsers関数を実行するためです。currentPageが変更されると、ページ番号に基づい
て異なるユーザー一覧を取得する必要があります。currentPageの値が変わるたびに、handleGetUsers関数が実行され、新し
いページ番号に基づいたユーザー一覧が取得されます。
currentPageが変化すると、新しいページのユーザー一覧を取得する必要があります。そのため、currentPageが変化した時に
handleGetUsersを実行します。
------------------------------------------------------------------------------------------------
**handleGetUsers関数とuseEffectフックの関係**
- `handleGetUsers` 関数は、指定されたページのユーザー一覧を取得します。
- この関数は `useCallback` フックによって定義されており、`itemsPerPage` が変更された場合にのみ再生成されます。
- `useEffect` フックは、現在のページ (`currentPage`) が変更されるたびに `handleGetUsers` を実行します。ま
た、`handleGetUsers` 自体が変更された場合にも実行されます。
- `handleGetUsers` が変更された場合、`useEffect` フックが再実行されることで、常に最新の状態に基づいてユーザー
一覧の取得が行われます。
- このように、`useEffect` と `handleGetUsers` の関係を適切に設定することで、ページネーションの処理が正しく機
能するようになっています。

================================================================================================
5
handlePageChange
ページネーションのページがクリックされた時に実行され、クリックされたページ番号を受け取り、
setCurrentPage関数を使用して現在のページ番号を更新します。
クリックされたページ番号をは、react-paginateから持って来たReactPaginateコンポーネントとの関連で受け取ります。
------------------------------------------------------------------------------------------------
(selectedItem: { selected: number })
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
. `handlePageChange`は`ReactPaginate`コンポーネントの`onPageChange`プロパティに指定されたコールバック関数
です。
. ユーザーがページネーションで新しいページを選択すると、`ReactPaginate`はこの`onPageChange`関数を自動的に呼び
出します。
. `ReactPaginate`は`onPageChange`関数を呼び出すとき、その引数として選択されたページの情報を含むオブジェクトを
渡します。このオブジェクトには`selected`という名前のプロパティがあり、これが新しく選択されたページの番号（0から始
まる）です。
. したがって、`handlePageChange`関数が呼び出されると、その引数として`selected`プロパティを持つオブジェクト
（`selectedItem`）が渡されます。
. `handlePageChange`関数内で、`setCurrentPage(selectedItem.selected)`という記述により、ステートの現在の
ページ番号が新しく選択されたページの番号に更新されます。
以上の流れにより、ページネーションでページ遷移するたびに、新しく選択されたページの内容が取得されて表示されます。

@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
初回レンダリング時
Indexコンポーネントがレンダリングされると、初期化時のステート設定が行われます。ここでcurrentPageは0に設定されます。
useStateフックによって、users, totalUsers, currentPageの初期値が設定される。
次に、useCallbackフックが発火し、handleGetUsers関数が定義されます。この時、依存配列にitemsPerPageとrouterが指
定されていますが、これらの値は変化しないので、この関数は基本的に再生成されません。
useEffectフックが発火します。依存配列にcurrentPageとhandleGetUsersが指定されているため、これらの値の変化により
今後handleGetUsersが再実行されます。
handleGetUsers関数は、userIndex関数を使用して、指定されたページのユーザー一覧を取得する。
初回レンダリング時、currentPageは0なので、handleGetUsersが実行され、ページ0（最初のページ）のユーザーデータを取
得します。
------------------------------------------------------------------------------------------------
handlePageChange着火時
ページネーションのページがクリックされると、handlePageChangeが発火します。
handlePageChangeが呼び出されると、setCurrentPageが実行されてcurrentPageのステートが更新され、選択されたページ
の番号が保存されます。これによりページが更新されます。
currentPageが更新されると、useEffectフックが発火します。これはcurrentPageがuseEffectの依存配列に含まれているた
めです。
useEffect内で、新しく設定されたcurrentPage値を元にhandleGetUsersが実行され、新しいページのユーザーデータを取得
します。
handleGetUsersにより、userIndex関数を使用して、取得したユーザー一覧と総ユーザー数をuseStateフックを使ってusers
とtotalUsersに格納する。
一方、useCallbackは依存配列にitemsPerPageとrouterが含まれているため、これらの値が変化しない限り発火しません。
handlePageChange関数はこれらの値を変更しないので、useCallbackは発火しません。
ただし、useCallbackによってメモ化されたhandleGetUsers関数がuseEffectによって呼び出されるため、関数自体は実行さ
れます。
*/
