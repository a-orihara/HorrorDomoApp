import Cookies from 'js-cookie';
import { client } from './client';

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

// 2 ユーザーをフォローするAPI
export const createFollow = (otherUserId: number) => {
  return client.post(
    `/relationships`,
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

// ユーザーをフォロー解除するAPI
export const deleteFollow = (otherUserId: number) => {
  return client.delete(`/relationships/${otherUserId}`, {
    params: {
      other_id: otherUserId,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 1 ユーザーが特定のユーザーをフォローしているか確認するAPI
export const isFollowing = (userId: number, otherUserId: number) => {
  return client.get(`/users/${userId}/is_following`, {
    params: {
      other_id: otherUserId,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロワーの総数を取得するAPI。rails側でgetFollowersByUserIdと同じ関数を発火させている
export const getFollowersCountByUserId = (userId: number | undefined) => {
  return client.get(`/users/${userId}/followers`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーのフォロワー情報を取得するAPI。rails側でgetFollowersCountByUserIdと同じ関数を発火させている
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
Axiosのgetメソッドについて:
- Axiosのgetメソッドは、最大で2つの引数を受け取ります。
- 最初の引数はリクエストのURLです。この例では`/users/${userId}/is_following`となります。
- 二つ目の引数は設定オブジェクトで、リクエストに必要なパラメータやヘッダー情報を含めることができます。
- `params`フィールドにはURLのクエリパラメータをオブジェクトとして指定します。この例では`other_id: otherUserId`
と指定しています。
- `headers`フィールドにはHTTPヘッダーをオブジェクトとして指定します。この例では認証に必要な情報を含めています。
------------------------------------------------------------------------------------------------
Axiosのgetメソッドとpostメソッドの違いについて:
- getメソッドは通常、サーバからデータを取得するために使用され、データはURLのクエリパラメータとして渡されます。リク
エストボディを持つことは一般的ではありません。
- postメソッドはサーバーにデータを送信するために使用されます。データは通常、リクエストボディに含めて送信されます。
- getメソッドの設定オブジェクトには、paramsフィールドを使用してクエリパラメータを指定しますが、postメソッドでは2
つ目の引数が直接リクエストボディとなります。そのため、以下のような形式でデータを渡します
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
------------------------------------------------------------------------------------------------
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

================================================================================================
2
Axiosのpostメソッド
URL**：
- client.post`の最初の引数は、リクエストを送信するURL文字列である。
- 2番目の引数はリクエストボディとして送信するデータです。ここでは、単一のプロパティ `other_id` を持つオブジェクト
を送信します。other_id`の値は変数 `otherUserId` に設定され、関数 `createFollow` に渡される。
- 3番目の引数はリクエストの設定オブジェクトである。このオブジェクトには、リクエストに設定したい追加の設定やヘッダー
が含まれます。
*/
