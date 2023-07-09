import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePostContext } from '../../contexts/PostContext';
// import { usePostContext } from '../../contexts/PostContext';
import { usePostsPagination } from '../../hooks/post/usePostsPagination';
import useGetUserById from '../../hooks/user/useGetUserById';
import PostList from '../molecules/PostList';
import PostsPagination from '../molecules/PostsPagination';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';
// ================================================================================================
const ProfilePage = () => {
  // const { posts } = usePostContext();
  const router = useRouter();
  // 1
  const { id } = router.query;
  // 4
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // 選択したidに紐付くuserとpostsを取得
  const { user, handleGetUserById } = useGetUserById(id);
  // const { posts, handleGetPostsByUserId } = useGetPostByUserId(id);
  // この5は、1ページ当たりの表示件数->itemsPerPage: number, userId?: number
  const { posts, totalPostsCount, handlePageChange } = usePostsPagination(5, userId);
  const { currentUserPostsCount } = usePostContext();
  // ------------------------------------------------------------------------------------------------
  // 2
  useEffect(() => {
    handleGetUserById();

    // handleGetPostsCountByUserId;
    // }, [id, handleGetUserById, handleGetPostsByUserId]);
  }, [id, handleGetUserById]);

  // 3
  if (!user) {
    return <div>Loading...</div>;
  }

  // ================================================================================================
  return (
    <div className='flex w-full flex-1  flex-col bg-green-200'>
      <div className='flex h-full flex-1 flex-col bg-blue-200 lg:flex-row'>
        <div className='h-16 lg:w-48'>
          <Sidebar></Sidebar>
        </div>
        <div className=' bg-red-200 lg:w-80'>
          {/* 5 */}
          <UserInfo user={user} postsCount={currentUserPostsCount}></UserInfo>
        </div>
        <div className='w-full flex-1 bg-green-200'>
          {/* 6 */}
          <PostList posts={posts} user={user}></PostList>
          {/* 7 */}
          <PostsPagination
            totalPostsCount={totalPostsCount}
            itemsPerPage={5}
            handlePageChange={handlePageChange}
          ></PostsPagination>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
router.query
現在のページのクエリストリングの値を表すオブジェクトです。{}の中にidを書くことで、router.queryオブジェクトから、
idパラメーターを分割代入で取り出しています。

================================================================================================
2
ここのuseEffectの第二引数に、handleGetUserDataByIdを渡している理由。
handleGetUserDataById関数が変更されるたびにhandleGetUserDataByIdが呼び出されることになります。依存配列が空
[]では、handleGetUserDataByIdはコンポーネントがマウントされるときに一度だけ呼び出されます。
idが変更された場合、ユーザーデータを再度取得する必要がありますが、最初の例ではこれを処理します。一方、[]では、idの
変更に関係なく、handleGetUserDataByIdは一度しか呼び出されないので、処理されません。
------------------------------------------------------------------------------------------------
ちなみに、useGetUserDataById.ts` において、`useCallback` を使用しない場合、レンダリング毎にuseEffactにより、
新しい `handleGetUserDataById` 関数が作成され、`ProfilePage` が依存している `handleGetUserDataById` 関
数がレンダリング毎に変わるため、不必要な再レンダリングを引き起こす。これは、コンポーネントが複雑な場合や再レンダリン
グが多い場合に、パフォーマンスの問題につながる可能性があります。
------------------------------------------------------------------------------------------------
`handleGetUserDataById`に `useCallback` を使用する目的は、関数をメモ化することです。つまり、依存関係の1つが
変更された場合にのみ関数を変更します。この場合、`handleGetUserDataById`は、`id`が変更された場合にのみ変更され
ます。これにより、不必要な再レンダリングを防ぎ、パフォーマンスを向上させることができます。
------------------------------------------------------------------------------------------------
さらにuseCallback`により新しい `handleGetUserDataById` 関数が作成されますが、useCallbackは生成するだけで、
この関数は自動的に実行されません。ProfilePage.tsx`の `useEffect` 内のように、明示的に呼び出されたときのみ実行
されます。

================================================================================================
3
return <div>Loading...</div>;を記載する理由
<UserInfo user={user}></UserInfo>コンポーネントは、User型のuserプロパティを必須としています。
しかし、ProfilePageコンポーネント内のuserはUser | null型です。そのため、userがnullの可能性があるときに、
<UserInfo>コンポーネントをレンダリングしようとすると、TypeScriptは型の不一致を警告します。
return <div>Loading...</div>;がある場合、userがnullのときにはこの行がレンダリングされ、以降のコード
（<UserInfo user={user}></UserInfo>を含む）は実行されません。そのため、userがnullの場合でもTypeScriptのエ
ラーは発生しないため、TypeScriptのエラーは表示されません。

================================================================================================
4
ユーザーIDを[const id: string | string[] | undefined]型から、number型に変換してからusePostsPagination
に渡します。
ただし、変換する前に、idがundefinedまたは配列ではないこと、そして実際に数値に変換できることを確認しています。
------------------------------------------------------------------------------------------------
typeof
与えられた値のデータ型を返すJavaScriptの演算子です。
typeofは、単項演算子として使用され、次のように使用します: typeof value
typeofは、データ型に基づいて異なる文字列を返します。例えば、"string"、"number"、"boolean"、"object"、など。
------------------------------------------------------------------------------------------------
isNaN
与えられた値が"NaN"（非数）であるかどうかを判定するJavaScriptの関数です。
isNaNは、引数に値を受け取り、その値がNaNである場合にtrueを返します。それ以外の場合はfalseを返します。
Number(id)
------------------------------------------------------------------------------------------------
与えられた値を数値に変換するJavaScriptの関数です。
Numberは、引数に値を受け取り、その値を数値に変換します。もし変換できない場合はNaNを返します。
Number(id)は、文字列型のidを数値に変換するために使用されます。
------------------------------------------------------------------------------------------------
? Number(id) : undefined;
これは条件（三項）演算子です。条件に基づいて異なる値を返します。
typeof id === 'string' && !isNaN(Number(id))の条件を評価し、その結果に応じて値を返します。
もしidが文字列型であり、かつ数値に変換可能な場合はNumber(id)を返します。
それ以外の場合はundefinedを返します。
このコードの役割は、idが適切な数値として解釈できる場合に数値に変換し、それ以外の場合はundefinedとして処理すること
です。
------------------------------------------------------------------------------------------------
const id: string | string[] | undefinedは、idが文字列型、文字列の配列、または未定義のいずれかの値を取りうる
ことを示しています。
これは、typeof id === 'string' && !isNaN(Number(id))の条件分岐で、idの型が文字列であり、かつ数値に変換可能
であることを確認するために使用されています。
------------------------------------------------------------------------------------------------
1. 全て`true`だと`userId`に値が入る場合：
- `typeof id === 'string'`が`true`であり、かつ`id`が文字列型であることを確認します。
- `!isNaN(Number(id))`が`true`であり、かつ`id`を数値に変換できることを確認します。
- 上記の条件が両方とも`true`であれば、`Number(id)`で数値に変換した値が`userId`に代入されます。

2. `false`の場合は`userId`に何の値が入るか：
- 条件のいずれかが`false`である場合、つまり、`typeof id === 'string'`が`false`であるか、`id`が文字列型でな
い場合、または`!isNaN(Number(id))`が`false`である場合、`userId`には`undefined`が代入されます。
したがって、与えられたコードの場合、`userId`に値が入るのは`id`が文字列型であり、かつ数値に変換可能な場合のみです。
それ以外の場合は`userId`に`undefined`が代入されます。

================================================================================================
5
[user]は、useGetUserById(id)からのuser（指定したidのuser情報）
[currentUserPostsCount]は、usePostContextからのcurrentUserPostsCount（カレントユーザーの投稿数）

================================================================================================
6
postsは、usePostsPaginationからのposts（指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分
のpost）
userは、useGetUserById(id)からのuser（指定したidのuser情報）

================================================================================================
7
totalPostsCountは、usePostsPaginationからのtotalPostsCount（指定したidのuserの投稿総数）
handlePageChangeは、usePostsPaginationからのhandlePageChange（ページ切り替えで発火。ページネーションのペー
ジ変更時の処理[カレントページのset。ページ切り替え]）
------------------------------------------------------------------------------------------------
ページネーションでページ遷移するたびに、新しく選択されたページの内容が取得されて表示されます。
それはカレントページが依存配列で、カレントページが変更されるたびに、handleGetPostListByUserIdが再実行されるため
です。
*/
