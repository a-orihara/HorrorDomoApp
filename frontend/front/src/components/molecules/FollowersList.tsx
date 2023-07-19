import { Follower } from '../../types/relationship';
import { User } from '../../types/user';
import { FollowersListItem } from '../atoms/FollowersListItem';

type FollowersListProps = {
  followers: Follower[];
  user: User;
};

export const FollowersList = ({ followers, user }: FollowersListProps) => {
  return (
    <div className='flex flex-1 flex-col bg-red-200'>
      <h1 className='mx-auto mb-2 mt-2 flex h-8 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
        All Followers
      </h1>
      <ol className='mb-4 flex flex-1 flex-col justify-around'>
        {followers.map((follower) => (
          <FollowersListItem key={follower.id} follower={follower} user={user}></FollowersListItem>
        ))}
        {}
      </ol>
    </div>
  );
};
