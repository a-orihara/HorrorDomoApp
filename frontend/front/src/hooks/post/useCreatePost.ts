import { useRouter } from 'next/router';
import { useState } from 'react';
import { createPost } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';
import { usePostContext } from '../../contexts/PostContext';
import { CreatePostParams } from '../../types/post';
import { AxiosError } from 'axios';

export const useCreatePost = () => {
  const [content, setContent] = useState('');
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  // 投稿後に投稿数を更新する為に必要
  const { handleGetCurrentUserPostsCount } = usePostContext();
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    // paramsオブジェクトを作成
    const params: CreatePostParams = {
      content: content,
      title: title,
    };
    try {
      const res = await createPost(params);
      // リソースが新規作成された場合にはHTTPステータスコード'201'を使用するのが一般的。
      if (res.status === 201) {
        // 作成更新後のpostの投稿総数を取得。
        handleGetCurrentUserPostsCount();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push(`/`);
        }, 1000);
      } else {
        setAlertSeverity('error');
        setAlertMessage("投稿に失敗しました");
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.log("catch作動")
      // デフォルトメッセージを設定し、これをAxiosに関連しない、その他のエラーの際に表示
      let errorMessage = '予期しないエラーが発生しました';
      // Axiosエラーかチェック
      if (err instanceof AxiosError) {
        // resと省略するとresposeオブジェクトが拾えずにエラーになる
        if (err.response) {
          // err.response.data.errorsはバックエンドで処理されて初めから文字列になっている
          errorMessage = err.response.data.message + ": " + (err.response.data.errors || '不明なエラーが発生しました');
        }else {
        // Axiosのレスポンスがない、JavaScript他のエラーの場合のメッセージ
        setAlertMessage('サーバーへの接続に失敗しました');
        }
      }
      setAlertSeverity('error');
      setAlertMessage(errorMessage);
      setAlertOpen(true);
    }
  };
  return {
    title,
    setTitle,
    content,
    setContent,
    handleCreatePost,
  };
};
/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
