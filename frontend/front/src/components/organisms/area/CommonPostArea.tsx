// frontend/front/src/components/organisms/area/CommonPostArea.tsx
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import Pagination from '../../molecules/Pagination';
import CommonPostList from '../list/CommonPostList';

type CommonPostAreaProps = {
  // 投稿作成user
  users: User[];
  posts: Post[];
  // ページネーションで使用
  totalPostsCount: number;
  handlePageChange: (selectedItem: { selected: number }) => void;
  // CommonPostListへ渡す
  noPostsMessage: string;
  // CommonPostListへ渡す
  ListItemComponent: (props: { post: Post; user: User }) => JSX.Element;
  currentPage: number;
};

// 投稿表示エリア
const CommonPostArea = ({
  users,
  posts,
  totalPostsCount,
  handlePageChange,
  noPostsMessage,
  ListItemComponent,
  currentPage,
}: CommonPostAreaProps) => {
  console.log(`注目CommonPostAreaの:${currentPage}`)
  return (
    <div>
      {/* 投稿表示リスト */}
      <CommonPostList
        posts={posts}
        users={users}
        noPostsMessage={noPostsMessage}
        ListItemComponent={ListItemComponent}
      />
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange} currentPage={currentPage}></Pagination>
    </div>
  );
};

export default CommonPostArea;