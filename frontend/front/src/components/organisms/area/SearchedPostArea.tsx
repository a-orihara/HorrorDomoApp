import { useSearchedPostsPagination } from '../../../hooks/post/useSearchedPostsPagination';
import PostListItem from '../../molecules/listItem/PostListItem';
// import Pagination from '../../molecules/Pagination';
// import FeedList from '../list/FeedList';
import CommonPostArea from './CommonPostArea';

type SearchedPostAreaProps = {
  // [PostSearchForm]の検索欄に入力された検索語句。pagination取得に使用
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
        ListItemComponent={({ post, user }) => <PostListItem post={post} user={user} />}
      />
    </div>
  );
};

export default SearchedPostArea;