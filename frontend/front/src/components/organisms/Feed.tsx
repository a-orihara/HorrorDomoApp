import { useUserFeedPagination } from '../../hooks/user/useUserFeedPagination';
import { User } from '../../types/user';
import Pagination from '../molecules/Pagination';
import PostList from '../molecules/PostList';

export const Feed = (user: User) => {
  const { posts, totalPostsCount, handlePageChange } = useUserFeedPagination(user.id);
  return (
    <div>
      <PostList posts={posts} user={user}></PostList>
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};
