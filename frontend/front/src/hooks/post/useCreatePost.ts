import { useState } from 'react';
import { createPost } from '../../api/post';
import { useAlertContext } from '../../contexts/AlertContext';
import { usePostContext } from '../../contexts/PostContext';
import { CreatePostParams } from '../../types/post';

export const useCreatePost = () => {
  const [content, setContent] = useState('');
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const { handleGetCurrentUserPostList } = usePostContext();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const params: CreatePostParams = {
      content: content,
    };
    try {
      const res = await createPost(params);
      // リソースが新規作成された場合にはHTTPステータスコード'201'を使用するのが一般的。
      if (res.status === 201) {
        // 作成更新後のpostの投稿一覧を取得
        handleGetCurrentUserPostList();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };
  return {
    content,
    setContent,
    handleCreatePost,
  };
};
