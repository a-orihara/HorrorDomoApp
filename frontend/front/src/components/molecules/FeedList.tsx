// frontend/front/src/components/molecules/FeedList.tsx
import { Post } from '../../types/post';
import { User } from '../../types/user';

type FeedListProps = {
  feedPosts: Post[];
  feedUsers: User[];
};
const FeedList = ({ feedPosts, feedUsers }: FeedListProps) => {
  // posts
  // ポストのidの集合
  // usersの集合 = feedUsers
  // const postUserIds = feedPosts.map((feedPost) => feedPost.userId);

  if (!feedPosts || feedPosts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿がありません</p>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <ol>
        {feedPosts?.map((feedPost) => {
          const user = feedUsers.find((feedUser) => feedUser.id === feedPost.userId);
          return <FeedListItem key={feedPost.id} post={feedPost} user={user}></FeedListItem>;
        })}
      </ol>
    </div>
  );
};

export default FeedList;
