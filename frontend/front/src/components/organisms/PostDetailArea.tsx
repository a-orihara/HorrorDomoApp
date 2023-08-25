import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { usePostContext } from '../../contexts/PostContext';
import { useGetMovieInfo } from '../../hooks/api/useGetMovieInfo';
import useFormattedTime from '../../hooks/helpers/useFormattedTime';
import useGetUserById from '../../hooks/user/useGetUserById';
import { MovieInfoArea } from '../molecules/MovieInfoArea ';

// idがあるかどうか
// idがあれば、指定postと指定userを取得
// 第一useEffectが呼ばれ、指定postがあれば指定映画を取得

export const PostDetailArea = () => {
  const router = useRouter();
  const { id } = router.query;
  // console.log(`現在のid:${id}`);
  // 指定post詳細とそれを取得する関数を取得
  const { postDetailByPostId, handleGetPostDetailByPostId } = usePostContext();
  // 指定user詳細とそれを取得する関数を取得
  const { user, handleGetUserById } = useGetUserById(
    // 指定postのuserIdが存在すればその数値(number)が、存在しない場合はundefinedが引数として渡される
    postDetailByPostId?.userId !== undefined ? Number(postDetailByPostId.userId) : undefined
  );
  // 指定post.titleから映画情報を取得する関数とその映画情報を取得
  const { movieInfo, isMovieInfoFound, handleGetMovieInfo } = useGetMovieInfo();
  // 非同期処理の順序を制御する為の、指定postが取得済みかを表す真偽値の状態変数
  const [postFetched, setPostFetched] = useState(false);
  // post作成日時を取得
  const postCreatedTime = useFormattedTime(postDetailByPostId?.createdAt);
  // console.log(`今のpostFetchedは:${postFetched}`);
  // console.log(`%c postDetailByPostIdが呼ばれた:${JSON.stringify(postDetailByPostId)}`, 'color: red');

  // 2
  useEffect(() => {
    // console.log(`%c postDetailByPostIdのuseEffectが呼ばれた`, 'color: yellow');
    // クエリidを取得出来たら指定post詳細を取得開始
    if (id) {
      // console.log(`%c postDetailByPostIdのuseEffectが呼ばれた`, 'color: green');
      // クエリid指定のpostを取得する関数で指定postを取得
      handleGetPostDetailByPostId(Number(id));
      // console.log(`1.title::${postDetailByPostId?.title}`);
      // クエリid指定のpostのuserIdに紐付くuserを取得する
      handleGetUserById();
      // クエリid指定のpostとそのuserIdに紐付くuserを取得が完了したら、postFetchedをtrueにする
      setPostFetched(true);
    }
  }, [id, handleGetPostDetailByPostId, handleGetUserById]);

  useEffect(() => {
    // postFetchedがtrueで、クエリid指定postがあれば
    if (postFetched && postDetailByPostId) {
      // 指定postのtitleから映画情報を取得する
      handleGetMovieInfo(postDetailByPostId.title);
      // console.log(`2.title::${postDetailByPostId.title}`);
    }
  }, [postDetailByPostId, handleGetMovieInfo, postFetched]);

  return (
    <div className='flex flex-1 flex-col '>
      {postFetched ? (
        postDetailByPostId ? (
          <div>
            <div className='mt-4 flex flex-1 flex-col items-center'>
              {/* 指定postのuserIdから取得した指定userのavatarとname */}
              <div className='mb-4 flex min-w-min justify-around sm:w-1/3'>
                <img
                  src={user?.avatarUrl || '/no_image_square.jpg'}
                  alt='user avatar'
                  className=' mt-2 h-16 w-16 rounded-full '
                />
                <p className='flex  items-center justify-center text-base sm:text-xl'>{user?.name}</p>
              </div>
              {/* 指定postのtitle */}
              <h2 className='mb-4 flex h-12 min-w-min items-center justify-center rounded-md bg-basic-beige px-2 text-center text-lg tracking-wide md:text-2xl'>
                {postDetailByPostId.title}
              </h2>
              {/* 指定postのcontent, whitespace-normal:文章折り返し */}
              <div className='mb-2 min-h-min w-full min-w-min border-2 border-solid border-gray-500 bg-basic-beige px-2 py-4 text-base tracking-wide sm:w-2/3 md:w-2/3 md:text-xl'>
                {postDetailByPostId.content}
              </div>
              <p className='mb-8 mr-5 text-sm sm:text-lg'>作成日時:{postCreatedTime}</p>
            </div>
            {/* 指定postのtitleから取得した映画情報 */}
            <MovieInfoArea movieInfo={movieInfo} isMovieInfoFound={isMovieInfoFound}></MovieInfoArea>
          </div>
        ) : (
          <p className='text-center'>投稿が見つかりませんでした。</p>
        )
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};
/*
@          @@          @@          @@          @@          @@          @@          @@          @

@          @@          @@          @@          @@          @@          @@          @@          @
1
. **PostDetailArea.tsx**: `organismsの理由`
-  PostDetailAreaは複数の要素（ユーザーの画像、名前、投稿のタイトル、内容など）を組み合わせて構成されており、画
面の一部を構成するため、organismsに配置するのが適切です。moleculesよりも複雑な単位であるため、organismsが適切
と考えられます。

================================================================================================
2
handleGetPostDetailByPostId(Number(id));
Number(id) は、変数 id を数値に変換するJavaScriptの組み込み関数。渡された id を数値に変換。
もし id の値が数値の文字列や数値そのものであれば、その値が数値に変換されます。
もし id の値が数値に変換できない文字列や undefined であれば、NaN (Not a Number) が返されます。
------------------------------------------------------------------------------------------------
1. なぜ警告が出るのか？
- `handleGetPostDetailByPostId`がuseEffectの依存配列に含まれていないとき、Reactはこの関数がuseEffect内
で使われているにもかかわらず、その依存関係が監視されていないと解釈します。そのため、関数が変更された場合に、新しい
関数を使用するようにエフェクトが更新されないという問題が発生します。この警告は、そのような場合の不整合を避けるため
にReactから発生します。

2. 関数を依存配列に含めても挙動は変わらないか？
- 依存配列に関数を含めると、その関数が変更された場合にエフェクトが再評価されます。通常、Reactの関数コンポーネン
ト内で定義される関数は、コンポーネントが再レンダリングされるたびに新しいものとして認識されます。しかし、この場合、
`handleGetPostDetailByPostId`はReactのコンテキストから取得され、同一の関数インスタンスを保持するため、依
存配列に含めることでの挙動の変更はないはずです。

3. なぜ関数を依存配列に含めるように警告が出るのか？
- これは一般的なルールであり、常にすべての依存関係をuseEffectの依存配列に含めることを推奨します。これは、依存
関係を見逃すことによる不適切な挙動を防ぐためです。しかし、依存配列に含めるとパフォーマンスに影響を与える可能性が
あるため、場合によってはeslintの警告を無視することもあります。

4. 依存関係の配列を削除するとどうなるか？挙動は変わるか？
- useEffectの依存配列を削除すると、エフェクトはコンポーネントが再レンダリングされるたびに実行されます。これは
依存配列が空の場合（つまり、エフェクトが一度だけ実行される場合）とは異なります。この変更はエフェクトの頻度に影
響を与え、パフォーマンスや副作用の発生に影響を及ぼす可能性があるため、挙動が変わる可能性があります。

================================================================================================
3
. Optional Chaining
- この演算子の機能は、オブジェクトやクラスのプロパティにアクセスしようと思った時に、そのプロパティがnull、または
undefinedの場合な値の場合、?.時点でコードの実行を終了し、エラーをスローすることなくundefinedを返却する。
- **具体例**:
`postDetailByPostId?.userId`の場合、`postDetailByPostId`がnullまたはundefinedなら、式全体は
undefinedを返します。
- **意図**:
オブジェクトが存在しない場合にプロパティへのアクセスを安全に行いたいときに使用します。存在しないプロパティにアクセス
しようとするとエラーが発生するため、このエラーを防ぐためにOptional Chainingが使われます。
**`postDetailByPostId?.userId`ではなく、`postDetailByPostId?`にしない理由**:
- `postDetailByPostId?.userId`は`postDetailByPostId`がnullまたはundefinedの場合、式全体が
undefinedを返す構文です。具体的には、`postDetailByPostId`の存在をチェックした上で、存在する場合には`userId`
の値を取得しようとします。
- `postDetailByPostId?`とすると、オプショナルチェイニングの適用対象が不明確になるため、正常に動作しない可能性が
あります。この構文はプロパティへのアクセスをチェックする際に使用されるからです。
------------------------------------------------------------------------------------------------
. **`!==`（厳密な不等価演算子）**:
- 用途: 左辺と右辺が異なる値または異なる型である場合、trueを返します。
------------------------------------------------------------------------------------------------
. **`? :`（三項演算子）**:
- 用途: 最初の条件がtrueの場合、`?`の後の式を評価し、falseの場合、`:`の後の式を評価します。
------------------------------------------------------------------------------------------------
. [`postDetailByPostId?.userId !== undefined] ? [Number(postDetailByPostId.userId) : undefined`]
[`postDetailByPostId?.userId !== undefined]が条件式。ここがtrueなら、[? Number(postDetailByPostId.userId) ]
falseなら[undefined]が評価。
------------------------------------------------------------------------------------------------
. `postDetailByPostId?.userId !== undefined ? Number(postDetailByPostId.userId) : undefined`
- この条件分岐はOptional Chaining (`?.`)を使用しており、`postDetailByPostId`がnullまたはundefinedの場合、
以降のプロパティアクセスを安全に行うためのものです。
- `postDetailByPostId`がnullまたはundefinedでなければ、`postDetailByPostId.userId`がundefinedでないか
チェックします。
- `postDetailByPostId.userId`がundefinedでない場合、`Number(postDetailByPostId.userId)`を評価して返し
ます。
- それ以外の場合（`postDetailByPostId`がnull/undefinedまたは`postDetailByPostId.userId`がundefinedの
場合）は、undefinedを返します。
この条件分岐の結果は、`useGetUserById`フックに引数として渡されます。そのため、指定されたユーザーIDが存在する場合
にはその数値が、存在しない場合にはundefinedが引数として渡されることになります。
*/
