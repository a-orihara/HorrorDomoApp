import Cookies from 'js-cookie';
import client from './client';

export const createLike = (postId: number) => {
  return client.post(`/posts/${postId}/likes`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
