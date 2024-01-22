import Cookies from 'js-cookie';
import { CreatePostParams } from '../types/post';
import { client } from './client';

// 2.1
export const createPost = (params: CreatePostParams) => {
  return client.post(
    '/posts',
    // 2.2 第二引数はリクエストのbody部分。キーpost、値がparamsオブジェクト
    { post: params },
    // 第三引数にヘッダ情報を指定
    {
      headers: {
        'access-token': Cookies.get('_access_token'),
        'client': Cookies.get('_client'),
        'uid': Cookies.get('_uid'),
      },
    }
  );
};

export const deletePost = (postId: number) => {
  return client.delete(`/posts/${postId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
    },
  });
};

// CurrentUserの投稿総数を取得する
export const getCurrentUserPostsCount = () => {
  // PostsControllerのindexへget
  return client.get('/posts', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
    },
  });
};

// 指定userIdのpostの詳細を取得する関数/#show
export const getPostDetailByUserId = async (postId: number) => {
  return client.get(`/posts/${postId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
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

export const getPostLikesCountByPostId = async (postId: number) => {
  console.log('getPostLikesCountByPostIdが呼ばれた');
  return client.get(`/posts/${postId}/likes_count`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
    // res:指定したページの指定した表示件数分の、そのidで指定されたユーザーのpostと総post数
  });
};

type SearchParams = {
  page: number;
  itemsPerPage: number;
  query: string;
};
// 4 axios.get メソッドは最大で2つの引数までしか受け取りません。第1引数はURL、第2引数はオプション（ヘッダー、パラメーターなど）です。
export const getSearchedPosts = (params: SearchParams) => {
  return client.get('/posts/search', {
    params: {
      page: params.page + 1,
      per_page: params.itemsPerPage,
      query: params.query,
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

================================================================================================
2.1
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
修正後のコードでは、'post':'params'（送信データ）を第二引数に設定し、'headers'（ヘッダー情報）を第三引数に設定
することで、リクエストボディとヘッダー情報を適切に送信でき、正常にリクエストが処理されました。
------------------------------------------------------------------------------------------------
コントローラは post キーの下に content キーが存在することを期待しているため、{ post: params },つまり、
{ post: {content: "内容" } },になる。
*オブジェクト型
CreatePostParams = {
  title: string;
  content: string;
};
------------------------------------------------------------------------------------------------
. 通常、Railsのコントローラはリクエストパラメータとして、特定のリソース（この場合は 'post'）の名前のキーの下に、
そのリソースの属性を表すキー（この場合は 'content'）を持つハッシュを期待します。これはストロングパラメータという
機能の一部であり、意図しないデータがデータベースに保存されることを防ぐためのものです。
. Railsのコントローラは、'params' メソッドを通じてクライアントから送られてきたデータにアクセスします。コントロ
ーラのアクション内で 'params[:post]' というコードを書いた場合、その値はクライアントが送信したデータ内の 'post'
キーに対応する値になります。
. ストロングパラメータは、createやupdateなどのアクションで使用する属性をホワイトリストに追加することで、意図し
ない属性が更新されることを防ぎます。例えば、'params.require(:post).permit(:content)' のように記述すること
で、'post' リソースの 'content' 属性のみが許可され、それ以外のパラメータは拒否されます。
. したがって、フロントエンドから送信するリクエストデータは、Railsのストロングパラメータの要件を満たす形にする必
要があります。上記のコードでは、クライアントが送信するデータの形式を 'post' キーの下に 'content' キーが存在す
る形に修正することで、Railsのコントローラが期待するデータ形式を満たし、リクエストが成功するようになりました。
参考
def post_params
  params.require(:post).permit(:content)
end

================================================================================================
2.2
- Rails単体の場合、フォームデータを処理するときのRailsのデフォルトの動作は、Railsで従来のHTMLフォームが送信され
ると、viewのフォームフィールドの入力データは自動的に`params`ハッシュにカプセル化されます。これはRailsがのフォー
ムから送信されたデータを処理する標準的な方法です。
- Next.jsとRailsを持つAPIのコンテキストでは、Rails APIに送信されたデータは自動的に`params`にラップされません。
その代わり、Railsはフロントから送信されたデータをそのまま受け取ります。フロントが `{ post: params }` という構
造でデータを送信した場合、Rails はこの構造を直接受け取り、さらに `params` でラップすることはありません。このよう
なAPIシナリオでは、Railsはクライアントから送信されたJSONデータを受け取ります。従来のフォーム送信で発生する自動カ
プセル化は行われません。
------------------------------------------------------------------------------------------------
- Next.jsとRailsを持つAPIのコンテキストでも、Railsはフロントから送信されたデータを取得する際、`params`にアク
セスする。これは、コントローラがリクエストで送信されたデータを取得する方法のことです。
- Railsコントローラにおいて、`params`はリクエストで送信されたすべてのデータを保持する特別なオブジェクトです。これ
は、フォームデータやクエリパラメータ、APIリクエストで送信されたJSONデータなどです。
- この`create` アクションの場合、 railsのPostsControllerで`post_params` を呼び出すと、 `params` のうち
`:post` キーを含む部分を取得します。これはNext.jsから送信された `{ post: params }` という構造のデータです。
------------------------------------------------------------------------------------------------
まとめると、Railsコントローラの `params` オブジェクトはリクエストで送信されたすべてのデータにアクセスするための
もので、その内容はリクエストの方法 (従来のフォーム送信 vs. APIコール) によって異なります。APIのコンテキストでは、
`params` はフロントから送信されたデータの構造を直接反映します。

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

================================================================================================
4
`searchPosts`
. `client.get` (axios.get)メソッドは最大で2つの引数を受け取ります。第1引数はリクエストを送るURL、第2引数はオ
プション（ヘッダー、パラメーターなど）です。
------------------------------------------------------------------------------------------------
1. `searchPosts`の引数`params` がオブジェクト型の理由**:
- 拡張性: 現在は`query`のみを検索パラメータとして送りますが、将来的に複数のパラメータ（例：ページ番号、ソートオプ
ションなど）が必要になるかもしれません。オブジェクトを使用すると、後で簡単に新しいプロパティを追加できます。
- 可読性: オブジェクト型を使うことで、どのパラメータが何を意味するのかが明確になり、コードの可読性が向上します。
- TypeScriptの型安全性: `SearchParams` 型で明示的に型を定義しているので、間違った型のデータが渡されるとコンパ
イルエラーが発生します。
------------------------------------------------------------------------------------------------
引数をstring型のqueryに書き換える:

export const searchPosts = (query: string) => {
  return client.get('/posts/search', {
    params: { query: query },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
------------------------------------------------------------------------------------------------
. **第1引数 `/posts/search`**:
この部分はAPIエンドポイントを指定します。`/posts/search`というURLにGETリクエストを送信することで、記事の検索が
行われます。
------------------------------------------------------------------------------------------------
. **第2引数 オプション**:
- **`params: { query: params.query }`**: `params` オプションで、検索クエリをサーバに送ります。
`params.query`は、前の部分のコードで設定された`SearchParams`型のオブジェクトから取得されます。
- axios.getの第二引数で`params`プロパティを使うことで、URLのクエリパラメータを設定できます。そのため、この形式
に合わせて`params`をオブジェクト型にしています。
- axios.getでクエリパラメータを送る場合、この形式が一般的ですが、必ずしもこの形式でなければならないわけではありま
せん。たとえば、URLを直接操作してクエリパラメータを組み込む方法もあります。
------------------------------------------------------------------------------------------------
URLを直接操作してクエリパラメータを組み込む方法

client.get(`/posts/search?query=${query}`, {
  headers: {
    'access-token': Cookies.get('_access_token'),
    client: Cookies.get('_client'),
    uid: Cookies.get('_uid'),
  },
});
------------------------------------------------------------------------------------------------
- **`headers`**: ここで各種HTTPヘッダーを設定しています。
*/
