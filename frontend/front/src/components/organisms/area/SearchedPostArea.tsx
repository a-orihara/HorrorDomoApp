import { useFeedPagination } from '../../../hooks/user/useFeedPagination';
import { User } from '../../../types/user';
import FeedListItem from '../../molecules/listItem/FeedListItem';
// import Pagination from '../../molecules/Pagination';
// import FeedList from '../list/FeedList';
import CommonPostArea from './CommonPostArea';

type SearchedPostAreaProps = {
  user: User;
};

const SearchedPostArea = ({ user }: SearchedPostAreaProps) => {
  const { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange } = useFeedPagination(10, user.id);
  return (
    <div>
      <CommonPostArea
        users={feedUsers}
        posts={feedPosts}
        totalPostsCount={totalFeedPostsCount}
        handlePageChange={handlePageChange}
        // 孫のCommonPostListに渡す
        noPostsMessage='投稿がありません'
        // 孫のCommonPostListに渡し、ListItemContentで使用
        ListItemComponent={({ post, user }) => <FeedListItem feedPost={post} feedUser={user} />}
      />
    </div>
  );
};

export default SearchedPostArea;
