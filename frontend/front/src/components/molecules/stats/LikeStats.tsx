import { useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useLikeContext } from '../../../contexts/LikeContext';

type LikeStatsProps = {
  userId: number | undefined;
  // FeedとLikedPostAreaの表示切替を行う関数。
  toggleFeed: () => void;
  showLikedPostArea: boolean;
};

export const LikeStats = ({ userId, toggleFeed, showLikedPostArea }: LikeStatsProps) => {
  const { currentUser } = useAuthContext();
  const {
    // currentUserのLikedPostsの総数。currentUserのprofile情報で使用。
    currentUserLikedPostCount,
    handleGetTotalLikesCountByCurrentUserId,
    // otherUserのLikedPostsの総数。otherUserのprofile情報で使用。
    otherUserLikedPostsCount,
    handleGetTotalLikesCountByOtherUserId,
  } = useLikeContext();
  // currentUserまたはotherUserのいいね総数を取得、更新する
  useEffect(() => {
    // 1.1 サインアウト時に発火するため、currentUserがundefinedならば、以下の処理をスキップ
    if (!currentUser) return;
    // 1.2
    if (currentUser && userId === currentUser.id) {
      // currentUserがundefinedでない場合のみ処理
      handleGetTotalLikesCountByCurrentUserId(userId);
      // 1.3
    } else {
      handleGetTotalLikesCountByOtherUserId(userId);
    }
  }, [
    // 1.4
    userId,
    handleGetTotalLikesCountByCurrentUserId,
    handleGetTotalLikesCountByOtherUserId,
    // currentUser?.id でundefinedの場合にエラーを防ぐ
    currentUser?.id,
    currentUser,
  ]);

  // showLikedPostAreaの審議地により、動的にスタイリングを変更
  const linkClickedStyle = showLikedPostArea ? 'bg-basic-pink text-white rounded-lg hover:text-black' : '';

  // 3 currentUserLikedCountまたはotherUserLikedCountをuserLikedCountに格納
  const userLikedCount =
    currentUser && userId === currentUser.id ? currentUserLikedPostCount : otherUserLikedPostsCount;

  return (
    <div>
      <a
        className={`mr-4 cursor-pointer text-xs hover:text-basic-pink md:text-base ${linkClickedStyle}`}
        onClick={toggleFeed}
      >
        {/* <a className={`mr-4 cursor-pointer bg-blue-200 text-xs hover:text-basic-pink md:text-base`} onClick={toggleFeed}> */}
        <span className='mr-2 underline'>{userLikedCount}</span>
        いいね
      </a>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
- useEffect:コンポーネントの初回レンダリング時にのみ実行。依存配列で再実行。基本的に非同期処理はここに記載。
------------------------------------------------------------------------------------------------
- Contextの値の型に`undefined`を含めるのは、アプリの実際の動作を型システムで正確に表現するためだ。たとえば、ユ
ーザーが未ログインの場合、`undefined`になる可能性がある。このように型を設定することで、ランタイムエラーを防ぎ、コ
ードの堅牢性を高めることができる。
- `currentUser: User | undefined`のような型定義は、`currentUser`が`undefined`を取る可能性があることを反
映している。アプリが起動した際やログアウト状態のように、ユーザーが特定されていない場合を考慮するためだ。
- AuthContextでは値がundefinedであることを許容しているため、undefinedに対して適切な処理を行うのは使用側の責任
となり、この処理をLikeStatsコンポーネントなどの使用側で行うのが適切だ。
------------------------------------------------------------------------------------------------
LikeStats`の`useEffect`内の処理は、現在サインインしているユーザー（`currentUser`と呼ぶ）とその他のユーザーを
区別して、投稿のいいね！数の取得と表示を処理するように設計されている。
------------------------------------------------------------------------------------------------
. **currentUser`の存在チェック**： if (!currentUser) return;`という行は、現在サインインしているユーザーが
いるかどうかをチェック。もしそうでなければ（`currentUser`が`undefined`であれば）、`useEffect`の残りのコード
は実行されない。これにより、コードが未定義の `currentUser` のプロパティにアクセスしようとした場合に発生するエラ
ーを防ぐことができる（意図）。

================================================================================================
1.2
if (currentUser && userId === currentUser.id)
. **ユーザーコンテキストを決定する： `LikeStats` に渡された `userId` が `currentUser` の ID と一致するかど
うかをチェック。アプリケーションは現在のユーザの投稿と他のユーザの投稿のいいね！数を区別して表示する必要があるため、
この区別は重要（意図）。
- userId` が `currentUser.id` と一致する場合、アプリケーションは現在のユーザの投稿の総いいね数を取得して表示。
`handleGetTotalLikesCountByCurrentUserId` 関数を使用。
------------------------------------------------------------------------------------------------
- `(currentUser && userId === currentUser.id)`: 上記の2つの評価結果に基づいて、`currentUser`が
`undefined`でなく、かつ`userId`が`currentUser.id`と等しい場合に`true`となります。この条件が`true`であれば、
`currentUser`が存在し、かつ特定の条件が満たされているというロジックを表現しています。

================================================================================================
1.3
else
- `userId` が一致しない場合、つまり「いいね！」の統計情報が別のユーザーのものである場合、
`handleGetTotalLikesCountByOtherUserId` を使ってそのユーザーの投稿の「いいね！」数を取得し、表示します。

================================================================================================
1.4
useEffectの依存配列。例えばuserIdをコメントアウトすると警告が出る。
- 警告は `userId` が `useEffect` 内で使用されているが、依存関係の配列にされていないことを示す
- 依存関係の配列は、Reactに監視すべき値を伝えます。これらの値のいずれかが変更された場合、`useEffect`は再度実行。
- 例えば、`userId`が変更されたのに依存関係の配列にない場合、`useEffect`は実行されるべき時に実行されないかもしれ
ない。これは、異なるユーザーを見たときに、統計が正しく更新されない可能性があることを意味し、バグにつながる可能性があ
る。userId` を含めることで、`userId` が変更されるたびに `useEffect` が再実行して正しいイイネ数を取得するように
なります。これにより、表示されるデータが閲覧しているユーザーと同期した状態に保たれる。
- つまり、ユーザーを切り替えたときにイイネ数が正しく更新されるように、`useEffect`の依存配列に `userId` を追加する
ように警告が表示。その他の値をコメントアウトすると警告が出るのも同じ理由。


================================================================================================
3
.意味と意図:
- 意味: 現在ログインしているユーザー（`currentUser`）と表示しているユーザーID（`userId`）が一致する場合、
`currentUserLikedCount`を使用し、一致しない場合は`otherUserLikedCount`を使用します。
- 意図: いいねのカウントを表示する際、ログイン中のユーザー自身の画面か、他のユーザーの画面かを区別して適切な値を取
得するためです。
------------------------------------------------------------------------------------------------
. 文法上の解説:
- `currentUser && userId === currentUser.id`: `currentUser`が`undefined`でない、かつ`userId`が
`currentUser.id`と等しい場合に`true`となります。
- `&&`:論理演算子。は2つの条件が真である場合に真を返し、どちらか一方でも偽であれば偽を返します。
- `?`: 条件演算子です。前の条件が`true`の場合、次の値（この場合`currentUserLikedCount`）を取ります。
- `:`: 条件演算子の一部です。前の条件が`false`の場合、この後の値（この場合`otherUserLikedCount`）を取ります。
- この一連の文は、ログイン中のユーザー自身の画面であれば`currentUserLikedCount`を取り、そうでなければ
`otherUserLikedCount`を取るという三項演算子の形式で記述されています。
*/
