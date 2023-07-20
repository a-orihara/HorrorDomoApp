import Cookies from 'js-cookie';
import client from './client';

// ユーザーのフォローユーザーの総数を取得するAPI
export const getFollowingCountByUserId = (userId: number | undefined) => {
  // export const getUserFollowingByUserId = (userId: number) => {
  return client.get(`/users/${userId}/following`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロー情報を取得するAPI
export const getFollowingByUserId = async (page: number, itemsPerPage: number, userId: number | undefined) => {
  console.log(`getFollowingByUserIdの${userId}`);
  return client.get(`/users/${userId}/following`, {
    params: {
      page: page + 1,
      per_page: itemsPerPage,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーをフォローするAPI
export const createFollow = (userId: number) => {
  return client.post(`/users/${userId}/following`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロワーの総数を取得するAPI
export const getFollowersCountByUserId = (userId: number | undefined) => {
  return client.get(`/users/${userId}/followers`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロワー情報を取得するAPI
export const getFollowersByUserId = async (page: number, itemsPerPage: number, userId: number | undefined) => {
  // console.log(`getFollowingByUserIdの${userId}`);
  return client.get(`/users/${userId}/followers`, {
    params: {
      page: page + 1,
      per_page: itemsPerPage,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
