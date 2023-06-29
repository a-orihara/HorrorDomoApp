import React from 'react';
import { useCreatePost } from '../../hooks/post/useCreatePost';
import Button from '../atoms/Button';
import TextArea from '../atoms/TextArea';

const PostForm: React.FC = () => {
  const { content, setContent, handleCreatePost } = useCreatePost();

  return (
    <form onSubmit={handleCreatePost}>
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='何を思っている？'
        maxLength={140}
      />
      <Button type='submit'>投稿</Button>
    </form>
  );
};

export default PostForm;
