import { FollowUser } from '../../types/relationship';
import { User } from '../../types/user';
import { FollowingListItem } from '../atoms/FollowingListItem';

type FollowingListProps = {
  following: FollowUser[];
  user: User;
};

export const FollowingList = ({ following, user }: FollowingListProps) => {
  return (
    <div className='flex-1'>
      <ol>
        {/* 1 オプショナルチェインニング */}
        {following.map((followUser) => (
          <FollowingListItem key={followUser.id} followUser={followUser} user={user}></FollowingListItem>
        ))}
        {}
      </ol>
    </div>
  );
};
