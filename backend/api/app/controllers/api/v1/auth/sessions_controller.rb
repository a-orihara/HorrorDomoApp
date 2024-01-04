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
      # data: resource_data(resource_json: @resource.token_validation_response)
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
      # 5.2 render_errorはそのメソッドの中でrender json:している
      render_error(401, I18n.t('devise_token_auth.sessions.bad_credentials'))
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
------------------------------------------------------------------------------------------------
rubyでは、サブクラス(子クラス)がスーパークラス(親クラス)のメソッドをオーバーライドした場合、`super`を使って明示
的に呼び出さない限り、スーパークラスの元のメソッドは実行されません。

================================================================================================
3.2
.`render`
- Railsのメソッドで、コントローラで使用します。これは、クライアントに送り返すレスポンスの作成をコントローラに指示
します。
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
  "success": true,
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
- つまり、 `useSignIn` フックで `res.data.data` にアクセスすると、Rails サーバから送信された JSON レスポン
スにアクセスすることになります。
------------------------------------------------------------------------------------------------
**Why This Works**：
- この仕組みはAxiosの設計の一部です。サーバーからのレスポンスボディ (あなたの場合は JSON オブジェクト) を自動的
に受け取り、`AxiosResponse` オブジェクトの `data` プロパティに代入します。
------------------------------------------------------------------------------------------------
. RailsのJSONレスポンスの`data`プロパティは、AxiosがHTTPリクエストからのレスポンスを処理して構造化する方法によ
り、Axiosレスポンスの`data`プロパティにマッピングされます。

================================================================================================
3.3
def resource_data(opts = {})
  response_data = opts[:resource_json] || @resource.as_json
  response_data['type'] = @resource.class.name.parameterize if json_api?
  response_data
