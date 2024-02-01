import { useState } from 'react';
import useFormattedTime from '../../../hooks/helpers/useFormattedTime';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import { LikeButtonIcon } from '../../atoms/LikeButtonIcon';

type CommonListItemProps = {
  post: Post;
  user: User;
  currentUser?: User;
  handleDeletePost: (postId: number) => void;
};

const CommonListItem = ({ post, currentUser, handleDeletePost }: CommonListItemProps) => {
  // postの作成日時を形成するカスタムフック
  const postCreatedTime = useFormattedTime(post.createdAt);
  // postの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent = post.content.length > 30 ? `${post.content.substring(0, 30)}...` : post.content;
  // 1.1 postのlikes数
  const [postLikesCount, setPostLikesCount] = useState<number | null>(post.likesCount);

  // いいねボタンを押した時に、いいね数を更新（+-1）する関数。引数はいいねしたかどうかの真偽値
  const updatePostLikesCount = (liked: boolean) => {
    // 2
    setPostLikesCount((prevCount) => {
      if (prevCount === null) return null;
      // trueなら+1、falseなら-1
      return liked ? prevCount - 1 : prevCount + 1;
    });
  };

  return (
    <div>
      {/* post.content */}
      <p className='text-left text-sm md:text-xl'>{truncateContent}</p>
      <div className='flex'>
        <p className='mr-5 text-xs lg:text-base'>作成日時:{postCreatedTime}</p>
        {/* 1  */}
        <LikeButtonIcon postId={post.id} liked={post.liked} updatePostLikesCount={updatePostLikesCount} />
        <p className='ml-2 mr-4 text-base lg:text-lg'>{postLikesCount}</p>
        {/* currentUser自身の投稿であれば投稿を削除可能 */}
        {currentUser?.id === post.userId && (
          <a
            className='hover:cursor-pointer'
            onClick={() => {
              if (window.confirm('投稿を削除しますか？')) {
                handleDeletePost(post.id);
              }
            }}
          >
            <h1 className='text-center text-sm text-basic-green hover:text-basic-pink lg:text-base'>delete</h1>
          </a>
        )}
      </div>
    </div>
  );
};

export default CommonListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
以前のコード
currentUserで条件を満たせばいいねを表示する
------------------------------------------------------------------------------------------------
{currentUser && currentUser.id !== post.userId && (
          <LikeButtonIcon postId={post.id} liked={post.liked} updatePostLikesCount={updatePostLikesCount} />
        )}
------------------------------------------------------------------------------------------------
currentUserが定義されている場合にのみLikeButtonIconコンポーネントを描画します。
よって、LikeButtonIconコンポーネントに渡されるuserIdは常にnumber型となり、undefinedは渡されません。
------------------------------------------------------------------------------------------------
. 一般的には `undefined` を可能な限り早く処理することでエラーの可能性を最小限に抑えることが推奨されています。した
がって、この場合、`CommonListItem` コンポーネントで `currentUser` が `undefined` かどうかを確認し、
`LikeButtonIcon` コンポーネントには `undefined` を渡さないようにするのが一般的に良いとされています。
. この修正により、currentUserが定義されていない場合には、LikeButtonIcon自体がレンダリングされません。よって、
LikeButtonIconにundefinedが渡されることはありません。
. Reactのコンポーネントは可能な限り "pure"（純粋）であるべきです。つまり、ある入力が与えられた時に同じ出力を返すべ
きです。したがって、undefinedやnullが許容されないpropsを持つコンポーネントにそれらの値を渡すべきではありません。
これにより、コンポーネントの安定性と予測可能性が保証されます。

================================================================================================
1.1
以前は、別途[handleGetPostLikesCountByPostId]を作成して、postLikesCountを取得していた。
------------------------------------------------------------------------------------------------
現在各CommonListItemコンポーネントが描画されるたびに、APIリクエストが送られてpostLikesCountが取得されています
。これはパフォーマンス上良くありません。APIから一度で全ての必要なデータを取得し、それをusePostsPaginationフック
で管理するのが良いでしょう。

===============================================================================================
2
### prevCount について
. **定義**: `prevCount` は、`useState` フックで定義された `setPostLikesCount` 関数を呼び出す際のコール
バック関数の引数です。この引数は、その瞬間の `postLikesCount` の現在値（前の値）を指します。
------------------------------------------------------------------------------------------------
. **値の内容**: `prevCount` には、`useState` で管理されている `postLikesCount` の最新の値が自動的に渡され
ます。
------------------------------------------------------------------------------------------------
. **使用ケース**: 関数型の更新を使用することで、状態の更新が非同期であることに対処できます。つまり、直前の状態を
確実に取得して更新することが可能です。
------------------------------------------------------------------------------------------------
. **null チェック**: コード内で `if (prevCount === null) return null;` としているのは、初期値が `null`
である場合には状態を更新しないようにするためです。
------------------------------------------------------------------------------------------------
このように、`prevCount` は非同期的な状態更新を確実に行うために使用されます。

===============================================================================================
3
### 1. コンテクストでグローバルに値を管理するのに向いているものと、ローカルに値を取得するのに向いているもの

#### コンテクストでグローバルに値を管理するに向いているもの
- ユーザーの認証情報（ログイン状態、トークンなど）
- UIのテーマ設定（ダークモードやライトモードのスイッチなど）
- メインナビゲーションの状態（開いているか閉じているかなど）
- グローバルなアプリケーション設定（言語選択など）

#### ローカルに値を取得するのに向いているもの
- ページやコンポーネント特有の状態（フォームの入力値、モーダルの開閉状態など）
- ページごとに変わるデータ（記事内容、商品詳細など）

#### 理由
- グローバルに管理する情報は、多くのコンポーネントで参照・操作されるものです。
- ローカルで管理する情報は、特定のビューまたはコンポーネントでのみ必要なものです。
------------------------------------------------------------------------------------------------
### 2. コンテクストでグローバルに値を管理するものと、ローカルに値を管理するものの区別の観点

#### スコープ
- グローバル：多くのコンポーネントで共有する必要があるか
- ローカル：特定のコンポーネント内で完結するか

#### パフォーマンス
- グローバルで管理すると、不必要に多くのコンポーネントが再レンダリングされる可能性がある。

#### 保守性
- グローバル状態はアプリケーション全体で影響を及ぼす可能性があるため、慎重に管理する。
- ローカル状態は影響範囲が限定されているため、変更が容易。

#### コンポーネント間の連携
- グローバル：複数のコンポーネントが連携する必要がある情報
- ローカル：単一のコンポーネントで完結する情報

これらの観点から判断して、状態管理の方法を選ぶと良いでしょう。
*/
