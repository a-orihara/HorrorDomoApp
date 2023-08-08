import { useFeedPagination } from '../../../hooks/user/useFeedPagination';
import { User } from '../../../types/user';
import Pagination from '../../molecules/Pagination';
import FeedList from '../list/FeedList';

type FeedAreaProps = {
  user: User;
};

// user:currentUser
const FeedArea = ({ user }: FeedAreaProps) => {
  // feedUsers:投稿ユーザーの集合、user.id（currentUser）を使って、currentUserのfeedUsersを取得
  const { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange } = useFeedPagination(10, user.id);

  // const { } = useGetUserById()
  return (
    <div>
      {/* FeedList->FeedListItemには、feed情報を渡す */}
      <FeedList feedUsers={feedUsers} feedPosts={feedPosts}></FeedList>
      <Pagination totalCount={totalFeedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default FeedArea;