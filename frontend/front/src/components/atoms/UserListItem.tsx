// frontend/front/src/components/UserListItem.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { userDelete } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import { User } from '../../types';

// ================================================================================================
type UserListItemProps = {
  user: User;
};
// ================================================================================================
const UserListItem = ({ user }: UserListItemProps) => {
  const { currentUser } = useContext(AuthContext);
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  // 現在のユーザーが管理者で、かつ、現在のユーザーと表示中のユーザーが異なる場合にtrue
  const isDifferentUser = currentUser?.id !== user.id;
  // 現在のユーザーが管理者の場合にtrue
  const isAdmin = currentUser?.admin;
  const router = useRouter();

  // ------------------------------------------------------------------------------------------------

  // ユーザー削除ハンドラー
  const handleDeleteUser = async (userId: number) => {
    try {
      // userDelete: ユーザー削除API
      const res = await userDelete(userId);
      console.log(`userDeleteのres.data${JSON.stringify(res.data)}`);
      setAlertSeverity('success'); // AlertMessageのseverityを設定
      setAlertMessage('ユーザーが削除されました。'); // AlertMessageのmessageを設定
      setAlertOpen(true); // AlertMessageを表示
      setTimeout(() => {
        router.push('/users');
      }, 500);
    } catch (error) {
      console.error(error);
      setAlertSeverity('error'); // AlertMessageのseverityを設定
      setAlertMessage('ユーザーの削除に失敗しました。'); // AlertMessageのmessageを設定
      setAlertOpen(true); // AlertMessageを表示
    }
  };

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
