import { useState } from 'react';
import { createLike, deleteLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';

// いいねのトグルフック
export const useToggleLike = (liked: boolean, postId: number) => {
  // いいね済みかの真偽値
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();

  const handleToggleLike = async () => {
    try {
      let res;
      // いいね済みならいいねを削除、いいねしていなければいいねを作成
      if (isLiked) {
        res = await deleteLike(postId);
      } else {
        res = await createLike(postId);
      }
      if (res.status === 200 || res.status === 201) {
        // isLikedをfalseからtrue、またはtrueからfalseに変更
        setIsLiked(!isLiked);
        console.log('いいねの状態をトグルした');
      }
    } catch (err: any) {
      setAlertSeverity('error');
      // authenticate_api_v1_user!のエラーレスポンスの形式:{err.response.data.errors[0]}
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
