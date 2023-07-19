import { FollowUser } from '../../types/relationship';
import { User } from '../../types/user';
import { FollowingListItem } from '../atoms/FollowingListItem';

type FollowingListProps = {
  following: FollowUser[];
  user: User;
};

export const FollowingList = ({ following, user }: FollowingListProps) => {
  return (
    <div className='flex flex-1 flex-col bg-red-200'>
      <h1 className='mx-auto mb-2 mt-2 flex h-8 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
        All Following
      </h1>
      <ol className='mb-4 flex flex-1 flex-col justify-around'>
        {following.map((followUser) => (
          <FollowingListItem key={followUser.id} followUser={followUser} user={user}></FollowingListItem>
        ))}
        {}
      </ol>
    </div>
  );
};
