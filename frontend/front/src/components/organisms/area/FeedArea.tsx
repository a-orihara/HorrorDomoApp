import { useFeedPagination } from '../../../hooks/user/useFeedPagination';
import { User } from '../../../types/user';
import FeedListItem from '../../molecules/listItem/FeedListItem';
// import Pagination from '../../molecules/Pagination';
// import FeedList from '../list/FeedList';
import CommonPostArea from './CommonPostArea';

type FeedAreaProps = {
  user: User;
};

const FeedArea = ({ user }: FeedAreaProps) => {
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

export default FeedArea;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
以前のコード
------------------------------------------------------------------------------------------------
const FeedArea = ({ user }: FeedAreaProps) => {
  // feedUsers:投稿ユーザーの集合、user.id（currentUser）を使って、currentUserのfeedUsersを取得
  const { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange } = useFeedPagination(10, user.id);

  // const { } = useGetUserById()
  return (
    <div>
      * FeedList->FeedListItemには、feed情報を渡す *
      <FeedList feedUsers={feedUsers} feedPosts={feedPosts}></FeedList>
      <Pagination  totalCount={totalFeedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};
*/
