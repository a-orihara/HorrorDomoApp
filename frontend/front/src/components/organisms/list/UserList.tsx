import { User } from '../../../types/user';
import UserListItem from '../../molecules/listItem/UserListItem';

type UserListProps = {
  users: User[];
};
// users:指定したページの指定した表示件数分のユーザー情報。
const UserList = ({ users }: UserListProps) => {
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mx-auto mb-2 mt-2 flex h-8 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
        All Users
      </h1>
      <ol className='mb-4 flex flex-1 flex-col justify-around '>
      {/* user:指定したページの指定した表示件数分のユーザー情報を一人ずつ取り出し */}
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ol>
    </div>
  );
};

export default UserList;
