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
      if (res.status === 200) {
        setAlertSeverity('success');
        setAlertMessage(res.data.message);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/users');
        }, 500);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`else${res.data.errors.fullMessages[0]}`);
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage('ユーザーの削除に失敗しました。');
      setAlertOpen(true);
    }
  };

  // ------------------------------------------------------------------------------------------------
  return { handleDeleteUser };
};
