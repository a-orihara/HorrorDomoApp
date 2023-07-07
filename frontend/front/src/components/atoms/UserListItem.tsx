// frontend/front/src/components/UserListItem.tsx
import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDeleteUser } from '../../hooks/user/useDeleteUser';
import { User } from '../../types/user';
// 複雑？

// ================================================================================================
type UserListItemProps = {
  user: User;
};
// ================================================================================================
const UserListItem = ({ user }: UserListItemProps) => {
  const { currentUser } = useAuthContext();
  const { handleDeleteUser } = useDeleteUser();
  // 現在のユーザーが管理者で、かつ、現在のユーザーと表示中のユーザーが異なる場合にtrue
  const isDifferentUser = currentUser?.id !== user.id;
  // 現在のユーザーが管理者の場合にtrue
  const isAdmin = currentUser?.admin;

  // ================================================================================================
  return (
    <li key={user.id}>
      <Link href={`/users/${user.id}`}>
        <a>
          <p className='bg-red-100 text-center text-base tracking-widest hover:text-basic-pink md:text-xl'>
            {user.name}
          </p>
        </a>
      </Link>
      {isAdmin && isDifferentUser && (
        <a className='hover:cursor-pointer' onClick={() => handleDeleteUser(user.id)}>
          <p className='text-center text-basic-green hover:text-basic-pink'>delete</p>
        </a>
      )}
    </li>
  );
};

export default UserListItem;
