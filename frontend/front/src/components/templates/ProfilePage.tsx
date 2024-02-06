import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePostContext } from '../../contexts/PostContext';
// import { usePostContext } from '../../contexts/PostContext';
import useGetUserById from '../../hooks/user/useGetUserById';
import { useToggleFeed } from '../../hooks/useToggleFeed';
import { FollowForm } from '../molecules/form/FollowForm';
import LikedPostArea from '../organisms/area/LikedPostArea';
import PostArea from '../organisms/area/PostArea';
import Sidebar from '../organisms/Sidebar';
import UserInfo from '../organisms/UserInfo';
// ================================================================================================
const ProfilePage = () => {
  // const { posts } = usePostContext();
  const router = useRouter();
  // 1 パスからuserのidを取得
  const { id } = router.query;
  // 4.1 4.2 4.3
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // console.log(`ProfilePage.tsxのuserId: ${userId}`);
  // queryパラメータから指定したidに紐付くuserとpostsを取得
  const { user, handleGetUserById } = useGetUserById(userId);
  const { currentUserPostsCount } = usePostContext();
  const { currentUser } = useAuthContext();
  // FeedAreaとLikedPostAreaの表示切替の状態変数と関数。
  const { showLikedPostArea, toggleFeed } = useToggleFeed();
  // ------------------------------------------------------------------------------------------------
  // 2
  useEffect(() => {
    handleGetUserById();
    // handleGetUserById()にuserIdが渡されているので、依存配列にidよりuserIdを用いる
  }, [userId, handleGetUserById]);

  // 3 この処理を通過するということは、userに値が存在し、型はUserとして扱うことができる
  if (!user) {
    return <div>Loading...</div>;
  }

  // ================================================================================================
  return (
    <div className='flex flex-1 flex-col lg:flex-row'>
      <Sidebar></Sidebar>

      <div className='lg:w-96'>
        {/* 5  if (!user)の通過により、 user: Userになる */}
        <UserInfo
          user={user}
          postsCount={currentUserPostsCount}
          toggleFeed={toggleFeed}
          showLikedPostArea={showLikedPostArea}
        ></UserInfo>
      </div>
      <div className='flex-1 lg:w-full'>
        {/* 8 */}
        {currentUser && currentUser.id !== userId && (
          <FollowForm userId={currentUser.id} otherUserId={userId}></FollowForm>
        )}
        <div className='flex-1 lg:w-full'>
          {showLikedPostArea ? <LikedPostArea user={user}></LikedPostArea> : <PostArea user={user}></PostArea>}
        </div>
        {/* <PostArea user={user}></PostArea>
        <LikedPostArea user={user}></LikedPostArea> */}
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
------------------------------------------------------------------------------------------------
`useEffect`内の`handleGetUserById()`関数が再度呼び出される理由は、`id`が依存配列に含まれているためです。依存
配列に`id`が含まれているということは、`id`の値が変わるたびに`useEffect`内のコードが再度実行されるということです。

ここでの`id`は、`router.query`から取得されるURLのクエリパラメータです。ページが初めて読み込まれるとき、この`id`
はまだ定義されていません（つまり`undefined`）。その後、URLのクエリパラメータが読み込まれると、`id`はその値に更新
され、この更新により`useEffect`内のコードが再度実行されるのです。

したがって、`useEffect`内の`handleGetUserById()`関数は、最初に`userId`が`undefined`だったとき、そしてURL
のクエリパラメータが読み込まれて`userId`が更新されたときの、2回実行されます。
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
4.1
(id: string | string[] | undefined)
- id` の型が `string | string[] | undefined` である理由は、Next.js の `router.query` が返す型がこれである
ためです。query`オブジェクトには、URLからパースされた現在のルートのクエリパラメータが格納されます。これらのパラメ
ータは `string` 、`array of strings` 、またはパラメータが存在しない場合は `undefined` である可能性がありま
す。
------------------------------------------------------------------------------------------------
- `id` の型に `string` を使用するだけでは、 `router.query` が返す可能性のあるすべての型を網羅することはできませ
ん。なぜなら、TypeScriptは `id` が `string[]` や `undefined` にもなりうると想定しているからです。
フックの `useUser` に `id` を渡す場合、実際には `router.query.id` の結果を渡すことになるので、`id` のすべて
の可能な型を考慮する必要がある。

================================================================================================
4.2
. const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
- `&&`は論理AND演算子で、左側の式と右側の式の両方が真(`true`)である場合にのみ、真を返します。左側が偽(`false`)
の場合、右側の式は評価されずに、偽が結果として返されます。
- &&の左側の式はtypeof id === 'string'、右側の式は!isNaN(Number(id))
------------------------------------------------------------------------------------------------
- `?`は条件演算子（三項演算子）の一部であり、`式1 ? 式2 : 式3`の形式で使用されます。ここで`式1`が真(`true`)で
あれば`式2`が評価され、偽(`false`)であれば`式3`が評価されます。
- `:`は条件演算子（三項演算子）内で使用され、`式2`と`式3`を区切ります。
- ①`id`が文字列であり、②数値に変換可能な場合はtrue、そうでない場合は`undefined`、③①と②がtrueならその数値を
userIdに割り当てます。
- ?の左側の式1は、typeof id === 'string' && !isNaN(Number(id))、右側の式2はNumber(id)。
- シンプルな?の例
const score = 70;
const result = score >= 60 ? '合格' : '不合格';
scoreが60以上の場合、resultは'合格'、そうでない場合は'不合格'。

================================================================================================
4.3
- `Number`はJavaScriptで提供されているグローバル関数。この関数は引数を数値に変換しようと試みる。引数が数値に変換
できる場合（例えば、文字列`"123"`など）、変換された数値（この例では`123`）を戻り値として返す。引数が数値に変換でき
ない場合（例えば、文字列`"abc"`など）、`NaN`（Not-a-Number）を戻り値として返す。
- `isNaN(Number(id))`の`isNaN`もJavaScriptで提供されているグローバル関数。この関数は引数が`NaN`かどうかをチ
ェックする。引数が`NaN`の場合、`true`を返す。引数が`NaN`ではない場合、`false`を返す。
------------------------------------------------------------------------------------------------
. **`Number(id)`**： この関数は `id` を数値に変換しようとする。もし `id` が有効な数値を表す文字列 (例えば
`"123"`) であれば、 `Number(id)` は数値 `123` を返す。もし `id` が数値に変換できない場合 (例えば `"abc"`) 、
`Number(id)` は `NaN` (Not-a-Number) を返す。
. **isNaN(Number(id))`**： isNaN` 関数は値が `NaN` かどうかをチェックする関数である。もし `Number(id)` が
`NaN` なら、 `isNaN(Number(id))` は `true` を返す。演算子 `!` は結果を反転するので、 `Number(id)` が
`NaN` なら`false` となる。つまり、`!isNaN(Number(id))` は `Number(id)` が有効な数値であれば `true` を返
し、`NaN` であれば `false` を返す。

------------------------------------------------------------------------------------------------
- id`が文字列であることを確認する**： まず、 `router.query` から取得した `id` が文字列であるかどうかをチェック
する。これは `router.query` が `string`、`string[]`、または `undefined` を返す可能性があるため、重要。この
コードでは、`id` が文字列である必要がある。
- 数値のバリデーション： 次に、文字列が `NaN` (Not-a-Number) にならずに数値に変換できるかどうかをチェック。
- 数値への変換**： もし `id` が有効な数値を表す文字列であれば、 `id` を数値に変換する。この変換は必要である。な
ぜなら、 `id` は文字列としてURLから送られてくるが、バックエンドAPIが数値として期待する識別子を表しているから。
- undefined`**にフォールバック： もし `id` が文字列でないか、有効な数値を表していない文字列である場合、
`userId` は `undefined` に設定される。これはセーフガードとして機能し、`userId`に依存する後続の操作が有効な数
値識別子でのみ実行されることを保証する。


------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
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
8
currentUser が存在し、かつ currentUser.id が userId と異なる場合に <FollowForm></FollowForm> コンポーネ
ントが表示されます。
------------------------------------------------------------------------------------------------
判定ロジックを`ProfilePage.tsx`に記述する理由:
- `ProfilePage.tsx`はユーザーのプロフィール情報を表示するコンポーネントであり、その中に`FollowForm`が含まれて
いるため、それらの関連するロジックを同じコンポーネントに記述する方がコンテキストを理解しやすいです。
- `FollowForm`の表示/非表示は、プロフィールページが表示するユーザーID(`userId`)と現在ログインしているユーザーID
(`currentUser.id`)によって決定されます。この情報は`ProfilePage.tsx`で利用できるため、ここに記述するのが自然で
す。

*/
