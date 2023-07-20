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

// 1 ユーザーが特定のユーザーをフォローしているか確認するAPI
export const isFollowing = (userId: number, otherUserId: number) => {
  return client.post(
    `/users/${userId}/is_following`,
    {
      other_id: otherUserId,
    },
    {
      headers: {
        'access-token': Cookies.get('_access_token'),
        client: Cookies.get('_client'),
        uid: Cookies.get('_uid'),
      },
    }
  );
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
APIリクエストのbodyに含めるとは、HTTPリクエストを送信する際に、ヘッダー以外の部分に情報を添付することを指します。
ここでの情報は主にサーバー側で処理するためのデータで、JSON形式などで送られます。Axiosを使ってリクエストを送信する
際には、通常`axios.post(url, data, config)`という形式で関数を呼び出します。ここで`data`がリクエストのbodyに
該当します。
つまり、今回の`other_id: otherUserId`はAPIリクエストのbody部分に含まれるデータで、サーバー側で
`params[:other_id]`として取り出されます。
------------------------------------------------------------------------------------------------
Axiosのpostメソッドの第三引数のconfig部分には、リクエストに関する設定をオブジェクト形式で渡します。
このconfigオブジェクトのheadersプロパティには、HTTPリクエストヘッダに追加したい情報を指定します。
headerの部分は、認証情報をHTTPヘッダとして送信するための設定です。これによりサーバ側で認証を行い、リクエストを正し
く処理することができます。
*/
