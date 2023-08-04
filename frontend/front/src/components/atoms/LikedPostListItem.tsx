// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import useFormattedTime from '../../hooks/helpers/useFormattedTime';
import { useDeletePost } from '../../hooks/post/useDeletePost';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { LikeButtonIcon } from './LikeButtonIcon';

// LikedPostListItemPropsはkey名がpostで値にLikedPost型を持つオブジェクト型;
type LikedPostListItemProps = {
  likedPost: Post;
  likedUser: User;
};

// post:投稿、user:投稿者のuserで、current又はotherUserらが入る
const LikedPostListItem = ({ likedPost, likedUser }: LikedPostListItemProps) => {
  // postの作成日時を形成するカスタムフック
  const postCreatedTime = useFormattedTime(likedPost.createdAt);
  // postの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent =
    likedPost.content.length > 30 ? `${likedPost.content.substring(0, 30)}...` : likedPost.content;
  // ログインユーザーと投稿者のidが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  const { handleDeletePost } = useDeletePost();

  return (
    <li key={likedPost.id} className='basic-border my-px'>
      <div className='flex'>
        <div className='mx-4'>
          <Link href={`/users/${likedUser.id}`}>
            <a>
              <img
                src={likedUser.avatarUrl || '/no_image_square.jpg'}
                alt='user avatar'
                className='mt-2 h-8 w-8 rounded-full md:h-16 md:w-16'
              />
            </a>
          </Link>
        </div>
        <div>
          <p>
            <Link href={`/users/${likedUser.id}`}>
              <a className='text-xs lg:text-base lg:tracking-wider'>{likedUser.name}</a>
            </Link>
          </p>
          {/* <p className='text-sm md:text-xl'>タイトル:{likedPost.title}</p> */}
          <Link href={`/post/${likedPost.id}`}>
            <a className='text-sm text-black  text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
              {likedPost.title}
            </a>
          </Link>
          <p className='text-left text-sm  md:text-xl'>{truncateContent}</p>
          <div className='flex'>
            <p className='mr-5 text-xs lg:text-base'>作成日時:{postCreatedTime}</p>
            {currentUser && currentUser.id !== likedPost.userId && (
              // 2
              // <LikeButtonIcon postId={post.id} liked={post.liked} userId={user.id} />
              <LikeButtonIcon postId={likedPost.id} liked={likedPost.liked} />
            )}
            {currentUser?.id === likedPost.userId && (
              <a
                className='hover:cursor-pointer'
                onClick={() => {
                  if (window.confirm('投稿を削除しますか？')) {
                    handleDeletePost(likedPost.id);
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

export default LikedPostListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1

*/
