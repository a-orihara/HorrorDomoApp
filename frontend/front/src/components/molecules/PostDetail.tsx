import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePostContext } from '../../contexts/PostContext';

export const PostDetail = () => {
  const { postDetailByPostId, handleGetPostDetailByPostId } = usePostContext();
  const router = useRouter();
  const { id } = router.query;

  // 1
  useEffect(() => {
    if (id) {
      handleGetPostDetailByPostId(Number(id));
    }
  }, [id, handleGetPostDetailByPostId]);

  console.log(`ポストふは：${JSON.stringify(postDetailByPostId)}`);

  return (
    <div className='flex flex-1 flex-col'>
      <h1 className=' flex h-20 items-center justify-center pt-4 text-2xl font-semibold md:text-4xl'>投稿詳細ページ</h1>
      <div>
        {postDetailByPostId ? (
          <div>
            <h2>{postDetailByPostId.title}</h2>
            <p>{postDetailByPostId.content}</p>
            {/* 他の投稿詳細情報をここに表示 */}
          </div>
        ) : (
          <p>投稿が見つかりませんでした。</p>
        )}
      </div>
      <div className='flex flex-1 flex-col'></div>
      <div></div>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
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
*/
