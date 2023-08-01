import { useState } from 'react';
import { createLike, deleteLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';
import { useLikeContext } from '../../contexts/LikeContext';

// いいねのトグルフック。いいね総数を更新する為、引数にuserIdを追加
export const useToggleLike = (liked: boolean, postId: number, userId: number) => {
  // いいね済みかの真偽値。初期値はBDから取得したpostのliked
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  // いいねがトグルされたらいいね総数を更新する為、handleGetAllLikesを取得
  const { handleGetAllLikes } = useLikeContext();

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
        // いいね総数を更新
        handleGetAllLikes(userId);
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
