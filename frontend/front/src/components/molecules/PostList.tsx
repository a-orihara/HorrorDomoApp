import { Post } from '../../types/post';
import PostListItem from '../atoms/PostListItem';

const post: Post = {
  id: 1,
  content: 'test',
  user_id: 1,
  created_at: '2021-10-01T00:00:00.000000Z',
  updated_at: '2021-10-01T00:00:00.000000Z',
};

// const handleGetPostList = async () => {
//   try {
//     const data = await getPostList();
//     console.log(`getポスト:${JSON.stringify(data.data)}}`);
//     if (data.status == 200) {
//       const post = data.data;
//       return post;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// const post = handleGetPostList();

const PostList = () => {
  return <PostListItem post={post}></PostListItem>;
};

export default PostList;
