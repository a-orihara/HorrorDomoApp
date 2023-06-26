import { Post } from '../../types/post';
import PostListItem from '../atoms/PostListItem';

type PostListProps = {
  posts: Post[] | null;
};

const PostList = ({ posts }: PostListProps) => {
  return (
    <ul>
      {/* 1 オプショナルチェインニング */}
      {posts?.map((post) => (
        <PostListItem key={post.id} post={post}></PostListItem>
      ))}
    </ul>
  );
};

export default PostList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
この?.オプショナルチェインニングは、
postsがundefinedまたはnullの場合には次の.mapを評価せず、直接undefinedを返します。
それにより、期待されないエラーを防ぐことができます。
*/
