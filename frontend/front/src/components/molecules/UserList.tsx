import { User } from '../../types/user';
import UserListItem from '../atoms/UserListItem';

type UserListProps = {
  users: User[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mx-auto mb-2 flex h-12 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
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
