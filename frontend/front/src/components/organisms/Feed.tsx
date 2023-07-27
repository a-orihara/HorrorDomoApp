import { useFeedPagination } from '../../hooks/user/useFeedPagination';
import { User } from '../../types/user';
import FeedList from '../molecules/FeedList';
import Pagination from '../molecules/Pagination';

type Feed = {
  user: User;
};

const Feed = ({ user }: Feed) => {
  const { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange } = useFeedPagination(10, user.id);

  // const { } = useGetUserById()
  return (
    <div>
      <FeedList feedUsers={feedUsers} feedPosts={feedPosts}></FeedList>
      <Pagination totalCount={totalFeedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default Feed;
