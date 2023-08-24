// frontend/front/src/components/organisms/area/CommonPostArea.tsx
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import Pagination from '../../molecules/Pagination';
import CommonPostList from '../list/CommonPostList';

type CommonPostAreaProps = {
  users: User[];
  posts: Post[];
  totalPostsCount: number;
  handlePageChange: (selectedItem: { selected: number }) => void;
  // CommonPostListへ渡す
  noPostsMessage: string;
  // CommonPostListへ渡す
  ListItemComponent: (props: { post: Post; user: User }) => JSX.Element;
};

const CommonPostArea = ({
  users,
  posts,
  totalPostsCount,
  handlePageChange,
  noPostsMessage,
  ListItemComponent,
}: CommonPostAreaProps) => {
  return (
    <div>
      <CommonPostList
        posts={posts}
        users={users}
        noPostsMessage={noPostsMessage}
        ListItemComponent={ListItemComponent}
      />
      <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
    </div>
  );
};

export default CommonPostArea;

// @          @@          @@          @@          @@          @@          @@          @@          @
// import { Post } from '../../../types/post';
// import { User } from '../../../types/user';
// import Pagination from '../../molecules/Pagination';

// type CommonPostAreaProps = {
//   user: User;
//   posts: Post[];
//   totalPostsCount: number;
//   users: User[];
//   handlePageChange: (data: { selected: number }) => void;
//   ListComponent: (props: { users: User[]; posts: Post[] }) => JSX.Element;
//   // ListComponent: (props: FeedListProps) => JSX.Element;
// };
// // const handlePageChange: (selectedItem: { selected: number }) => void;

// const CommonPostArea = ({ posts, totalPostsCount, users, handlePageChange, ListComponent }: CommonPostAreaProps) => {
//   return (
//     <div>
//       <ListComponent users={users} posts={posts} />
//       <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange} />
//     </div>
//   );
// };

// export default CommonPostArea;