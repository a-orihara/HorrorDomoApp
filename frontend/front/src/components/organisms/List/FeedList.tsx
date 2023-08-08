// frontend/front/src/components/molecules/FeedList.tsx
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import FeedListItem from '../../atoms/FeedListItem';

type FeedListProps = {
  feedPosts: Post[];
  feedUsers: User[];
};
const FeedList = ({ feedPosts, feedUsers }: FeedListProps) => {
  // 1
  if (!feedPosts || feedPosts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿がありません</p>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <ol>
        {feedPosts?.map((feedPost) => {
          // 2
          const feedUser = feedUsers.find((feedUser) => feedUser.id === feedPost.userId);
          // 3
          if (feedUser) {
            return <FeedListItem key={feedPost.id} feedPost={feedPost} feedUser={feedUser}></FeedListItem>;
          } else {
            return (
              <div key={feedPost.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
                <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
              </div>
            );
          }
          // return <FeedListItem key={feedPost.id} post={feedPost} user={user}></FeedListItem>;
        })}
      </ol>
    </div>
  );
};

export default FeedList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Reactコンポーネントは、最初に一致したreturn文でレンダリング内容が決まります。一つのコンポーネント関数の中で複数の
return文がある場合、最初に一致したreturn文が実行され、それ以降のコードは無視されます。

================================================================================================
2
userの型がUser | undefinedになる理由
Array.prototype.findメソッドは、与えられたテスト関数を満たす最初の要素の値を返します。もし該当する要素が見つか
らなかった場合はundefinedを返します。そのため、TypeScriptはfindメソッドの結果をUser | undefinedと推論します。

================================================================================================
3
userがundefinedではないことを確認してからFeedListItemに渡すことで、FeedListItemの引数userはUser型になる。
*/
