import Cookies from 'js-cookie';
import client from './client';

// ユーザーのフォロー情報を取得するAPI
export const getUserFollowingByUserId = (userId: number | undefined) => {
  // export const getUserFollowingByUserId = (userId: number) => {
  return client.get(`/users/${userId}/following`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロワー情報を取得するAPI
export const getUserFollowersByUserId = (userId: number | undefined) => {
  return client.get(`/users/${userId}/followers`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
