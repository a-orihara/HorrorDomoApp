// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import Link from 'next/link';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useDeletePost } from '../../../hooks/post/useDeletePost';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import UserAvatar from '../../atoms/UserAvatar';
import ListItemContent from './ListItemContent';

// PostListItemPropsはkey名がpostで値にPost型を持つオブジェクト型;
type PostListItemProps = {
  post: Post;
  user: User;
};

// 1 関数コンポーネントの引数は基本的にオブジェクト型。
const PostListItem = ({ post, user }: PostListItemProps) => {
  // currentUserと投稿者のidが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  // 投稿を削除する関数
  const { handleDeletePost } = useDeletePost();

  return (
    <li key={post.id} className='my-px rounded-md bg-basic-beige'>
      <div className='flex'>
        <UserAvatar avatarUrl={user.avatarUrl} userId={user.id}></UserAvatar>
        <div>
          <p>
            <Link href={`/users/${user.id}`}>
              <a className='text-xs lg:text-base lg:tracking-wider'>{user.name}</a>
            </Link>
          </p>
          {/* <p className='text-sm md:text-xl'>タイトル:{post.title}</p> */}
          <Link href={`/post/${post.id}`}>
            <a className='text-sm text-black  text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
              {post.title}
            </a>
          </Link>
          <ListItemContent post={post} user={user} currentUser={currentUser} handleDeletePost={handleDeletePost} />
          {/* <p className='text-left text-sm  md:text-xl'>{truncateContent}</p>
          <div className='flex'>
            <p className='mr-5 text-xs lg:text-base'>作成日時:{postCreatedTime}</p>
            {currentUser && currentUser.id !== post.userId && (
              // 2
              // <LikeButtonIcon postId={post.id} liked={post.liked} userId={user.id} />
              <LikeButtonIcon postId={post.id} liked={post.liked} />
            )}
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
            )} */}
        </div>
      </div>
    </li>
  );
};

export default PostListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
分割代入を使わない場合は、

const PostListItem = (props: PostListItemProps) => {
  const post = props.post;
  return (
    <li key={post.id}>
      <p className='text-center text-base md:text-xl'>{post.content}</p>
    </li>
  );
};
------------------------------------------------------------------------------------------------
オブジェクトのプロパティを取り出す例、

type PostListItemProps = {
  myName: string;
};

const hello = (name:PostListItemProps) =>{
    const helloName = name.myName
    console.log(`こんにちは${helloName}さん`)
}

*オブジェクトで渡す場合は、引数の型をオブジェクト型にする必要がある。
hello({myName:"Mike"});

================================================================================================
2
userIdにcurrentUser.idを渡すと、いいねをした際に、いいね数の表示がcurrentUserのものに切り替わってしまう。

*/
