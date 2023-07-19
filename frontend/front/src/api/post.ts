import Cookies from 'js-cookie';
import { CreatePostParams } from '../types/post';
import client from './client';

// 2
export const createPost = (params: CreatePostParams) => {
  return client.post(
    '/posts',
    // 第二引数はリクエストのbody部分
    { post: params },
    // 第三引数にヘッダ情報を指定
    {
      headers: {
        'access-token': Cookies.get('_access_token'),
        client: Cookies.get('_client'),
        uid: Cookies.get('_uid'),
      },
    }
  );
};

export const deletePost = (postId: number) => {
  return client.delete(`/posts/${postId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// サインイン中のユーザーの投稿一覧を取得する
export const getCurrentUserPostList = () => {
  return client.get('/posts', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 指定したuserIdのpostの詳細を取得する関数/#show
export const getPostDetailByUserId = async (postId: number) => {
  return client.get(`/posts/${postId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 3 指定userIdのpostの総数と、指定したページの1ページ当たりの表示件数分のpostを取得
// userIdがなければカレントユーザーの投稿総数と、指定したページの1ページ当たりの表示件数分のpostを取得
export const getPostListByUserId = async (page: number, itemsPerPage: number, userId?: number) => {
  return client.get('/posts', {
    params: {
      // 表示したいページ番号を送信。APIは1から始まるページ番号を期待しているため、+1を行います
      page: page + 1,
      // 1ページ当たりの表示件数
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
// export const getPostsByUserId = (userId: string) => {
//   // 1 paramsオブジェクトを渡す事により、user_idがGETリクエストのURLクエリパラメータに自動的に変換される。
//   // = `/posts?user_id=${userId}`;
//   return client.get(`/posts`, {
//     params: {
//       user_id: userId,
//     },
//     headers: {
//       'access-token': Cookies.get('_access_token'),
//       client: Cookies.get('_client'),
//       uid: Cookies.get('_uid'),
//     },
//   });
// };

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
================================================================================================
2
axiosのpostメソッドは通常、以下の3つの引数を取ります。
第一引数: URL（エンドポイント）
第二引数: リクエストボディ（送信するデータ）
第三引数: 設定（ヘッダーやタイムアウトなど）
------------------------------------------------------------------------------------------------
axios.post(url, data, config)
url: リクエストを送信するサーバーのURL（エンドポイント）を指定します。
data: サーバーに送信するデータを指定します。ここにはオブジェクトや文字列を指定することが可能です。
config: リクエストの設定を指定します。例えば、ヘッダー情報やタイムアウトなどを指定します。
------------------------------------------------------------------------------------------------
失敗例

export const createPost = (params: CreatePostParams) => {
  return client.post('/posts', {
    post: params,
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  }
  );
};
------------------------------------------------------------------------------------------------
初めに試したコードでは、第二引数（リクエストボディ）に'params'（送信データ）と'headers'（ヘッダー情報）の両方を
設定していました。これは誤りで、リクエストボディ部分にヘッダー情報を含めると、サーバー側はそれをデータとして解釈し、
結果として正常な認証情報を受け取れないためエラーが発生しました。
修正後のコードでは、'post'と'params'（送信データ）を第二引数に設定し、'headers'（ヘッダー情報）を第三引数に設定
することで、リクエストボディとヘッダー情報を適切に送信でき、正常にリクエストが処理されました。
------------------------------------------------------------------------------------------------
コントローラは post キーの下に content キーが存在することを期待しているため、{ post: params },つまり、
{ post: {content: "内容" } },になる。

1. 通常、Railsのコントローラはリクエストパラメータとして、特定のリソース（この場合は 'post'）の名前のキーの下に、
そのリソースの属性を表すキー（この場合は 'content'）を持つハッシュを期待します。これはストロングパラメータという
機能の一部であり、意図しないデータがデータベースに保存されることを防ぐためのものです。

2. Railsのコントローラは、'params' メソッドを通じてクライアントから送られてきたデータにアクセスします。コントロ
ーラのアクション内で 'params[:post]' というコードを書いた場合、その値はクライアントが送信したデータ内の 'post'
キーに対応する値になります。

3. ストロングパラメータは、createやupdateなどのアクションで使用する属性をホワイトリストに追加することで、意図し
ない属性が更新されることを防ぎます。例えば、'params.require(:post).permit(:content)' のように記述すること
で、'post' リソースの 'content' 属性のみが許可され、それ以外のパラメータは拒否されます。

4. したがって、フロントエンドから送信するリクエストデータは、Railsのストロングパラメータの要件を満たす形にする必
要があります。上記のコードでは、クライアントが送信するデータの形式を 'post' キーの下に 'content' キーが存在す
る形に修正することで、Railsのコントローラが期待するデータ形式を満たし、リクエストが成功するようになりました。

参考
def post_params
  params.require(:post).permit(:content)
end

================================================================================================
3
getPostListByUserId の引数 (page: number, itemsPerPage: number, userId?: number) については、
page: number : handlePageChange 関数から提供され、それは ReactPaginate からのページ番号（0から始まる）。
itemsPerPage: number : usePostsPagination フックから提供され、その値は ProfilePage コンポーネントで指定さ
れた 5。
------------------------------------------------------------------------------------------------
page: 現在のページ番号を表します。この値に基づいて表示する投稿の範囲が決定されます。
itemsPerPage: 1ページあたりに表示する投稿の数を指定します。この値に基づいて表示する投稿の数が決定されます。
userId: 取得したいユーザーの投稿を指定するためのIDです。この引数が指定されない場合、ログインしているユーザー自身の
投稿が取得されます。
------------------------------------------------------------------------------------------------
paramsオブジェクトは、APIリクエスト時にサーバーに送るデータを格納します。indexアクションでこれらの値が利用されま
す。
pageとper_pageは、indexアクション内でそれぞれ現在のページ番号、1ページ当たりの表示数として使われ、これらにより取
得する投稿の範囲が決定されます。
user_idは、indexアクション内で投稿を取得するユーザーを決定します。指定されたuser_idが存在する場合はそのユーザー
の投稿を、存在しない場合はログインユーザーの投稿を取得します。
*/
