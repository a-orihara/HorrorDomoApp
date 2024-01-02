class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController

  # 1
  def destroy
    logger.info "destroyが発火:DeviseTokenAuth::SessionsController"
    super
  end

  # 2
  protected

    # 3.1 サインイン成功時に許可するパラメーターを設定
    def render_create_success
      # 3.2
      render json: {
        # successプロパティで真偽値を返す
        success: true,
        # messageプロパティでdeviseが用意したメッセージを返す
        message: I18n.t('devise.sessions.signed_in'),
        # 3.3 サインインユーザーの情報
        data: resource_data(resource_json: @resource.token_validation_response)
        # 3.4 "status": 200と同じ意味
      }, status: :ok
    end

    # 5.1サインイン失敗時のメソッド
    def render_create_error_bad_credentials
      logger.error "サインイン失敗:発火してます！"
      render json: {
        # successプロパティで真偽値を返す
        success: false,
        errors: ["ログインに失敗しまー。ユーザー名またはパスワードが間違っている可能性があります。"]
        # "status": 401と同じ意味
      }, status: :unauthorized
    end

    # 4.1
    def render_destroy_success
      render json: {
        success: true,
        message: I18n.t('devise.sessions.signed_out')
      }, status: 200
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
. **`def destroy`について**
- `def destroy`は、`Api::V1::Auth::SessionsController`クラス内で定義されたインスタンスメソッド。
- このメソッドは、ユーザーのセッション（ログイン状態）を破棄するために使用される。具体的には、ユーザーがログアウト
する際に呼び出される。
- `super`キーワードは、継承した親クラス（この場合は`DeviseTokenAuth::SessionsController`）の同名メソッド
（`destroy`）を呼び出すために使用される。これにより、`DeviseTokenAuth`の標準的なログアウト処理が実行される。

================================================================================================
2
. **`protected`について**
- `protected`は、Ruby（Railsの元となる言語）のアクセス制御キーワードの一つ。
- `protected`で定義されたメソッドは、同じクラスまたはサブクラスのインスタンスからのみ呼び出すことができる。
- この`protected`セクションには`render_create_success`と`render_destroy_success`メソッドが含まれており、
これらはサブクラスや同クラス内の他のメソッドからのみアクセス可能。

================================================================================================
3.1
. **`render_create_success`の挙動と使用意図**
- `render_create_success`メソッドは、devise_token_auth/sessions_controllerに記載されているメソッド。ユ
ーザーが正しくログインしたときに自動で呼び出される。
------------------------------------------------------------------------------------------------
- 実際のdevise_token_auth/sessions_controllerのコード
def render_create_success
      render json: {
        data: resource_data(resource_json: @resource.token_validation_response)
      }
end
- このメソッドは、JSON形式でレスポンスを返す。レスポンスには、ユーザー情報や認証に必要なトークン情報などが含まれる。
- 具体的には、`@resource.token_validation_response`を使って、ユーザーの認証トークンとその他の情報を取得し、
クライアントに返す。
------------------------------------------------------------------------------------------------
.`render_create_success`の自作例とその意図
- DeviseTokenAuthを利用したアプリでは、独自のニーズに合わせてセッションコントローラーをカスタマイズすることが一
般的。
- この例では、`render_create_success`をオーバーライドしている。このメソッドのカスタマイズにより、標準のレスポン
スに加えて、独自のステータスメッセージやログイン成功時の追加情報をクライアントに提供できる。
- Gemをインストールすると、DeviseTokenAuth::SessionsControllerがデフォルトで提供される。このコントローラー
は、認証に関連するアクション（例えばサインイン、サインアウト）を処理する。ユーザーがサインインを試みると、Railsア
プリケーションはDeviseTokenAuthによって定義されたルートにリクエストをルーティングする。
------------------------------------------------------------------------------------------------
. オーバーライドの仕組み
- メソッドをオーバーライドするには、同じ名前のメソッドをサブクラスで定義する必要がある。
- この場合、`api/v1/auth/sessions_controller.rb`は`DeviseTokenAuth::SessionsController`を継承してお
り、`render_create_success`メソッドを再定義（オーバーライド）している。
- オーバーライドされたメソッドは、元のメソッドの代わりに実行される。
. DeviseTokenAuthを使用したアプリの処理の流れ
- ユーザーがサインインすると、`DeviseTokenAuth::SessionsController`の`create`メソッドに到達する。
- このメソッド内で、ユーザーの認証処理が行われ、認証が成功すると`render_create_success`が呼び出される。
- もし`api/v1/auth/sessions_controller.rb`で`render_create_success`がオーバーライドされていれば、そのオ
ーバーライドされたメソッドが実行される。
- オーバーライドされたメソッドがなければ、元の`devise_token_auth/sessions_controller.rb`のメソッドが実行さ
れる。
- オーバーライドのメカニズムは、Railsの継承とポリモーフィズムの基本的な概念に基づいています。

