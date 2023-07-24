import { useAuthContext } from '../../contexts/AuthContext';
import { useFeedPagination } from '../../hooks/user/useFeedPagination';
import Pagination from '../molecules/Pagination';
import PostList from '../molecules/PostList';

export const Feed = () => {
  const { currentUser } = useAuthContext();
  const { posts, totalPostsCount, handlePageChange } = useFeedPagination(10, currentUser.id);
  if (!currentUser) {
    // currentUserがundefinedのときは何も表示しない、またはロード中の表示などにする
    return null;
  }
  return (
    <div>
      <PostList posts={posts} user={currentUser}></PostList>
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};
