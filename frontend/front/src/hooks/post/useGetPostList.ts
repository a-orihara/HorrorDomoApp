// frontend/front/src/hooks/post/useGetPostList.ts
import { useEffect, useState } from 'react';
import { getPostList } from '../../api/post';
import { Post } from '../../types/post';

const useGetPostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostList();
        if (data.data.status == 200) {
          setPosts(data.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return { posts };
};

export default useGetPostList;