end
------------------------------------------------------------------------------------------------
`(opts = {})` は `resource_data` メソッドの引数です。
- デフォルト値は空のハッシュ `{}` 。これにより、このメソッドは引数ありでも引数なしでも呼び出すことができる。
- 引数なしで呼ばれた場合、 `opts` は空のハッシュになる。
------------------------------------------------------------------------------------------------
**response_data = opts[:resource_json] || @resource.as_json`**
- この行は論理和演算子 `||` を使っている。
- まず、 `opts` ハッシュ内の `:resource_json` キーにアクセス。
- もし `opts[:resource_json]` が存在すれば (`nil` または `false` でなければ)、それを `response_data` に
代入。
- もし `opts[:resource_json]` が `nil` または `false` ならば、 `@resource.as_json` が評価されて
`response_data` に代入される。
- これは、`opts[:resource_json]`が提供されなかった場合のフォールバックメカニズム。
------------------------------------------------------------------------------------------------
**`@response_data['type'] = @resource.class.name.parameterize if json_api?`**：
- この行は条件付きで `response_data` ハッシュの `'type'` キーを設定する。
- json_api?` メソッドが `true` を返すかどうかをチェックする。
- もし `true` なら、 `response_data['type']` に `@resource` のクラス名をパラメータ化したものを設定する。
- .parameterize`はクラス名をURLで使いやすい形式（小文字、空白の代わりにハイフンなど）に変換する。
- これは、APIの一貫性を保つために、JSONレスポンスにtypeフィールドを追加するために使用されると思われる。
------------------------------------------------------------------------------------------------
. **`resource_data(resource_json: @resource.token_validation_response)`の解説**
- `resource_data`はDeviseTokenAuthの独自のヘルパーメソッドである。このメソッドは、DeviseTokenAuthが提供す
る機能の一部で、認証されたユーザー（@resource）に関連するデータをハッシュ形式に整形して返すメソッド。
- `resource_data`メソッドの戻り値は、通常、ユーザーに関する情報とトークン情報を含むハッシュである。
- ただし、`render json: { data: resource_data(...) }`のように使用される場合、このハッシュはJSON形式に変換
されてレスポンスとしてクライアントに送信される。
------------------------------------------------------------------------------------------------
- メソッドは `response_data` ハッシュを返す。
- このハッシュには `:resource_json` データ、または `@resource` の JSON 形式が含まれる。
- json_api?` が `true` を返す場合、ハッシュには `@resource` のパラメータ化されたクラス名の `'type'` キーも
含まれる。
------------------------------------------------------------------------------------------------
. **resource_data(resource_json: @resource.token_validation_response)`**の動作：
- resource_dataにはハッシュが渡され、キーと値のペアは
`{:resource_json => @resource.token_validation_response}` です。
- resource_json => @resource.token_validation_response` は `@resource` オブジェクトのメソッドまたは属
性で、トークンのバリデーションに関連するデータを返します。トークン自体や有効期限などの情報がJSON形式で返される。
- resource_data` 内では、この JSON データ (`@resource.token_validation_response`) が `nil` または
`false` でなければ `response_data` として使用される。もし `nil` または `false` であれば、代わりに
`@resource.as_json` がフォールバックとして使用される。
------------------------------------------------------------------------------------------------
. **resource_data(resource_json: @resource.token_validation_response)`**の戻り値：
- この行の戻り値は `resource_data` メソッドの出力である `response_data` ハッシュである。
- このハッシュは `@resource` からのトークン検証のレスポンスを JSON で表現したものである。
- さらに、`json_api?`メソッドが `true` を返した場合、ハッシュには `@resource` のパラメータ化されたクラス名を 
`'type'` キーとして格納する。
- このメソッドはサインインに成功したときに必要なトークン検証情報を含むレスポンスをクライアントに返す
------------------------------------------------------------------------------------------------
- @resourceは、DeviseTokenAuthによって認証されたユーザーのインスタンスを指す。
------------------------------------------------------------------------------------------------
. **`data: resource_data(resource_json: @resource.token_validation_response)`の戻り値の具体例**
- data = resource_data(resource_json: @resource.token_validation_response)のdataの中身
{"email"=>"momo@momo.com", "provider"=>"email", "uid"=>"momo@momo.com", "id"=>1,
  "allow_password_change"=>false, "name"=>"momo", "admin"=>true, "profile"=>"アマまま"}
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
DeviseTokenAuth::SessionsController` を継承した `Api::V1::Auth::SessionsController` でサインインの失
敗シナリオを処理するには、 `render_create_error_bad_credentials` メソッドをオーバーライドする必要があります。
コントローラにオーバーライドしたメソッドは、 ユーザが認証情報に不備があってサインインに失敗した際にカスタムレスポン
スを返します。
------------------------------------------------------------------------------------------------
- `render_create_error_bad_credentials` メソッドは、`success: false` と共に 401 ステータスコードを返し
ます。
- フロントエンドの `handleSignIn` メソッド内で `signIn` 関数を `try` ブロック内で呼び出しています。この関数
が例外を投げる（つまり、401 エラーを返す）と、`catch` ブロックが実行されます。これが `console.log("catch作動")`
が動作する理由です。
- `else` ブロックは、リクエストが成功（ステータスコード 200）でも失敗（ステータスコード 401）でもない場合にのみ
実行されます。しかし、このコードでは成功の場合は `if` ブロックで、失敗の場合は `catch` ブロックで処理されるため、
`else` ブロックが実行されることはありません。
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

================================================================================================
5.2
**render_error(401,I18n.t('devise_token_auth.sessions.bad_credentials'))`
- render_error` は、エラーが発生したときにクライアントに送り返すレスポンスを用意するメソッドである。
- 最初の引数 `401` は HTTP ステータスコードである。401` は "Unauthorized" を表し、無効な認証情報のためにリク
エストが失敗したことを示す。
- 2番目の引数 `I18n.t('devise_token_auth.sessions.bad_credentials')` はエラーを説明するメッセージです。
ここでは、`I18n.t` は翻訳されたエラーメッセージを取得するために使用される。キー `
'devise_token_auth.sessions.bad_credentials'` は翻訳ファイルの特定のメッセージを指し、通常は
"Invalid login credentials" のようなものです。
- 次に `render_error` は JSON オブジェクトの形式でレスポンスを生成する。この JSON オブジェクトには、
`success: false` (操作に失敗したことを示す) キーと `errors` (エラーメッセージを含む配列) が含まれる。
- この JSON レスポンスはフォーマットされ、HTTP ステータス 401 でクライアントに送り返される。
------------------------------------------------------------------------------------------------
def render_error(status, message, data = nil)
      response = {
        success: false,
        errors: [message]
      }
      response = response.merge(data) if data
      render json: response, status: status
