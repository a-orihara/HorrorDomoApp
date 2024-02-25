import { useLikedPostsPagination } from '../../../hooks/like/useLikedPostsPagination';
import { User } from '../../../types/user';
import LikedPostListItem from '../../molecules/listItem/LikedPostListItem';
import CommonPostArea from './CommonPostArea';
// import Pagination from '../../molecules/Pagination';
// import LikedPostList from '../list/LikedPostList';

type LikedPostAreaProps = {
  user: User;
};

const LikedPostArea = ({ user }: LikedPostAreaProps) => {
  // 指定userIdのlikedPost一覧, likedPost総数, likedUser一覧, ページ変更関数を取得
  const { likedPosts, totalLikedPostsCount, likedUsers, handlePageChange, isLoading } = useLikedPostsPagination(10, user.id);

  if (isLoading) {
    return <div className='flex flex-1 items-center justify-center'>Loading...</div>;
  }
  return (
    <CommonPostArea
      users={likedUsers}
      posts={likedPosts}
      totalPostsCount={totalLikedPostsCount}
      handlePageChange={handlePageChange}
      // 孫のCommonPostListに渡す
      noPostsMessage='投稿がありません'
      // 孫のCommonPostListに渡す
      ListItemComponent={({ post, user }) => <LikedPostListItem likedPost={post} likedUser={user} />}
    />
  );
};

export default LikedPostArea;
