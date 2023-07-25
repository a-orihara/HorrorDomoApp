import { useFeedPagination } from '../../hooks/user/useFeedPagination';
import { User } from '../../types/user';
import Pagination from '../molecules/Pagination';
import PostList from '../molecules/PostList';

type Feed = {
  user: User;
};

const Feed = ({ user }: Feed) => {
  const { feedPosts, totalFeedPostsCount, feedUserIds, handlePageChange } = useFeedPagination(10, user.id);
  console.log(`ホームページの諸々の値totalPostsCount:${totalFeedPostsCount}`);
  console.log(`ホームページの諸々の値feedPosts:${JSON.stringify(feedPosts)}`);
  console.log(`ホームページの諸々の値feedUserIds:${feedUserIds}`);
  // const { } = useGetUserById()
  return (
    <div>
      <PostList user={user} posts={feedPosts}></PostList>
      <Pagination totalCount={totalFeedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default Feed;
