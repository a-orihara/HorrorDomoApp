import Cookies from 'js-cookie';
import client from './client';

export const getMicropostList = () => {
  return client.get('/microposts', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
