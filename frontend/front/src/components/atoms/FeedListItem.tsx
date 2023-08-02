// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import useFormattedTime from '../../hooks/helpers/useFormattedTime';
import { useDeletePost } from '../../hooks/post/useDeletePost';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { LikeButtonIcon } from './LikeButtonIcon';

// FeedListItemPropsはkey名がfeedPostで値にPost型を持つオブジェクト型;
type FeedListItemProps = {
  feedPost: Post;
  feedUser: User;
};

// 1 関数コンポーネントの引数は基本的にオブジェクト型。
const FeedListItem = ({ feedPost, feedUser }: FeedListItemProps) => {
  // feedPostの作成日時を形成するカスタムフック
  const feedPostCreatedTime = useFormattedTime(feedPost.createdAt);
  // feedPostの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent = feedPost.content.length > 30 ? `${feedPost.content.substring(0, 30)}...` : feedPost.content;
  // ログインユーザーと投稿者のidが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  // // 現在のユーザーが未定義かどうかを確認
  // const userId = currentUser?.id;
  const { handleDeletePost } = useDeletePost();
  console.log(`feedPost:の${feedPost.liked}`);
  console.log(`feedListItemのpost:${JSON.stringify(feedPost)}`);

  return (
    <li key={feedPost.id} className='my-px bg-slate-100'>
      <div className='flex flex-row'>
        <div className='mx-4'>
          <Link href={`/users/${feedUser.id}`}>
            <a>
              <img
                src={feedUser.avatarUrl || '/no_image_square.jpg'}
                alt='user avatar'
                className='mt-2 h-8 w-8 rounded-full md:h-16 md:w-16'
              />
            </a>
          </Link>
        </div>

        <div>
          <p>
            <Link href={`/users/${feedUser.id}`}>
              <a className='text-xs lg:text-base lg:tracking-wider'>{feedUser.name}</a>
            </Link>
          </p>
          {/* <p className='text-sm md:text-xl'>タイトル:{feedPost.title}</p> */}
          <Link href={`/post/${feedPost.id}`}>
            <a className='text-sm text-black  text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
              {feedPost.title}
            </a>
          </Link>
          <p className='text-left text-sm  md:text-xl'>{truncateContent}</p>
          <div className='flex'>
            <p className='mr-5 text-xs lg:text-base'>作成日時:{feedPostCreatedTime}</p>
            {/* 2 postIdを使ってpostを指定、 likedでpostの現在のいいねの真偽値を取得 */}
            {/* {currentUser && <LikeButtonIcon postId={feedPost.id} liked={feedPost.liked} userId={currentUser.id} />}
             */}
            {currentUser && currentUser.id !== feedPost.userId && (
              <LikeButtonIcon postId={feedPost.id} liked={feedPost.liked} userId={currentUser.id} />
            )}
            {currentUser?.id === feedPost.userId && (
              <a
                className='hover:cursor-pointer'
                onClick={() => {
                  if (window.confirm('投稿を削除しますか？')) {
                    handleDeletePost(feedPost.id);
                  }
                }}
              >
                <h1 className='text-center text-sm text-basic-green hover:text-basic-pink lg:text-base'>delete</h1>
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default FeedListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
分割代入を使わない場合は、

const FeedListItem = (props: FeedListItemProps) => {
  const feedPost = props.feedPost;
  return (
    <li key={feedPost.id}>
      <p className='text-center text-base md:text-xl'>{feedPost.content}</p>
    </li>
  );
};
------------------------------------------------------------------------------------------------
オブジェクトのプロパティを取り出す例、

type FeedListItemProps = {
  myName: string;
};

const hello = (name:FeedListItemProps) =>{
    const helloName = name.myName
    console.log(`こんにちは${helloName}さん`)
}

*オブジェクトで渡す場合は、引数の型をオブジェクト型にする必要がある。
hello({myName:"Mike"});

================================================================================================
2
currentUserが定義されている場合にのみLikeButtonIconコンポーネントを描画します。
よって、LikeButtonIconコンポーネントに渡されるuserIdは常にnumber型となり、undefinedは渡されません。
------------------------------------------------------------------------------------------------
. 一般的には `undefined` を可能な限り早く処理することでエラーの可能性を最小限に抑えることが推奨されています。した
がって、この場合、`FeedListItem` コンポーネントで `currentUser` が `undefined` かどうかを確認し、
`LikeButtonIcon` コンポーネントには `undefined` を渡さないようにするのが一般的に良いとされています。
. この修正により、currentUserが定義されていない場合には、LikeButtonIcon自体がレンダリングされません。よって、
LikeButtonIconにundefinedが渡されることはありません。
. Reactのコンポーネントは可能な限り "pure"（純粋）であるべきです。つまり、ある入力が与えられた時に同じ出力を返すべ
きです。したがって、undefinedやnullが許容されないpropsを持つコンポーネントにそれらの値を渡すべきではありません。
これにより、コンポーネントの安定性と予測可能性が保証されます。
*/
