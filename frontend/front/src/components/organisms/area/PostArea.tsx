// import { useLikedPostsPagination } from '../../hooks/like/useLikedPostsPagination';
import { usePostsPagination } from '../../../hooks/post/usePostsPagination';
import { User } from '../../../types/user';
// import LikedPostList from '../molecules/LikedPostList';
import Pagination from '../../molecules/Pagination';
import PostList from '../list/PostList';

type PostAreaProps = {
  user: User;
};

const PostArea = ({ user }: PostAreaProps) => {
  // 指定userIdのlikedPost一覧, likedPost総数, likedUser一覧, ページ変更関数を取得
  // この10は、1ページ当たりの表示件数->itemsPerPage: number, userId?: number
  const { posts, totalPostsCount, handlePageChange } = usePostsPagination(10, user.id);

  return (
    <div>
      {/* 1 */}
      <PostList posts={posts} user={user}></PostList>
      {/* 2 */}
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default PostArea;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
postsは、usePostsPaginationからのposts（指定したuserIdのユーザーの、指定したページの1ページ当たりの表示件数分
のpost）
userは、useGetUserById(id)からのuser（指定したidのuser情報）

================================================================================================
2
totalPostsCountは、usePostsPaginationからのtotalPostsCount（指定したidのuserの投稿総数）
handlePageChangeは、usePostsPaginationからのhandlePageChange（ページ切り替えで発火。ページネーションのペー
ジ変更時の処理[カレントページのset。ページ切り替え]）
------------------------------------------------------------------------------------------------
ページネーションでページ遷移するたびに、新しく選択されたページの内容が取得されて表示されます。
それはカレントページが依存配列で、カレントページが変更されるたびに、handleGetPostListByUserIdが再実行されるため
です。
*/
