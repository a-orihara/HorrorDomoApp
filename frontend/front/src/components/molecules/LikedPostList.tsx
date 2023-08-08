import { Post } from '../../types/post';
import { User } from '../../types/user';
import LikedPostListItem from './ListItem/LikedPostListItem';

type LikedPostListProps = {
  likedPosts: Post[];
  likedUsers: User[];
};

// 指定userIdのlikedPost一覧, likedUser一覧
const LikedPostList = ({ likedPosts, likedUsers }: LikedPostListProps) => {
  // postがnullまたは空の配列の場合は、投稿がないというメッセージを表示
  if (!likedPosts || likedPosts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>いいねした投稿がありません</p>
      </div>
    );
  }
  return (
    <div className='flex-1'>
      <ol>
        {likedPosts.map((likedPost) => {
          // ユーザーを検索
          const likedUser = likedUsers.find((likedUser) => likedUser.id === likedPost.userId);

          // ユーザーが存在すれば投稿を表示
          if (likedUser) {
            return (
              // 指定userIdのlikedPost, likedUser
              <LikedPostListItem key={likedPost.id} likedPost={likedPost} likedUser={likedUser}></LikedPostListItem>
            );
          } else {
            return (
              <div key={likedPost.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
                <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
              </div>
            );
          }
        })}
      </ol>
    </div>
  );
};

export default LikedPostList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
nullと空の配列はJavaScriptでは異なるものとして扱われ、if (!likedPosts)はlikedPostsがnullまたはundefinedの場合にのみ真
となります。一方、空の配列はfalseにはなりません。
if (!likedPosts || likedPosts.length === 0)という条件を追加し、空の配列の場合も真となるようにしています。
================================================================================================
2
この?.オプショナルチェインニングは、
likedPostsがundefinedまたはnullの場合には次の.mapを評価せず、直接undefinedを返します。
それにより、期待されないエラーを防ぐことができます。
*/