================================================================================================
3.2
.`render`
- Ruby on Railsのメソッドで、コントローラで使用します。これは、クライアントに送り返すレスポンスの作成をコントロ
ーラに指示します。
- render`は、テンプレート、テキスト、JSON、XML などさまざまな形式でレスポンスを作成します。render json:` を使
用すると、JSON形式を送信します。
------------------------------------------------------------------------------------------------
.json:
- `json:` は独立したメソッドではなく、`render` メソッドのオプションです。これは `render` が生成するレスポンス
のフォーマットを指定します。render json:` を使用すると、指定されたデータ(Ruby ハッシュや Active Record オブ
ジェクトなど) を JSON 形式に変換し、レスポンスのコンテントタイプを `application/json` に設定します。
------------------------------------------------------------------------------------------------
`render json:` メソッドは指定されたハッシュ、
{
  status: 'success',
  message: I18n.t('devise.sessions.signed_in'),
  data: resource_data(resource_json: @resource.token_validation_response)
}
をjson形式に変換。
- ハッシュのキー `status`、`message`、`data` は、クライアントに送信されるレスポンスの JSON オブジェクトのプロ
パティとなる。
------------------------------------------------------------------------------------------------
{
  "data": {
    "success": true,
    "message": "ログインしました。",
    "data": {
      "email": "momo@momo.com",
      "provider": "email",
      "uid": "momo@momo.com",
      "id": 1,
      "allowPasswordChange": false,
      "name": "momo",
      "admin": true,
      "profile": "アマまま"
    }
  },
  "status": 200,
  "statusText": "OK",
  "headers": {
    "access-token": "YDkxmhAsw57xr0eJ3b3vAw",
    "cache-control": "max-age=0, private, must-revalidate",
    "client": "0793NEPGltrXf0dcFXcqFQ",
    "content-type": "application/json; charset=utf-8",
    "expiry": "1705039517",
    "token-type": "Bearer",
    "uid": "momo@momo.com"
  },
  "config": {
    *略
  },
  "request": {}
}
------------------------------------------------------------------------------------------------
実際にrender json:した結果res.data部分のみ
{
  "status":"success",
  "message":"ログインしました。",
  "data":{
    "email":"momo@momo.com",
    "provider":"email",
    "uid":"momo@momo.com",
    "id":1,
    "allowPasswordChange":false,
    "name":"momo",
    "admin":true,
    "profile":"アマまま"}
  }
------------------------------------------------------------------------------------------------
Rails API からの JSON レスポンス (`sessions_controller.rb` 内の `render_create_success` メソッド) の
`data` プロパティと、フロントエンド (`useSignIn.ts` 内) の `AxiosResponse` オブジェクトの `data` プロパテ
ィの関係は、Axios が HTTP レスポンスをどのように処理するか、そして Rails で JSON レスポンスがどのように構造化さ
れているかの結果です。
------------------------------------------------------------------------------------------------
. **Rails JSONレスポンス (`render_create_success` メソッド)**：
- Railsコントローラでは、ユーザがサインインに成功したときのJSONレスポンス構造を定義します。
- render json: { ... }` 行でJSONレスポンスのフォーマットを指定します。ここでは、 `status`、`message`、
`data` のようなキーを指定する。
- この JSON レスポンスの `data` キーには、特にユーザー関連の情報（メールアドレス、ID、その他の詳細情報など）を格
納するように設計されている。
------------------------------------------------------------------------------------------------
. **アクシオスとそのレスポンス処理**：
- フロントエンドで使用されるAxiosは、バックエンドへのリクエストを行うためのプロミスベースのHTTPクライアント。
- Axios がリクエストを行い、レスポンスを受信すると、レスポンスを `AxiosResponse` オブジェクトにラップ。
- AxiosResponse` オブジェクトにはいくつかのプロパティがあるが、ここで最も重要なプロパティは `data` である。
- AxiosResponse` の `data` プロパティには、サーバーからのレスポンスの本文が格納されます。あなたの場合、これは
Rails API から送信された JSON オブジェクト全体です。
------------------------------------------------------------------------------------------------
**2つの `data` プロパティを接続する**：
- axios.post('/auth/sign_in', params)` を呼び出すと、Axios は Rails バックエンドにリクエストを送信し、
`render_create_success` で定義した JSON レスポンスを受け取ります。
- Rails からの JSON レスポンス (ユーザー詳細の `data` を含む) は、フロントエンドの `AxiosResponse` オブジェ
クトの `data` プロパティになります。
- つまり、 `useSignIn` フックで `res.data` にアクセスすると、Rails サーバから送信された JSON レスポンスにア
クセスすることになります。
------------------------------------------------------------------------------------------------
**Why This Works**：
- この仕組みはAxiosの設計の一部です。サーバーからのレスポンスボディ (あなたの場合は JSON オブジェクト) を自動的
に受け取り、`AxiosResponse` オブジェクトの `data` プロパティに代入します。
- RailsバックエンドとAxiosはシームレスに連携しています： RailsはレスポンスをJSON形式で送信し、Axiosはそれを受
信してフロントエンドのコードで扱いやすいように構造化します。
------------------------------------------------------------------------------------------------
. RailsのJSONレスポンスの`data`プロパティは、AxiosがHTTPリクエストからのレスポンスを処理して構造化する方法によ
り、Axiosレスポンスの`data`プロパティにマッピングされます。

================================================================================================
3.3
. **`resource_data(resource_json: @resource.token_validation_response)`の解説**
- `resource_data`はDeviseTokenAuthの独自のヘルパーメソッドである。このメソッドは、DeviseTokenAuthが提供す
る機能の一部で、認証されたユーザー（@resource）に関連するデータをハッシュ形式に整形して返すメソッド。
- `resource_data`メソッドの戻り値は、通常、ユーザーに関する情報とトークン情報を含むハッシュである。
- ただし、`render json: { data: resource_data(...) }`のように使用される場合、このハッシュはJSON形式に変換
されてレスポンスとしてクライアントに送信される。
------------------------------------------------------------------------------------------------
- @resourceは、DeviseTokenAuthによって認証されたユーザーのインスタンスを指す。
------------------------------------------------------------------------------------------------
. **`data: resource_data(resource_json: @resource.token_validation_response)`の戻り値の具体例**
- data = resource_data(resource_json: @resource.token_validation_response)のdataの中身
{"email"=>"momo@momo.com", "provider"=>"email", "uid"=>"momo@momo.com", "id"=>1,
  "allow_password_change"=>false, "name"=>"momo", "admin"=>true, "profile"=>"アマまま"}
- これをjson形式に変換されるので、最終的に、

------------------------------------------------------------------------------------------------
- `@resource.token_validation_response`は、認証されたユーザーに関連するトークン情報とその他の認証データを含
むレスポンスを生成するメソッドである。
- このメソッドは、ユーザーが有効な認証トークンを持っているかどうかを検証し、その結果を含むレスポンスデータを返す。
```json
{
  "status": "success",
  "message": "Signed in successfully.",
  "data": {
    "id": 123,
    "email": "user@example.com",
    "provider": "email",
    "uid": "user@example.com",
    "allow_password_change": false,
    "name": "John Doe",
    "nickname": "johnny",
    "image": null,
    "token_type": "Bearer",
    "access_token": "some-access-token",
    "client_id": "some-client-id",
    "expiry": 1622127321
  }
}
```
- ここで、`data`部分は`@resource.token_validation_response`によって生成され、ユーザーの詳細、認証トークン情
報、有効期限などが含まれる。

================================================================================================
3.4
success, message, dataはdataプロパティで返却される(res.dat.data)
status: :okはdataプロパティで返さず、statusプロパティで返すので、(res.dat.status)でアクセスする。

================================================================================================
4.1
. **`render_destroy_success`の挙動と使用意図**
- `render_destroy_success`は、ユーザーがサインアウト（ログアウト）に成功した際に呼び出されるメソッド。
- このメソッドは、サインアウト成功時のレスポンスをカスタマイズするために使われる。具体的には、成功を示す`true`、国
際化された成功メッセージ（`I18n.t('devise.sessions.signed_out')`）を含むJSONレスポンスを生成し、これを返す。
- このメソッドの目的は、API経由でサインアウトが成功したことをフロントエンドに通知すること。サインアウト後のユーザー
インターフェースや処理を適切に更新するために、フロントエンド側でこのレスポンスを利用できる。

================================================================================================
5.1
.def render_create_error_bad_credentialsはdevise_token_auth/sessions_controller.rb の create アク
ション内で、ユーザー認証が失敗した場合に呼び出されるデフォルトのメソッド
------------------------------------------------------------------------------------------------
デフォルトの記載
def render_create_error_bad_credentials
    render_error(401, I18n.t('devise_token_auth.sessions.bad_credentials'))
end
------------------------------------------------------------------------------------------------
- `render_create_error_bad_credentials` メソッドは、サインインが失敗した場合に呼び出されます。このメソッド
は、`success: false` と共に 401 ステータスコードを返します。
- フロントエンドの `handleSignIn` メソッド内で `signIn` 関数を `try` ブロック内で呼び出しています。この関数が例外を投げる（つまり、401 エラーを返す）と、`catch` ブロックが実行されます。これが `console.log("catch作動")` が動作する理由です。
- `else` ブロックは、リクエストが成功（ステータスコード 200）でも失敗（ステータスコード 401）でもない場合にのみ実行されます。しかし、このコードでは成功の場合は `if` ブロックで、失敗の場合は `catch` ブロックで処理されるため、`else` ブロックが実行されることはありません。
------------------------------------------------------------------------------------------------
. `.render_error`
- `.render_error` は、エラー応答を生成し、JSON形式でクライアントに送信します。
. `401, I18n.t('devise_token_auth.sessions.bad_credentials')` この引数の意味は？
- `401` はHTTPステータスコードで、"Unauthorized" を意味します。これはクライアントがリクエストを行うには認証が
必要であることを示します。
- `I18n.t('devise_token_auth.sessions.bad_credentials')` は国際化（i18n）ライブラリを使用して、特定のエ
ラーメッセージを取得しています。ここでは、「devise_token_auth.sessions.bad_credentials」に対応する翻訳され
た文字列を取得しています。
------------------------------------------------------------------------------------------------
実際のres
{
  "data": "",
  "status": 204,
  "statusText": "No Content",
  "headers": {
    "cache-control": "no-cache"
  },
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": ["xhr", "http"],
    "transformRequest": [null, null],
    "transformResponse": [null, null],
    "timeout": 5000,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    "baseURL": "http://localhost:3010/api/v1",
    "method": "post",
    "url": "/auth/sign_in",
    "data": "{\"email\":\"momo@momo.com\",\"password\":\"mo\"}"
  },
  "request": {}
}
------------------------------------------------------------------------------------------------
- `render_create_error_bad_credentials`メソッド自体が直接JSON形式のレスポンスを生成するわけではありません。
Rails 側では、`render_error` メソッドが呼び出されてエラーメッセージとステータスコードが設定されます。しかし、
Railsの内部処理により、最終的にレスポンスはJSON形式でクライアントに返されます。これは、リクエストがAPI経由で行われ
たことを検出すると、Railsが自動的にレスポンスをJSONに変換するためです。
------------------------------------------------------------------------------------------------
- TypeScriptでは、JSON形式のデータを扱う際、通常は`any`型を使用するか、より具体的なインターフェースや型エイリア
スを定義して使用します。`any`型を使用すると、どんな形式のデータでも扱える柔軟性がありますが、型の安全性は低くなりま
す。
- インターフェースや型エイリアスを使用する場合、レスポンスの構造が既知の場合には、その構造に合わせて型を定義するこ
とが可能です。これにより、型の安全性を高めることができます。
- 例として、APIレスポンスの型を定義する場合、以下のようにインターフェースを作成できます:

  interface ApiResponse {
    data: string;
    status: number;
    statusText: string;
    headers: {
      [key: string]: string;
    };
    config: {
      // ここに更に詳細な構成情報を含める
    };
    request: {
      // リクエストに関する情報
    };
  }

- このように型を定義することで、APIから返されるレスポンスの構造に対して型チェックを行うことが可能になり、エラーやバ
グを事前に防ぐことができます。また、コード内でのデータの使用方法を明確にし、開発者間でのコミュニケーションを助ける効
果もあります。
------------------------------------------------------------------------------------------------
- Axios を使用してリクエストを行うと、Axios は `AxiosResponse` 型のオブジェクトに解決するプロミスを返します。
このオブジェクトには、サーバーからの応答を記述するいくつかのプロパティが含まれます。
- AxiosResponse` オブジェクトには通常data`、`status`、 statusText`、ヘッダ`、コンフィグ`、request`（リク
エストオブジェクト。コンテキストによっては、常に存在するとは限らない）。
------------------------------------------------------------------------------------------------
- `AxiosResponse` 型のジェネリクス部分（`<T, R>` の `T`）はレスポンスデータの型を示します。`any` を使用する
と、どのような型のデータでも受け入れることになりますが、これにより型安全性が失われるため、可能な限り具体的な型を指定
する方が良いです。
------------------------------------------------------------------------------------------------
フロントエンドのコードで `console.log` で表示されている `res` の内容は、Axios によって生成された HTTP レスポ
ンスオブジェクトです。このオブジェクトは `AxiosResponse` 型であり、レスポンスのデータ、ステータスコード、ヘッダ
ーなどを含んでいます。これは Rails 側の `render_create_error_bad_credentials` メソッドが生成したレスポンス
とは異なり、Axios によって加工された形です。

=end
