import Cookies from 'js-cookie';
import client from './client';

export const getPostList = () => {
  return client.get('/posts', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

export const getPostById = (id: string) => {
  return client.get(`/posts/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
