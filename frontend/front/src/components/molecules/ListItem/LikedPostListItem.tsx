// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import Link from 'next/link';
import { useAuthContext } from '../../../contexts/AuthContext';
import useFormattedTime from '../../../hooks/helpers/useFormattedTime';
import { useDeletePost } from '../../../hooks/post/useDeletePost';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import { LikeButtonIcon } from '../../atoms/LikeButtonIcon';
import UserAvatar from '../../atoms/UserAvatar';

// LikedPostListItemPropsはkey名がpostで値にLikedPost型を持つオブジェクト型;
type LikedPostListItemProps = {
  likedPost: Post;
  likedUser: User;
};

// 指定userIdのlikedPost, likedUser
const LikedPostListItem = ({ likedPost, likedUser }: LikedPostListItemProps) => {
  // likedPostの作成日時を形成するカスタムフック
  const postCreatedTime = useFormattedTime(likedPost.createdAt);
  // likedPostの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent =
    likedPost.content.length > 30 ? `${likedPost.content.substring(0, 30)}...` : likedPost.content;
  // currentUserと指定userIdが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  const { handleDeletePost } = useDeletePost();
  // console.log(`LikePostListItemのlikedPost.liked:${likedPost.liked}`);

  return (
    <li key={likedPost.id} className='my-px rounded-md bg-basic-beige'>
      <div className='flex'>
        <UserAvatar avatarUrl={likedUser.avatarUrl} userId={likedUser.id}></UserAvatar>
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
            {/* {currentUser && currentUser.id !== likedPost.userId && (
              // 2
              // 指定userのlikedPostのidと、currentUserのliked（真偽値）
              <LikeButtonIcon postId={likedPost.id} liked={likedPost.liked} />
            )} */}
            <LikeButtonIcon postId={likedPost.id} liked={likedPost.liked} />
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
