import { Post } from '../../../types/post';
import { User } from '../../../types/user';

type CommonPostListProps = {
  posts: Post[];
  users: User[];
  ListItemComponent: React.FC<{ post: Post; user: User }>;
  emptyMessage: string;
};

const CommonPostList = ({ posts, users, ListItemComponent, emptyMessage }: CommonPostListProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className='flex-1'>
      <ol>
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.userId);
          if (user) {
            return <ListItemComponent key={post.id} post={post} user={user} />;
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

export default CommonPostList;
