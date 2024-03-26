import { useFeedPagination } from '../../../hooks/user/useFeedPagination';
import { User } from '../../../types/user';
import FeedListItem from '../../molecules/listItem/FeedListItem';
import CommonPostArea from './CommonPostArea';

type FeedAreaProps = {
  user: User;
};

const FeedArea = ({ user }: FeedAreaProps) => {
  const { feedPosts, totalFeedPostsCount, feedUsers, handlePageChange, isLoading, currentPage } = useFeedPagination(10, user.id);
  if (isLoading) {
    return <div className='flex flex-1 items-center justify-center'>Loading...</div>;
  }
  return (
    <div>
      {/* 1ページ当たりのfeedのpostとuserを`CommonPostArea`に受け渡し */}
      <CommonPostArea
        users={feedUsers}
        posts={feedPosts}
        totalPostsCount={totalFeedPostsCount}
        handlePageChange={handlePageChange}
        // 孫のCommonPostListに渡す
        noPostsMessage='投稿がありません'
        // 孫のCommonPostListに渡し、ListItemContentで使用
        ListItemComponent={({ post, user }) => <FeedListItem feedPost={post} feedUser={user} />}
        currentPage={currentPage}
      />
    </div>
  );
};

export default FeedArea;