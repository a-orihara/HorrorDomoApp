import Cookies from 'js-cookie';
import client from './client';

// export const createLike = (postId: number) => {
//   return client.post(`/posts/${postId}/likes`, {
//     headers: {
//       'access-token': Cookies.get('_access_token'),
//       client: Cookies.get('_client'),
//       uid: Cookies.get('_uid'),
//     },
//   });
// };

export const createLike = (postId: number) => {
  return client.post(
    `/posts/${postId}/likes`,
    {},
    {
      headers: {
        access_token: Cookies.get('_access_token'),
        client: Cookies.get('_client'),
        uid: Cookies.get('_uid'),
      },
    }
  );
};

export const deleteLike = (postId: number) => {
  return client.delete(`/posts/${postId}/likes`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 特定のユーザーが特定のポストを既に「いいね」したかどうかを確認する
export const isAlreadyLiked = (userId: number, postId: number) => {
  return client.get(`/users/${userId}/likes/${postId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 特定のユーザーが行った「いいね」の総数を取得する
export const getTotalLikes = (userId: number) => {
  return client.get(`/users/${userId}/total_likes`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
