import { useState } from 'react';
import { deleteLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';

export const useDeleteLike = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();

  const handleDeleteLike = async (postId: number) => {
    try {
      const res = await deleteLike(postId);
      if (res.status === 200) {
        // ステータスコードは適切なものに修正してください
        setIsLiked(!isLiked);
        console.log('いいねを取り消した');
      }
    } catch (err: any) {
      setAlertSeverity('error');
      const message = err.response.message || err.response.data.errors[0];
      setAlertMessage(message);
      setAlertOpen(true);
    }
  };
  return {
    isLiked,
    handleDeleteLike,
  };
};
