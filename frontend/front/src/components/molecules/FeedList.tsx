// frontend/front/src/components/molecules/FeedList.tsx
import { Post } from '../../types/post';

type FeedListProps = {
  feedPosts: Post[];
  feedUserIds: number[];
};
const FeedList = ({ feedPosts, feedUserIds }: FeedListProps) => {
  const postUserIds = feedPosts.map((feedPost) => feedPost.userId);

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
          const user = feedUserIds.find((feedUserId) => feedUserId === postUserId);
          return <FeedListItem key={feedPost.id} post={feedPost} user={user}></FeedListItem>;
        })}
      </ol>
    </div>
  );
};

export default FeedList;
