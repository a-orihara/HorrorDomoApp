// date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
import { format, utcToZonedTime } from 'date-fns-tz';
import Link from 'next/link';
import { Post } from '../../types/post';
import { User } from '../../types/user';

// PostListItemPropsはkey名がpostで値にPost型を持つオブジェクト型;
type PostListItemProps = {
  post: Post;
  user: User;
};

// 1 関数コンポーネントの引数は基本的にオブジェクト型。
const PostListItem = ({ post, user }: PostListItemProps) => {
  // return (
  //   <li key={post.id}>
  //     <p className='text-center text-base md:text-xl'>{post.content}</p>
  //   </li>
  // );

  // 2 date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
  const japanTime = utcToZonedTime(post.createdAt, 'Asia/Tokyo');
  const formattedTime = format(japanTime, 'yyyy/MM/dd HH:mm');
  const truncateContent = post.content.length > 30 ? `${post.content.substring(0, 30)}...` : post.content;

  return (
    <li key={post.id} className='my-px bg-slate-100'>
      <div className='flex'>
        <div className='mx-1'>
          <Link href={`/users/${user.id}`}>
            <a>
              <img src={user.avatarUrl || '/no_image_square.jpg'} alt='user avatar' className='h-12 w-12' />
            </a>
          </Link>
        </div>
        <div>
          <p>
            <Link href={`/users/${user.id}`}>
              <a>{user.name}</a>
            </Link>
          </p>
          <p className='text-center text-sm md:text-xl'>{truncateContent}</p>
          <p>作成日時:{formattedTime}</p>
        </div>
      </div>
    </li>
  );
};

export default PostListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
分割代入を使わない場合は、

const PostListItem = (props: PostListItemProps) => {
  const post = props.post;
  return (
    <li key={post.id}>
      <p className='text-center text-base md:text-xl'>{post.content}</p>
    </li>
  );
};
------------------------------------------------------------------------------------------------
オブジェクトのプロパティを取り出す例、

type PostListItemProps = {
  myName: string;
};

const hello = (name:PostListItemProps) =>{
    const helloName = name.myName
    console.log(`こんにちは${helloName}さん`)
}

*オブジェクトで渡す場合は、引数の型をオブジェクト型にする必要がある。
hello({myName:"Mike"});
================================================================================================
2
utcToZonedTime
与えられたUTCの日時を指定されたタイムゾーンに変換するdate-fns-tzの関数です。
第一引数に変換したいUTCの日時を、第二引数にタイムゾーンを受け取ります。
タイムゾーンはIANAタイムゾーンデータベースの形式（例: 'Asia/Tokyo'）で指定します。
変換された日時はローカルのタイムゾーンに基づいて返されます
------------------------------------------------------------------------------------------------
format
date-fnsの関数であり、日時を指定した形式に整形するために使用されます。
第一引数に整形したい日時を、第二引数に整形のパターンを受け取ります。
パターンは指定した形式に基づいて、年、月、日、時刻などを表現するために使用されます。
*/
