import { useState } from 'react';
import { createLike, deleteLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';

export const useToggleLike = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();

  const handleToggleLike = async (postId: number) => {
    try {
      let res;
      if (isLiked) {
        res = await deleteLike(postId);
      } else {
        res = await createLike(postId);
      }
      if (res.status === 200 || res.status === 201) {
        setIsLiked(!isLiked);
        console.log('いいねの状態をトグルした');
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
    handleToggleLike,
  };
};
