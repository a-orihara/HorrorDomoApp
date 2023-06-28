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

export const createPost = (content: string) => {
  return client.post('/posts', {
    data: {
      post: {
        content: content,
      },
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

export const getPostIndexByUserId = async (page: number, itemsPerPage: number, userId?: number) => {
  return client.get('/posts', {
    params: {
      // APIは1から始まるページ番号を期待しているため、+1を行います
      page: page + 1,
      per_page: itemsPerPage,
      // userIdがundefinedの場合は、最終的にindexのelse部分が実行される。
      user_id: userId,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
    // res:指定したページの指定した表示件数分の、そのidで指定されたユーザーのpostと総post数
  });
};

// 【改良予定】指定したユーザーの投稿一覧を取得する
export const getPostsByUserId = (userId: string) => {
  // 1 paramsオブジェクトを渡す事により、user_idがGETリクエストのURLクエリパラメータに自動的に変換される。
  // = `/posts?user_id=${userId}`;
  return client.get(`/posts`, {
    params: {
      user_id: userId,
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
以前の書き方：client.get(`/posts?user_id=${userId}`
client.get(`/posts?user_id=${userId})とclient.get(`/posts/${id})の違い
/posts?user_id=${userId}:
GETリクエストのURLパラメータとしてuser_idを送信しています。ここで${userId}は特定のユーザーのIDを指します。
/posts/${id}:
URLのパスパラメータとしてidを送信しています。ここで${id}は特定の投稿のIDを指します。このパスは、特定の投稿の詳細
を取得するために使用されます。
------------------------------------------------------------------------------------------------
/posts?user_id=${userId}はRailsの一般的なshowアクションに反応しません。
これは、showアクションは通常、URLのパスパラメータ(/posts/:idのように)を使用して特定のレコードを識別するためです。
一方、/posts?user_id=${userId}はURLのクエリパラメータを使用しています。
------------------------------------------------------------------------------------------------
/posts?user_id=${userId}で、rails側のpostコントローラーのindexアクション内の、if params[:user_id]が反応
する仕組みは、HTTPリクエストが送られるときに、URLに含まれるクエリパラメータがRailsのparamsハッシュに自動的に追加
されるためです。
つまり、user_id=${userId}というクエリパラメータがURLに含まれていると、params[:user_id]でその値を取得すること
ができます。
------------------------------------------------------------------------------------------------
paramsの仕組みは以下の通りです：
paramsは、コントローラへ送られたリクエスト情報を含むハッシュのようなオブジェクトです。
paramsには、URLのパスパラメータ、クエリパラメータ、POSTリクエストの本文など、リクエストに関連するさまざまな情報が
含まれます。
例えば、/users?name=Johnというリクエストがあった場合、params[:name]は"John"という値を返します。
また、/users/1というリクエストがあった場合、params[:id]は"1"という値を返します。
------------------------------------------------------------------------------------------------
1. URLのパスパラメータとクエリパラメータの違いは次の通りです:

- パスパラメータ:
パスパラメータは、URLのパスの一部として渡されるパラメータです。
例えば、`/users/:id`のようなURLパターンでは、`:id`がパスパラメータです。
パスパラメータは、特定のリソース（ここではユーザー）を識別するために使用されます。
パスパラメータは、Railsのルーティングで定義され、コントローラー内で`params[:id]`のようにアクセスされます。

- クエリパラメータ:
クエリパラメータは、URLの末尾に`?`を付けてキーと値のペアで指定されるパラメータです。
例えば、`/users?name=John`のようなURLでは、`name=John`がクエリパラメータです。
クエリパラメータは、特定のリクエストに関連する追加の情報を提供するために使用されます。
クエリパラメータは、Railsのコントローラー内で`params[:name]`のようにアクセスされます。
*/
