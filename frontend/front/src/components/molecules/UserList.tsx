import { User } from '../../types';
import UserListItem from '../atoms/UserListItem';

type UserListProps = {
  users: User[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mx-auto mb-2 flex h-10 items-center justify-center text-lg font-semibold sm:text-2xl md:h-14 md:text-4xl'>
        All Users
      </h1>
      <ul className='flex flex-1 flex-col justify-around'>
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default UserList;
