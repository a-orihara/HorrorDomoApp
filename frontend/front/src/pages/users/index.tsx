import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { userIndex } from '../../api/user';
import AlertMessage from '../../components/atoms/AlertMessage';
import UserListItem from '../../components/atoms/UserListItem';
import Layout from '../../components/layout/Layout';
import { User } from '../../types';

const Index = () => {
  // 1 user一覧の状態を管理するステート
  const [users, setUsers] = useState<User[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  // 総ユーザー数を保持するステート
  const [totalUsers, setTotalUsers] = useState(0);
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  // 3 ユーザー一覧を取得する関数
  const handleGetUsers = useCallback(
    async (page: number) => {
      try {
        // userIndex関数を使用して、ユーザー一覧を取得する
        const res = await userIndex(page, itemsPerPage);
        console.log(`handleGetUsersのres.data.users:${JSON.stringify(res.data.users)}`);
        console.log(`handleGetUsersのres.data:${JSON.stringify(res.data)}`);
        // ユーザー一覧をステートに格納する
        setUsers(res.data.users);
        setTotalUsers(res.data.totalUsers);
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage(`${err.response.data.errors[0]}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router]
  );

  // 4 ページネーションのページをクリックした時に実行される関数
  useEffect(() => {
    handleGetUsers(currentPage);
  }, [currentPage, handleGetUsers]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };
  // ================================================================================================
  return (
    <Layout title={'Users'}>
      <div className='flex flex-1 flex-col'>
        <div className='flex flex-1 flex-col'>
          {/* h1タグに挟まれた文字列は、h1タグの子要素 */}
          <h1 className='mx-auto mb-2 flex h-10 items-center justify-center text-lg font-semibold sm:text-2xl md:h-14 md:text-4xl'>
            All Users
          </h1>
          <ul className='flex flex-1 flex-col justify-around'>
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </ul>
        </div>
        {/* 2 */}
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={Math.ceil(totalUsers / itemsPerPage)} // 総ユーザー数とアイテム数からページ数を計算
          marginPagesDisplayed={1} //先頭(前)と末尾(後)に表示する何ページ目の数。今回は2としたので、前1,2,…,7,8後のように表示されます。
          pageRangeDisplayed={1} //上記の「今いるページの前後」の番号をいくつ表示させるかを決めます。
          onPageChange={handlePageChange}
          containerClassName={'pagination justify-around flex space-x-3 h-12 md:text-2xl text-xl'}
          activeClassName={'active bg-basic-pink'}
        />
      </div>
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        severity={alertSeverity}
        message={alertMessage}
      ></AlertMessage>
    </Layout>
  );
};

export default Index;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
useState<User[]>() を使用して、users の型を User[] に設定します。これにより、users にはユーザー情報の配列が
格納されます。

================================================================================================
2
<li> タグがReactPaginate内で使用されている
ReactPaginateコンポーネントは、その内部でHTMLの一部（<ul>や<li>など）を生成しています。
ReactPaginateは、ページネーションの各ページ番号をリスト形式で表示するために、内部的に<li>タグを使用しています。
つまり内部で<li>タグが生成され、それがブラウザに表示されます。
これらのHTML要素は、ブラウザのデフォルトのスタイルが適用されます。たとえば、<li>タグはデフォルトでブロックレベル要
素として扱われ、縦に並ぶようになっています。これを変更するには、CSSを用いてスタイルを上書きする必要があります。

------------------------------------------------------------------------------------------------
Math:
JavaScriptにおける組み込みオブジェクトの一つ。数学的な定数や関数が含まれています。例えば、整数をランダムに生成する
関数、小数点以下を切り上げる関数など。
ceil関数:
引数で与えられた数値の小数点以下を切り上げ、最も近い整数値を返します。例えば、Math.ceil(1.1)は2を返します。
利用意図は、ページネーションを実装する際に、全ページ数を求めるために使われます。例えば、1ページあたりのアイテム数と
して10を設定している場合、総アイテム数が27個ある場合、27 / 10 = 2.7となりますが、小数点以下を切り上げることで必要
なページ数である3ページ分の情報が得られます。

この関数を利用することで、ページネーションに必要な総ページ数を求めることができます。ページネーションには、ページ番号
の表示やページャーの制御に総ページ数が必要であり、アイテム数や1ページあたりのアイテム数が変動する場合でも簡単に対応
できるようにするためにこの関数が使われます。

------------------------------------------------------------------------------------------------
ReactPaginateのプロパティの解説

pageCount:
ページの総数を表す数値。itemsPerPageで割った商をMath.ceilで切り上げたものを渡すことで、ページ数を算出しています
pageRangeDisplayed:
ページネーションで表示するページ数を表す数値。例えば、この値が2の場合、現在のページを含めて前後2ページが表示されます
marginPagesDisplayed:
ページネーションの左右の余白に表示するページ数を表す数値。例えば、この値が1の場合、現在のページの前後1ページずつが余
白として表示されます。
onPageChange:
ページが変更された際に呼び出されるコールバック関数。この関数には、新しいページ番号が引数として渡されます。
containerClassName:
ページネーションを含む要素に付与されるクラス名を表す文字列。CSSでこのクラス名を指定することで、ページネーションのス
タイリングを行えます。
activeClassName:
現在のページに付与されるクラス名を表す文字列。CSSでこのクラス名を指定することで、現在のページのスタイリングを行えま
す。
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
[itemsPerPage, router]
依存配列にitemsPerPageとrouterを指定する理由は、これらの値が変更された場合にhandleGetUsers関数を再計算するた
めです。handleGetUsers関数内でitemsPerPageとrouterを使用しているため、これらの値が変更された時に新しい関数を生
成するように指定しています。これにより、不要な関数の再生成を防ぎ、パフォーマンスを向上させることができます。

================================================================================================
4
[currentPage, handleGetUsers]
依存配列にcurrentPageとhandleGetUsersを指定する理由は、これらの値が変更された場合にuseEffect内の関数を実行す
るためです。currentPageが変更されると新しいページのユーザー情報を取得し、handleGetUsersが変更されると新しい関数
でユーザー情報を取得するためにこれらを依存配列に含めています。

@          @@          @@          @@          @@          @@          @@          @@          @
初回レンダリング時の関数の発火順番ときっかけ:

1. useStateフックによって、users, alertOpen, totalUsers, alertSeverity, alertMessage, currentPageの
初期値が設定される。

2. ページがレンダリングされ、ReactPaginateコンポーネントが表示される。

3. handleGetUsers関数が初回レンダリング時に、useEffectフックによって呼び出される。
- currentPageとhandleGetUsersを依存関係として渡しているため、currentPageが更新されるたびにhandleGetUsersが
呼び出される。
- handleGetUsers関数は、userIndex関数を使用して、指定されたページのユーザー一覧を取得する。
- 取得したユーザー一覧と総ユーザー数をuseStateフックを使ってusersとtotalUsersに格納する。

4. handlePageChange関数が、ReactPaginateコンポーネントによって呼び出される。
- 選択されたページの番号がsetCurrentPageによって、currentPageステートに保存される。

================================================================================================
onPageChangeが発火した際の関数の発火順番ときっかけ:

1. handlePageChange関数が、ReactPaginateコンポーネントによって呼び出される。
- 選択されたページの番号がsetCurrentPageによって、currentPageステートに保存される。

2. useEffectフックによって、handleGetUsers関数が呼び出される。
- currentPageとhandleGetUsersを依存関係として渡しているため、currentPageが更新されるたびにhandleGetUsersが
呼び出される。
- handleGetUsers関数は、userIndex関数を使用して、指定されたページのユーザー一覧を取得する。
- 取得したユーザー一覧と総ユーザー数をuseStateフックを使ってusersとtotalUsersに格納する。
*/
