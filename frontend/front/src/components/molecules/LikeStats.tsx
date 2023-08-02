import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useLikeContext } from '../../contexts/LikeContext';

type LikeStatsProps = {
  userId: number | undefined;
};

export const LikeStats = ({ userId }: LikeStatsProps) => {
  const { currentUser } = useAuthContext();
  const {
    currentUserLikedCount,
    handleGetAllLikesByCurrentUserId,
    otherUserLikedCount,
    handleGetAllLikesByOtherUserId,
  } = useLikeContext();

  useEffect(() => {
    // 1
    if (currentUser && userId === currentUser.id) {
      // currentUserがundefinedでない場合のみ処理
      handleGetAllLikesByCurrentUserId(userId);
    } else {
      handleGetAllLikesByOtherUserId(userId);
    }
    // currentUser?.id でundefinedの場合にエラーを防ぐ
  }, [userId, handleGetAllLikesByCurrentUserId, handleGetAllLikesByOtherUserId, currentUser?.id, currentUser]);

  // 3
  const userLikedCount = currentUser && userId === currentUser.id ? currentUserLikedCount : otherUserLikedCount;

  return (
    <div>
      <Link href={`/users/${userId}/following`}>
        <a className='mr-4 text-xs hover:text-basic-pink md:text-base'>
          <span className='mr-2 underline'>{userLikedCount}</span>
          いいね
        </a>
      </Link>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Contextの値の型にundefinedの扱いに悩ませられるのは、コードの健全性や安全性を確保するためによくあるケースです。
undefinedが入る可能性がある場合、その処理を考慮することでランタイムエラーを防ぎ、コードの堅牢性を高めることができ
ます。
------------------------------------------------------------------------------------------------
undefinedを適切に処理するための処置は、その値を利用する側であるLikeStatsコンポーネントに書くのが適切です。
AuthContextでは値がundefinedであることを許容しているため、undefinedに対して適切な処理を行うのは使用側の責任と
なります。
------------------------------------------------------------------------------------------------
. `currentUser: User | undefined`のような型定義がcontextでなされる理由は、変数`currentUser`が、
`undefined`を取る可能性があるからです。最初にアプリが起動した際やログアウト状態など、ユーザーが特定されていない場
合が想定されるため、この型定義によってその状態を表現しています。
------------------------------------------------------------------------------------------------
. Contextの値の型に`undefined`を設定する理由は、実際のアプリケーションの動作に合わせて、型システム上でも正確に表
現するためです。例えば、ユーザーが未ログインの状態であれば`undefined`となる場合があるため、その状態を型で表現しま
す。このことによって、`undefined`の場合の処理を明示的にコーディングする必要があり、エラーを未然に防ぐ助けになりま
す。
------------------------------------------------------------------------------------------------
. `(currentUser && userId === currentUser.id)`の解説:
- `currentUser`: これが`undefined`かどうかをチェックしています。`undefined`であれば、その時点で全体の評価結
果が`false`となります。
- `userId === currentUser.id`: これは`currentUser`が`undefined`でない場合に評価されます。つまり、
`currentUser`が存在する場合に限り、`userId`が`currentUser.id`と等しいかどうかをチェックします。
- `(currentUser && userId === currentUser.id)`: 上記の2つの評価結果に基づいて、`currentUser`が
`undefined`でなく、かつ`userId`が`currentUser.id`と等しい場合に`true`となります。この条件が`true`であれば、
`currentUser`が存在し、かつ特定の条件が満たされているというロジックを表現しています。

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
