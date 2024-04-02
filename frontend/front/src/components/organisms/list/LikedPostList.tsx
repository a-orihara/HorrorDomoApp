import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import LikedPostListItem from '../../molecules/listItem/LikedPostListItem';
import CommonPostList from './CommonPostList';

type LikedPostListProps = {
  likedPosts: Post[];
  likedUsers: User[];
};

const LikedPostList = ({ likedPosts, likedUsers }: LikedPostListProps) => {
  return (
    // 詳細な説明はFeedList.tsxを参照
    <CommonPostList
      posts={likedPosts}
      users={likedUsers}
      // 無名関数を渡す
      ListItemComponent={({ post, user }) => <LikedPostListItem likedPost={post} likedUser={user} />}
      noPostsMessage='いいねした投稿がありません'
    />
  );
};

export default LikedPostList;
