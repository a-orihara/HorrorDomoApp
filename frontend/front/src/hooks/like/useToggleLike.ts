import { useState } from 'react';
import { createLike, deleteLike } from '../../api/like';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useLikeContext } from '../../contexts/LikeContext';

// いいねのトグルフック。いいね総数を更新する為、引数にuserId（/users/:idのid）を追加
export const useToggleLike = (liked: boolean, postId: number, userId: number) => {
  // いいね済みかの真偽値。初期値はBDから取得したpostのliked
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const { currentUser } = useAuthContext();
  // いいねがトグルされたらいいね総数を更新する為、handleGetAllLikesを取得
  const { handleGetAllLikesByCurrentUserId } = useLikeContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  // console.log(`user.idは:${userId}、likeの状態は:${isLiked}`);

  const handleToggleLike = async () => {
    try {
      let res;
      // いいね済みならいいねを削除、いいねしていなければいいねを作成
      if (isLiked) {
        res = await deleteLike(postId);
        setIsLiked(false);
      } else {
        res = await createLike(postId);
        setIsLiked(true);
      }
      // トグルが成功したら、currentUserのいいね総数を更新する
      if (res.status === 200 || res.status === 201) {
        // このuserIdはusers/:idのid
        if (currentUser) {
          handleGetAllLikesByCurrentUserId(currentUser.id);
        }
        // } else {
        //   // いいね総数を更新
        //   console.log('handleGetAllLikesByOtherUserIdが呼ばれた');
        //   handleGetAllLikesByOtherUserId(userId);
        // }
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
