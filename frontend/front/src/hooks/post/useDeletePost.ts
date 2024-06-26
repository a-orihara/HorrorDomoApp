import { useRouter } from 'next/router';
import { deletePost } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';
import { usePostContext } from '../../contexts/PostContext';

export const useDeletePost = () => {
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  const { handleGetCurrentUserPostsCount } = usePostContext();
  const router = useRouter();

  const handleDeletePost = async (postId: number) => {
    try {
      const res = await deletePost(postId);
      // 文字列でないとundefinedになる
      if (res.data.status === '200') {
        // 作成更新後のpostの投稿総数を取得。
        handleGetCurrentUserPostsCount();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);

        // 削除後に特定のページにリダイレクトする場合は以下を利用
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        console.log('elseが反応');
        // レスポンスが失敗した場合の処理
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.log('errorが反応');
      setAlertSeverity('error');
      // ${err.res.data.errors}と、responseがresだとエラーになる。axiosの仕様？
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };

  return { handleDeletePost };
};
