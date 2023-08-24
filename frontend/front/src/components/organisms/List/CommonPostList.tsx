import { Post } from '../../../types/post';
import { User } from '../../../types/user';

type CommonPostListProps = {
  posts: Post[];
  users: User[];
  noPostsMessage: string;
  ListItemComponent: (props: { feedPost: Post; feedUser: User }) => JSX.Element;
};

const CommonPostList = ({ posts, users, noPostsMessage, ListItemComponent }: CommonPostListProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>{noPostsMessage}</p>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <ol>
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.userId);

          if (user) {
            return <ListItemComponent key={post.id} feedPost={post} feedUser={user} />;
          } else {
            return (
              <div key={post.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
                <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
              </div>
            );
          }
        })}
      </ol>
    </div>
  );
};

// 使用例:
// const FeedList = () => (
//   <CommonPostList posts={feedPosts} users={feedUsers} noPostsMessage="投稿がありません" ListItemComponent={FeedListItem} />
// );

export default CommonPostList;