end
------------------------------------------------------------------------------------------------
まず`response` という名前のハッシュを初期化する。
- このハッシュには2つのキーが含まれる： success`と `:errors` である。
- success` キーには `false` が設定され、このレスポンスに関連付けられた操作が失敗したことを示す。
- errors` キーは `message` という変数を含む配列である。これは、 `message` 変数にレスポンスに関連するエラーメ
ッセージが格納されていることを意味する。
------------------------------------------------------------------------------------------------
- 次に変数 `data` が nil でないかどうかをチェックする。
- もし `data` が nil でなければ、`data` ハッシュを `response` ハッシュにマージする。これは `merge` メソッド
を使って行われ、2 つのハッシュを結合する。キーが重なっている場合は、 `data` の値が `response` の値を上書きする。
- 最後に、 `render` メソッドを呼び出す。このメソッドは `response` ハッシュを JSON 形式に変換し、HTTP レスポン
スとして送信する。
- 変数 `status` はレスポンスの HTTP ステータスコードを決定する。
- このコードブロックの戻り値は、指定されたHTTPステータスとともにレンダリングされたJSONレスポンスである。
------------------------------------------------------------------------------------------------
**render_error`の動作：***
- `render_error`メソッドは、エラーの詳細を含むJSONレスポンスを作成し送信する機能を持つ。
- このメソッドは、認証が正しくない、トークンの有効期限切れなど、さまざまな認証失敗の場合に使用される。
- クライアントに構造化された意味のあるエラーメッセージを返す。
------------------------------------------------------------------------------------------------
**. `render_error` が受け取る引数:**.
- `render_error`メソッドは、通常3つの引数を取る：
- ステータスコード（整数）：これはエラーの種類に対応するHTTPステータスコード。
- エラーメッセージ（文字列）：エラーを説明するメッセージ。
- データ（ハッシュ、省略可能）：エラーに関連する追加データを含むハッシュ。
------------------------------------------------------------------------------------------------
**戻り値:**
- `render_error`は伝統的な意味での値を返さない。代わりに、JSON形式のレスポンスを構築しクライアントに送信する。
- JSONレスポンスには、`success`（falseに設定）、`errors`（エラーメッセージの配列）などのフィールドが含まれる。
また、`data`が提供されている場合は、そのデータもレスポンスに含まれる。
- 最終的なJSONレスポンスは、`render`メソッドによってHTTPレスポンスとして送信され、指定されたステータスコードを持
つ。
------------------------------------------------------------------------------------------------
- プログラミングにおいて、メソッドが「値を返す」と言う場合、通常はメソッドが実行された後、使用または保存できる特定
の結果を返すことを意味します。例えば、2つの数値を足してその和を返すメソッドなどです。
- render_error`メソッドは違います。その主な仕事は新しい値を計算したり生成したりする代わりに、JSON形式のレスポン
スを用意し、インターネット経由でクライアントに送信するのが仕事である。
- render_error`が実行されると、結果を保存したり、さらなる計算に使用したりすることはできない。その代わりに、準備さ
れたレスポンスを直接クライアントに送信する。これが、伝統的な意味での値を返さないという理由です。メソッドの動作は、
プログラムの他の場所で使用する新しい値を生成することよりも、通信（データを送信すること）に重点を置いています。
- 郵便配達人が手紙を配達するようなものだと考えてほしい。手紙（この場合はJSONレスポンス）が配達されれば、郵便配達人
の仕事は終わりです。同様に、`render_error` はレスポンスを送信した後、プログラムに何も返しません。
------------------------------------------------------------------------------------------------
. **render`メソッドとは?
- Railsコントローラの `render` メソッドは、リクエストが処理された後にユーザ (またはクライアント) に何を表示する
か、何を送り返すかを決定する最終ステップ。
- サーバーがクライアントに "これがリクエストの内容です" とか "これがリクエストに対するレスポンスです" と伝える。
------------------------------------------------------------------------------------------------
**render`メソッドの動作：
- render` メソッドを呼び出すと、渡された情報を受け取ってクライアントに送信する準備をする。
- この情報は、クライアントやアプリケーションが何を必要とするかに応じて、HTML、JSON、XML など様々な形式にすること
ができる。
- render`は、あなたのデータをクライアントが理解できる言語に変換するトランスレータだと考えてください。
=end
