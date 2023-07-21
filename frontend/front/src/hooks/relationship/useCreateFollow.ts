import { createFollow } from '../../api/follow';
import { useAlertContext } from '../../contexts/AlertContext';

export const useCreateFollow = (userId: number, otherUserId: number) => {
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const handleCreateFollow = async () => {
    try {
      const res = await createFollow(userId, otherUserId);
      if (res.data.status === 200) {
        setAlertSeverity('success');
        // setAlertMessage(`${res.data.message}`);
        setAlertMessage('フォローしました');
        setAlertOpen(true);
      }
    } catch (err: any) {
      setAlertSeverity('error');
      // setAlertMessage(`${err.response.data.errors}`);
      setAlertMessage('フォローに失敗しました。');
      setAlertOpen(true);
    }
  };
  return { handleCreateFollow };
};
