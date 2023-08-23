import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import PostListItem from '../../molecules/listItem/PostListItem';

type PostListProps = {
  posts: Post[] | null;
  user: User;
};

const PostList = ({ posts, user }: PostListProps) => {
  // postがnullまたは空の配列の場合は、投稿がないというメッセージを表示
  if (posts === null) {
    // postsがnullならローディング表示
    return <div>Loading...</div>;
  }
  // if (!posts || posts.length === 0) {
  if (posts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿がありません</p>
      </div>
    );
  }
  return (
    <div className='flex-1'>
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
