import { Post } from '../../types/post';
import PostListItem from '../atoms/PostListItem';

type PostListProps = {
  posts: Post[];
};

const PostList = ({ posts }: PostListProps) => {
  return (
    <ul>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post}></PostListItem>
      ))}
    </ul>
  );
};

export default PostList;
