import { useLikedPostsPagination } from '../../../hooks/like/useLikedPostsPagination';
import { User } from '../../../types/user';
import Pagination from '../../molecules/Pagination';
import LikedPostList from '../list/LikedPostList';

type LikedPostAreaProps = {
  user: User;
};

const LikedPostArea = ({ user }: LikedPostAreaProps) => {
  // 指定userIdのlikedPost一覧, likedPost総数, likedUser一覧, ページ変更関数を取得
  const { likedPosts, totalLikedPostsCount, likedUsers, handlePageChange } = useLikedPostsPagination(10, user.id);
  console.log(`LikedPostAreaのtotalLikedPostsCount:${totalLikedPostsCount}`);

  return (
    <div>
      <LikedPostList likedUsers={likedUsers} likedPosts={likedPosts}></LikedPostList>
      <Pagination totalCount={totalLikedPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default LikedPostArea;
