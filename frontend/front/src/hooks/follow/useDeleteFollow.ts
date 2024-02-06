import { deleteFollow } from '../../api/follow';
import { useAlertContext } from '../../contexts/AlertContext';

export const useDeleteFollow = (otherUserId: number | undefined) => {
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();

  const handleDeleteFollow = async () => {
    if (otherUserId !== undefined) {
      try {
        const res = await deleteFollow(otherUserId);
        if (res.data.status === 200) {
          setAlertSeverity('success');
          setAlertMessage(`${res.data.message}`);
          setAlertOpen(true);
        }
      } catch (err: any) {
        setAlertSeverity('error');
        setAlertMessage('フォロー解除に失敗しました。');
        setAlertOpen(true);
      }
    }
  };

  return { handleDeleteFollow };
};
