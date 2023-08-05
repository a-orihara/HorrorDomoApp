import { useToggleLike } from '../../hooks/like/useToggleLike';

type LikeButtonIconProps = {
  postId: number;
  liked: boolean;
  // userId: number;
};

// postIdを使ってpostを指定、 likedでpostの現在のいいねの真偽値を取得
// export const LikeButtonIcon = ({ postId, liked, userId }: LikeButtonIconProps) => {
// 指定userIdのlikedPostのidとliked（真偽値）
export const LikeButtonIcon = ({ postId, liked }: LikeButtonIconProps) => {
  // useToggleLikeは、いいねの作成と削除、いいね総数の更新を処理する。
  // const { isLiked, handleToggleLike } = useToggleLike(liked, postId, userId);
  // useToggleLikeは、いいねの作成と削除、いいね総数の更新を処理する。
  // 指定userIdのlikedPostのidとliked（真偽値）
  const { isLiked, handleToggleLike } = useToggleLike(postId, liked);
  console.log(`LikeButtonIconのisLikedは: ${isLiked}`);

  return (
    <button onClick={() => handleToggleLike()}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        // isLiked（真偽値）の結果で色が変わる
        fill={isLiked ? '#F22C5A' : 'none'}
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 w-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
        />
      </svg>
    </button>
  );
};

// type LikeButtonIconProps = {
//   postId: number;
//   liked: boolean;
//   // userId: number;
// };

// postIdを使ってpostを指定、 likedでpostの現在のいいねの真偽値を取得
// export const LikeButtonIcon = ({ postId, liked, userId }: LikeButtonIconProps) => {
// 指定userIdのlikedPostのidとliked（真偽値）
// export const LikeButtonIcon = ({ postId, liked }: LikeButtonIconProps) => {
//   // useToggleLikeは、いいねの作成と削除、いいね総数の更新を処理する。
//   // const { isLiked, handleToggleLike } = useToggleLike(liked, postId, userId);
//   // useToggleLikeは、いいねの作成と削除、いいね総数の更新を処理する。
//   // 指定userIdのlikedPostのidとliked（真偽値）
//   const { isLiked, handleToggleLike } = useToggleLike(postId, liked);
//   console.log(`LikeButtonIconのisLikedは: ${isLiked}`);

//   return (
//     <button onClick={() => handleToggleLike()}>
//       <svg
//         xmlns='http://www.w3.org/2000/svg'
//         // isLiked（真偽値）の結果で色が変わる
//         fill={isLiked ? '#F22C5A' : 'none'}
//         viewBox='0 0 24 24'
//         strokeWidth={1.5}
//         stroke='currentColor'
//         className='h-6 w-6'
//       >
//         <path
//           strokeLinecap='round'
//           strokeLinejoin='round'
//           d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
//         />
//       </svg>
//     </button>
//   );
// };

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
SVGアイコンの色を変えるためには、アイコンがクリックされたことを検知し、その状態に応じてSVGの`fill`属性の値を変える
必要があります。このためには、通常、Reactの`useState`フックと`onClick`イベントハンドラが使われます。また、SVGア
イコンの`fill`属性を`{isLiked ? "pink" : "none"}`のように設定します。`isLiked`が真（つまりアイコンが「いいね
」されている状態）の場合、`fill`属性は`"pink"`になります。
*/
