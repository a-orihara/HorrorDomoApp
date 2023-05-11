// frontend/front/src/components/UserListItem.tsx
import Link from 'next/link';
import { User } from '../../types';

type UserListItemProps = {
  user: User;
};

const UserListItem = ({ user }: UserListItemProps) => {
  return (
    <li key={user.id}>
      <Link href={`/users/${user.id}`}>
        <a>
          <h1 className='text-center text-base hover:text-basic-pink md:text-xl'>{user.name}</h1>
        </a>
      </Link>
    </li>
  );
};

export default UserListItem;
