import Cookies from 'js-cookie';
import client from './client';

// 1
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

// 2
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
.axiosのgetとpostの引数の数の違いと、その構造についての解説：
- `axios.get(url, [config])` の形式で利用されます。
  - `url`：リクエストするURL
  - `config`：オプションの設定。ヘッダーやパラメータなどを含むオブジェクト
- `axios.post(url, [data], [config])` の形式で利用されます。
  - `url`：リクエストするURL
  - `data`：サーバーへ送るデータのオブジェクト
  - `config`：オプションの設定。ヘッダーやパラメータなどを含むオブジェクト
------------------------------------------------------------------------------------------------
.axiosのgetとpostでパラメーターをバックエンド側に送る場合の方法の違い：
- GETリクエストの場合、パラメータはURLの一部（クエリパラメータ）として送られます。`config`オブジェクトの中の
`params`プロパティにオブジェクト形式で渡します。
  例：`axios.get('/user', { params: { ID: 12345 } });`
- POSTリクエストの場合、パラメータはリクエストボディに含まれます。`data`引数にオブジェクト形式で渡します。
  例：`axios.post('/user', { firstName: 'Fred' });`
------------------------------------------------------------------------------------------------
空オブジェクトについて：
- `client.post`関数は3つの引数を取ることが可能です。第1引数はURL、第2引数はPOSTリクエストのボディデータ、第3引
数はオプションの設定（ヘッダー等）です。
- 最初のコードでは、`headers`を第2引数として渡しています。ですが、ここはPOSTリクエストのボディデータが期待される
箇所です。そのため、第2引数に`headers`を含めると、それがデータとして解釈されます。その結果、ヘッダーが正しく設定さ
れず、期待する動作をしないのです。
*最初のコード
export const createLike = (postId: number) => {
  return client.post(`/posts/${postId}/likes`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
- そのため、ヘッダーを正しく設定するためには、`headers`を第3引数の`config`オブジェクト内に含める必要があります。
第2引数が必要でない場合（つまり、ボディデータを送る必要がない場合）は、その位置に空オブジェクト`{}`を置くことで、
`headers`を第3引数として渡すことができます。これにより、ヘッダーが正しく設定され、期待通りの動作をするようになりま
す。

================================================================================================
2
axiosのdeleteの引数の数と、その構造についての解説：
- `axios.delete(url, [config])` の形式で利用されます。
  - `url`：リクエストするURL
  - `config`：オプションの設定。ヘッダーやパラメータなどを含むオブジェクト
*/
