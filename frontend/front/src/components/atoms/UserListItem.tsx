// frontend/front/src/components/UserListItem.tsx
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useDeleteUser } from '../../hooks/user/useDeleteUser';
import { User } from '../../types';
// 複雑？

// ================================================================================================
type UserListItemProps = {
  user: User;
};
// ================================================================================================
const UserListItem = ({ user }: UserListItemProps) => {
  const { currentUser } = useContext(AuthContext);
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
          <h1 className='text-center text-base hover:text-basic-pink md:text-xl'>{user.name}</h1>
        </a>
      </Link>
      {isAdmin && isDifferentUser && (
        <a className='hover:cursor-pointer' onClick={() => handleDeleteUser(user.id)}>
          <h1 className='text-center text-basic-green hover:text-basic-pink'>delete</h1>
        </a>
      )}
    </li>
  );
};

export default UserListItem;
