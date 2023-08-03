import { useLikedPostsPagination } from '../../hooks/like/useLikedPostsPagination';
import { User } from '../../types/user';
import LikedPostList from '../molecules/LikedPostList';
import Pagination from '../molecules/Pagination';

type LikedPostAreaProps = {
  user: User;
};

const LikedPostArea = ({ user }: LikedPostAreaProps) => {
  const { likedPosts, totalLikedPostsCount, handlePageChange } = useLikedPostsPagination(10, user.id);

  return (
    <div>
      <LikedPostList user={user} posts={likedPosts}></LikedPostList>
      <Pagination totalCount={totalLikedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default LikedPostArea;
