// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import useFormattedTime from '../../hooks/helpers/useFormattedTime';
import { useDeletePost } from '../../hooks/post/useDeletePost';
import { Post } from '../../types/post';
import { User } from '../../types/user';

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
  const { handleDeletePost } = useDeletePost();

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


*/
