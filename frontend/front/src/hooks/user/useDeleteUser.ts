import { useRouter } from 'next/router';
import { userDelete } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';

// ================================================================================================
export const useDeleteUser = () => {
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  const router = useRouter();

  // ------------------------------------------------------------------------------------------------
  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await userDelete(userId);
      console.log(`userDeleteのres.data${JSON.stringify(res.data)}`);
      setAlertSeverity('success');
      setAlertMessage('ユーザーが削除されました。');
      setAlertOpen(true);
      setTimeout(() => {
        router.push('/users');
      }, 500);
    } catch (error) {
      console.error(error);
      setAlertSeverity('error');
      setAlertMessage('ユーザーの削除に失敗しました。');
      setAlertOpen(true);
    }
  };

  // ------------------------------------------------------------------------------------------------
  return { handleDeleteUser };
};
