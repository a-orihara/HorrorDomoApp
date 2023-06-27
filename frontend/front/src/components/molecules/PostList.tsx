import { Post } from '../../types/post';
import { User } from '../../types/user';
import PostListItem from '../atoms/PostListItem';

type PostListProps = {
  posts: Post[] | null;
  user: User;
};

const PostList = ({ posts, user }: PostListProps) => {
  // postがnullまたは空の配列の場合は、投稿がないというメッセージを表示
  if (!posts || posts.length === 0) {
    return (
      <div>
        <h1>投稿がありません</h1>
      </div>
    );
  }
  return (
    <div className='flex-1'>
      <h1 className='pl-1 font-spacemono text-lg md:text-3xl'>投稿データ</h1>
      <ol>
        {/* 1 オプショナルチェインニング */}
        {posts?.map((post) => (
          <PostListItem key={post.id} post={post} user={user}></PostListItem>
        ))}
      </ol>
    </div>
  );
};

export default PostList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
nullと空の配列はJavaScriptでは異なるものとして扱われ、if (!posts)はpostsがnullまたはundefinedの場合にのみ真
となります。一方、空の配列はfalseにはなりません。
if (!posts || posts.length === 0)という条件を追加し、空の配列の場合も真となるようにしています。
================================================================================================
2
この?.オプショナルチェインニングは、
postsがundefinedまたはnullの場合には次の.mapを評価せず、直接undefinedを返します。
それにより、期待されないエラーを防ぐことができます。
*/
