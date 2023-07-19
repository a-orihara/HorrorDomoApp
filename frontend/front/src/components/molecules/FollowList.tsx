import { User } from '../../types/user';
import { FollowListItem } from '../atoms/FollowListItem';

type FollowListProps = {
  users: User[];
  user: User;
  title: string;
  noUsersMessage: string;
};

export const FollowList = ({ users, user, title, noUsersMessage }: FollowListProps) => {
  return (
    <div className='flex flex-1 flex-col bg-red-200'>
      <h1 className='mx-auto mb-2 mt-2 flex h-8 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
        {title}
      </h1>
      {!users || users.length === 0 ? (
        <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
          <p className='border-b-2 border-slate-200 text-base md:text-xl'>{noUsersMessage}</p>
        </div>
      ) : (
        <ol className='mb-4 flex flex-1 flex-col justify-around'>
          {users.map((targetUser) => (
            <FollowListItem key={targetUser.id} targetUser={targetUser} user={user}></FollowListItem>
          ))}
        </ol>
      )}
    </div>
  );
};
