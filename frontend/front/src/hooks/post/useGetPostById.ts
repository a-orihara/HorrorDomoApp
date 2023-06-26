import { useCallback, useState } from 'react';
import { getPostById } from '../../api/post';
import { Post } from '../../types/post';

// frontend/front/src/hooks/post/useGetPostsByUserId.ts
export const useGetPostById = (id: string | string[] | undefined) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  // const { handleGetPostList } = usePostContext();

  const handleGetPostById = useCallback(async () => {
    if (!id) return;
    console.log('getPostsByUserId is called');
    try {
      const res = await getPostById(id as string);
      const fetchedPosts: Post[] | null = res.data.data;
      // 仮定していますが、handleGetPostListが完了したら全てのポストが利用可能になり、
      // ここでuserIdに紐づくポストをフィルタリングすることができます
      // const filteredPosts = posts.filter((post) => post.userId === userId);
      console.log(`fetchedPostsのpost${JSON.stringify(fetchedPosts)}`);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  }, [id]);

  return { posts, handleGetPostById };
};
