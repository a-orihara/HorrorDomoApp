// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import { useAuthContext } from '../../../contexts/AuthContext';
import { useDeletePost } from '../../../hooks/post/useDeletePost';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import UserAvatar from '../../atoms/UserAvatar';
import UserAndPostLinks from '../UserAndPostLinks';
import CommonListItem from './CommonListItem';

// LikedPostListItemPropsはkey名がpostで値にLikedPost型を持つオブジェクト型;
type LikedPostListItemProps = {
  likedPost: Post;
  likedUser: User;
};

// 指定userIdのlikedPost, likedUser（投稿作成者）
const LikedPostListItem = ({ likedPost, likedUser }: LikedPostListItemProps) => {
  // currentUserと指定userIdが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  const { handleDeletePost } = useDeletePost();
  // console.log(`LikePostListItemのlikedPost.liked:${likedPost.liked}`);

  return (
    <li key={likedPost.id} className='my-px rounded-md bg-basic-beige'>
      <div className='flex'>
        <UserAvatar avatarUrl={likedUser.avatarUrl} userId={likedUser.id}></UserAvatar>
        <div>
          <UserAndPostLinks user={likedUser} post={likedPost}></UserAndPostLinks>
          <CommonListItem
            post={likedPost}
            // user={likedUser}
            currentUser={currentUser}
            handleDeletePost={handleDeletePost}
          />
        </div>
      </div>
    </li>
  );
};

export default LikedPostListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
*/
