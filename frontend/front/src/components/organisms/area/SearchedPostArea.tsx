import { useSearchedPostsPagination } from '../../../hooks/post/useSearchedPostsPagination';
import FeedListItem from '../../molecules/listItem/FeedListItem';
// import Pagination from '../../molecules/Pagination';
// import FeedList from '../list/FeedList';
import CommonPostArea from './CommonPostArea';

type SearchedPostAreaProps = {
  searchQuery: string;
};

const SearchedPostArea = ({ searchQuery }: SearchedPostAreaProps) => {
  const { searchedPosts, searchedTotalPostsCount, searchedPostUsers, handlePageChange } = useSearchedPostsPagination(
    10,
    searchQuery
  );

  return (
    <div>
      <CommonPostArea
        users={searchedPostUsers}
        posts={searchedPosts}
        totalPostsCount={searchedTotalPostsCount}
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
