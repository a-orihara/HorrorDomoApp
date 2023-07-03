import { useRouter } from 'next/router';
import { deletePost } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';

export const useDeletePost = () => {
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  const router = useRouter();

  // const handleDeletePost = async (postId: number) => {
  //   try {
  //     const res = await deletePost(postId);
  //     console.log(`deletePostのres.data${JSON.stringify(res.data)}`);
  //     // レスポンスが成功した場合の処理
  //     setAlertSeverity('success');
  //     setAlertMessage(`${res.data.message}`);
  //     setAlertOpen(true);
  //     // 削除後に特定のページにリダイレクトする場合は以下を利用
  //     setTimeout(() => {
  //       router.push('/users');
  //     }, 2000);
  //   } catch (err: any) {
  //     // エラーが発生した場合の処理
  //     setAlertSeverity('error');
  //     // setAlertMessage('Failed to delete post');
  //     setAlertMessage(`${err.res.data.errors}`);
  //     setAlertOpen(true);
  //   }
  // };

  const handleDeletePost = async (postId: number) => {
    try {
      const res = await deletePost(postId);
      console.log(`deletePostのres.data${JSON.stringify(res.data)}`);
      // 文字列でないとundefinedになる
      if (res.data.status === '200') {
        // レスポンスが成功した場合の処理
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);

        // 削除後に特定のページにリダイレクトする場合は以下を利用
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.log('elseが反応');
        // レスポンスが失敗した場合の処理
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.log('errorが反応');
      // // エラーが発生した場合の処理
      // setAlertSeverity('error');
      // // setAlertMessage('Failed to delete post');
      // setAlertMessage(`${err.message}`);
      // setAlertOpen(true);
      setAlertSeverity('error');
      // ${err.res.data.errors}と、responseがresだとエラーになる。axiosの仕様？
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };

  return { handleDeletePost };
};
