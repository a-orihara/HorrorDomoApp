import { Post } from '../../types/post';

type PostListItemProps = {
  post: Post;
};

const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <li key={post.id}>
      <p className='text-center text-base hover:text-basic-pink md:text-xl'>{post.content}</p>
    </li>
  );
};

export default PostListItem;
