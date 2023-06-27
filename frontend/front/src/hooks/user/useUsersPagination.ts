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
  // AlertContextから、setAlertMessage, setAlertOpen, setAlertSeverityを受け取る。
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  // 3 ユーザー一覧を取得して、ステートに格納し、ページネーションを表示し、ページをクリックした時の処理を定義
  const handleGetUsers = useCallback(
    async (page: number) => {
      try {
        // res:指定したページの指定した表示件数分のユーザーと総ユーザー数
        const res = await userIndex(page, itemsPerPage);
        // 指定したページの指定した表示件数分のユーザーの一覧をstateに格納
        setUsers(res.data.users);
        // 総ユーザー数をステートに格納する
        setTotalUsersCount(res.data.totalUsers);
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage(`${err.response.data.errors[0]}`);
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
3
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
4
[currentPage, handleGetUsers]
依存配列にcurrentPageとhandleGetUsersを指定する理由

currentPage
ページ番号が変更された時に、handleGetUsers関数を実行するためです。currentPageが変更されると、ページ番号に基づい
て異なるユーザー一覧を取得する必要があります。currentPageの値が変わるたびに、handleGetUsers関数が実行され、新し
いページ番号に基づいたユーザー一覧が取得されます。
currentPageが変化すると、新しいページのユーザー一覧を取得する必要があります。そのため、currentPageが変化した時に
handleGetUsersを実行します。

handleGetUsers
handleGetUsers関数自体も依存配列に含まれています。これは、handleGetUsers関数でで使用されている変数のpage,
itemsPerPageが変更される可能性があるためです。もし変更された場合、関数は変わりませんが、変数や値が変更されると、
依存配列が変更されたとみなされ。useEffectフックは再度実行されます。
この仕組みにより、最新のhandleGetUsers関数が適用され、期待通りの挙動を実現することができます。
handleGetUsers関数で参照している変数や値が変更されると、依存配列が変更されたとみなされます。その結果、useEffect
フックは再実行され、最新の値や状態を反映した処理が実行されます。
handleGetUsersが再生成されると（useCallbackの依存配列の値[itemsPerPage]が変わった場合）、その新しいバージョン
を使用してユーザー一覧を取得する必要があります。そのため、handleGetUsersが変化した時にも副作用関数を実行します。
handleGetUsersが依存配列に含まれていないと、handleGetUsersが再生成された時に副作用関数が実行されないため、最新の
handleGetUsersを使用してユーザー一覧を取得することができません。handleGetUsersが再生成されるたびに、useEffect
内のコードが再実行され、最新のhandleGetUsersを使用してユーザーデータを取得し、ページを更新することが保証されます。

================================================================================================
5
handlePageChange
ページネーションのページがクリックされた時に実行され、クリックされたページ番号を受け取り、
setCurrentPage関数を使用して現在のページ番号を更新します。

handlePageChange関数が発火すると、setCurrentPageが呼び出されてcurrentPageのステートが更新されます。
このcurrentPageの更新により、useEffectの依存配列にcurrentPageが含まれているため、useEffectが発火します。これに
よりhandleGetUsers関数が呼び出され、新しいページのユーザーデータが取得されます。
一方、useCallbackは依存配列にitemsPerPageとrouterが含まれているため、これらの値が変化しない限り発火しません。
handlePageChange関数はこれらの値を変更しないので、useCallbackは発火しません。
ただし、useCallbackによってメモ化されたhandleGetUsers関数がuseEffectによって呼び出されるため、関数自体は実行さ
れます。

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
