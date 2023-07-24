import { useFeedPagination } from '../../hooks/user/useFeedPagination';
import { User } from '../../types/user';
import Pagination from '../molecules/Pagination';
import PostList from '../molecules/PostList';

type Feed = {
  user: User;
};

const Feed = ({ user }: Feed) => {
  const { posts, totalPostsCount, handlePageChange } = useFeedPagination(10, user.id);
  console.log(`ホームページの諸々の値totalPostsCount:${totalPostsCount}`);
  console.log(`ホームページの諸々の値posts:${JSON.stringify(posts)}`);
  return (
    <div>
      <PostList user={user} posts={posts}></PostList>
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default Feed;
