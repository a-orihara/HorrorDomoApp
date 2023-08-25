import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import LikedPostListItem from '../../molecules/listItem/LikedPostListItem';
import CommonPostList from './CommonPostList';

type LikedPostListProps = {
  likedPosts: Post[];
  likedUsers: User[];
};

const LikedPostList = ({ likedPosts, likedUsers }: LikedPostListProps) => {
  return (
    // 詳細な説明はFeedList.tsxを参照
    <CommonPostList
      posts={likedPosts}
      users={likedUsers}
      // 無名関数を渡す
      ListItemComponent={({ post, user }) => <LikedPostListItem likedPost={post} likedUser={user} />}
      noPostsMessage='いいねした投稿がありません'
    />
  );
};

// // 指定userIdのlikedPost一覧, likedUser一覧
// const LikedPostList = ({ likedPosts, likedUsers }: LikedPostListProps) => {
//   // postがnullまたは空の配列の場合は、投稿がないというメッセージを表示
//   if (!likedPosts || likedPosts.length === 0) {
//     return (
//       <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
//         <p className='border-b-2 border-slate-200 text-base md:text-xl'>いいねした投稿がありません</p>
//       </div>
//     );
//   }
//   return (
//     <div className='flex-1'>
//       <ol>
//         {likedPosts.map((likedPost) => {
//           // ユーザーを検索
//           const likedUser = likedUsers.find((likedUser) => likedUser.id === likedPost.userId);

//           // ユーザーが存在すれば投稿を表示
//           if (likedUser) {
//             return (
//               // 指定userIdのlikedPost, likedUser
//               <LikedPostListItem key={likedPost.id} likedPost={likedPost} likedUser={likedUser}></LikedPostListItem>
//             );
//           } else {
//             return (
//               <div key={likedPost.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
//                 <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
//               </div>
//             );
//           }
//         })}
//       </ol>
//     </div>
//   );
// };

export default LikedPostList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
