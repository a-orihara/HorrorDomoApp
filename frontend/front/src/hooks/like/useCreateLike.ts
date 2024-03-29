import { useState } from 'react';
import { createLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';

export const useCreateLike = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();

  const handleCreateLike = async (postId: number) => {
    try {
      const res = await createLike(postId);
      if (res.status === 201) {
        setIsLiked(!isLiked);
        console.log('いいねした');
      }
    } catch (err: any) {
      setAlertSeverity('error');
      setAlertMessage(err.response.message);
      setAlertOpen(true);
    }
  };
  return {
    isLiked,
    handleCreateLike,
  };
};
