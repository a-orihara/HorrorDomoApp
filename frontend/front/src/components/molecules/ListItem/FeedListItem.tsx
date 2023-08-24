// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import { useAuthContext } from '../../../contexts/AuthContext';
import useFormattedTime from '../../../hooks/helpers/useFormattedTime';
import { useDeletePost } from '../../../hooks/post/useDeletePost';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import UserAvatar from '../../atoms/UserAvatar';
import UserAndPostLinks from '../frontend/front/src/components/molecules/UserAndPostLinks';
import CommonListItem from './CommonListItem';

// FeedListItemPropsはkey名がfeedPostで値にPost型を持つオブジェクト型;
type FeedListItemProps = {
  feedPost: Post;
  feedUser: User;
};

// 1 関数コンポーネントの引数は基本的にオブジェクト型。
const FeedListItem = ({ feedPost, feedUser }: FeedListItemProps) => {
  // feedPostの作成日時を形成するカスタムフック
  const feedPostCreatedTime = useFormattedTime(feedPost.createdAt);
  // feedPostの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent = feedPost.content.length > 30 ? `${feedPost.content.substring(0, 30)}...` : feedPost.content;
  // ログインユーザーと投稿者のidが一致する場合は、投稿を削除するボタンを表示
  const { currentUser } = useAuthContext();
  // // 現在のユーザーが未定義かどうかを確認
  // const userId = currentUser?.id;
  const { handleDeletePost } = useDeletePost();
  // console.log(`feedPost:の${feedPost.liked}`);
  // console.log(`feedListItemのpost:${JSON.stringify(feedPost)}`);

  return (
    <li key={feedPost.id} className='my-px rounded-md bg-basic-beige'>
      <div className='flex flex-row'>
        <UserAvatar avatarUrl={feedUser.avatarUrl} userId={feedUser.id}></UserAvatar>
        <div>
          <UserAndPostLinks user={feedUser} post={feedPost}></UserAndPostLinks>
          {/* 2 */}
          <CommonListItem // CommonListItemコンポーネントを使用
            post={feedPost}
            user={feedUser}
            currentUser={currentUser}
            handleDeletePost={handleDeletePost}
          />
        </div>
      </div>
    </li>
  );
};

export default FeedListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
分割代入を使わない場合は、

const FeedListItem = (props: FeedListItemProps) => {
  const feedPost = props.feedPost;
  return (
    <li key={feedPost.id}>
      <p className='text-center text-base md:text-xl'>{feedPost.content}</p>
    </li>
  );
};
------------------------------------------------------------------------------------------------
オブジェクトのプロパティを取り出す例、

type FeedListItemProps = {
  myName: string;
};

const hello = (name:FeedListItemProps) =>{
    const helloName = name.myName
    console.log(`こんにちは${helloName}さん`)
}

*オブジェクトで渡す場合は、引数の型をオブジェクト型にする必要がある。
hello({myName:"Mike"});

================================================================================================

*/
