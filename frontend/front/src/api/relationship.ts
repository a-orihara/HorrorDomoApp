import Cookies from 'js-cookie';
import client from './client';

export const getUserFollowingByUserId = (userId: string) => {
  return client.get(`/users/${userId}/following`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
