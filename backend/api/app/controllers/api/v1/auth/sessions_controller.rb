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
      render json: {
        status: 'success',
        message: I18n.t('devise.sessions.signed_in'),
        # 3.2
        data: resource_data(resource_json: @resource.token_validation_response)
      }
    end

    # 4
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
- `render_create_success`は、ユーザーがサインイン（ログイン）に成功した際に呼び出されるメソッド。
- このメソッドは、サインイン成功時のレスポンスをカスタマイズするために使われる。具体的には、成功のステータス、国際
化された成功メッセージ（`I18n.t('devise.sessions.signed_in')`）、およびユーザーに関するデータ（
`resource_data`）を含むJSONレスポンスを生成し、これを返す。
- `resource_data`メソッドは、ユーザーの認証情報などのデータを含むJSONを生成する。このメソッドに`@resource.token_validation_response`が渡され、ユーザーのトークン検証レスポンスをレスポンスデータとして含める。
- このメソッドの目的は、API経由でサインインが成功したことをフロントエンドに通知し、必要なユーザー情報を提供すること。

================================================================================================
3.2
`resource_data`メソッドとその引数に関する質問に回答する。
. **`resource_data(resource_json: @resource.token_validation_response)`の解説**
- `resource_data`メソッドは、ユーザー情報や認証データを含むJSON形式のデータを生成するためのメソッド。
- 引数`resource_json: @resource.token_validation_response`は、`resource_data`メソッドに渡される引数。
ここで`@resource`は現在のユーザーを表し、`token_validation_response`メソッドは、そのユーザーのトークン検証結
果を含むJSON形式のデータを返す。
- つまり、この行は現在のユーザーに関連するトークン情報や認証情報を含むJSONデータを生成する。
------------------------------------------------------------------------------------------------
- `resource_json`はこのメソッドを定義する際に選択された引数の名前であり、特に固定されたものではない。
------------------------------------------------------------------------------------------------
. **`data: resource_data(resource_json: @resource.token_validation_response)`の戻り値の具体例**
- このメソッドの戻り値は、ユーザーのトークン情報や認証データを含むJSONオブジェクト。
- 具体的な例は以下のような構造を持つ可能性がある：

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
4
. **`render_destroy_success`の挙動と使用意図**
- `render_destroy_success`は、ユーザーがサインアウト（ログアウト）に成功した際に呼び出されるメソッド。
- このメソッドは、サインアウト成功時のレスポンスをカスタマイズするために使われる。具体的には、成功を示す`true`、国
際化された成功メッセージ（`I18n.t('devise.sessions.signed_out')`）を含むJSONレスポンスを生成し、これを返す。
- このメソッドの目的は、API経由でサインアウトが成功したことをフロントエンドに通知すること。サインアウト後のユーザー
インターフェースや処理を適切に更新するために、フロントエンド側でこのレスポンスを利用できる。
=end
