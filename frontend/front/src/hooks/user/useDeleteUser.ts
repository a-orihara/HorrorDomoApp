import { useRouter } from 'next/router';
import { userDelete } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';

export const useDeleteUser = () => {
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  const router = useRouter();

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
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage('ユーザーの削除に失敗しました');
        setAlertOpen(true);
      }
    } catch (err:any) {
      setAlertSeverity('error');
      // バックエンドの:set_user, :admin_userのエラーメッセージを処理
      if (err.response && err.response.data && err.response.data.message) {
        setAlertMessage(err.response.data.message);
    } else {
      setAlertMessage('ユーザーの削除に失敗しました。');
    }
      setAlertOpen(true);
    }
  };

  return { handleDeleteUser };
};
