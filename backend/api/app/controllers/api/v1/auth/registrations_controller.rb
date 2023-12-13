# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  # 4
  # （デフォ:コメントアウト）
  # before_action :configure_sign_up_params, only: [:create]
  # （デフォ:コメントアウト）
  # before_action :configure_account_update_params, only: [:update]

  def create
    # logger.info "createが発火:DeviseTokenAuth::RegistrationsController"
    # 2
    super
  end

  # 6
  def update
    logger.info "updateが発火:DeviseTokenAuth::RegistrationsController"
    # 6.2
    avatar_url = generate_avatar_url(@resource)
    # 6.3
    @resource.assign_attributes(account_update_params)
    # 6.4
    @avatar_url = avatar_url
    super
  end

  protected

    # 5
    def render_create_success
      render json: {
        # status: 'success'は、200を返す
        status: 'success',
        message: I18n.t('devise.registrations.signed_up'),
        data: resource_data
      #   # status: 'created'は、201を返す。201はPOST, PUT：リクエストが成功しリソースが作成されたことを示す。
      # },status: :created
      }
    end

    # updateの戻り値を定義する
    def render_update_success
      render json: {
        status: 'success',
        message: I18n.t('devise.registrations.updated'),
        data: resource_data,
        avatar_url: @avatar_url
      }
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
このコードは、DeviseTokenAuthのRegistrationsControllerを継承した、
Api::V1::Auth::RegistrationsControllerクラスで、サインアップ時に許可されるパラメータを指定する
sign_up_paramsメソッドを定義しています。params.permitで許可するカラムを指定しています。
このコードの利用意図は、サインアップ時に必要なカラムを指定することで、不必要なパラメータが登録されることを防止し、セ
キュリティを強化することです。
サインアップ時に必要なカラムを指定することは一般的であり、Railsのstrong parametersを使った設定も同様です。また
、Deviseの設定においても、ユーザー登録に必要なカラムを指定する設定が一般的です。

================================================================================================
2
. **`auth/registrations_controller.rb`の`super`についての解説**：
- `super`キーワードは、継承されたクラス（この場合は`DeviseTokenAuth::RegistrationsController`）の同名のメ
ソッド（この場合は`create`）を呼び出します。
- `super`を使用することで、`DeviseTokenAuth::RegistrationsController`に定義されている`create`アクション
の挙動をそのまま利用しつつ、必要に応じて追加のロジックを`Api::V1::Auth::RegistrationsController`内で実装す
ることができます。
- このアプローチは、既存のDeviseTokenAuthの機能を活用しながら、アプリケーション固有の要件やカスタマイズを組み込
む際に有用です。例えば、ユーザー作成後に特定のログを出力したい場合などに使用できます。

================================================================================================
4
before_action
バックエンドのupdate(その他あればedit)に、ユーザーにログインを要求する before_actionを設定。
rails_tutorialでは、
before_action :logged_in_user, only: [:index, :edit, :update, :destroy,
                                      :following, :followers]
before_action :correct_user,   only: [:edit, :update]
------------------------------------------------------------------------------------------------
devise_token_authではデフォルトで、devise_token_auth/registrations_controller.rbに、
[devise_token_auth/registrations_controller.rb]
before_action :set_user_by_token, only: [:destroy, :update]
before_action :validate_sign_up_params, only: :create
before_action :validate_account_update_params, only: :update
skip_after_action :update_auth_header, only: [:create, :destroy]
------------------------------------------------------------------------------------------------
*set_user_by_token
リクエストから渡されたトークンに紐づくユーザーが存在するかどうかを確認します。失敗した場合はnilを返します。
これはトークン認証を行い、リクエストを行ったユーザーが存在するか、誰かを確認し、そのユーザーの情報を操作するために用
いられます。
------------------------------------------------------------------------------------------------
before_action :set_user_by_tokenは、
railsのbefore_action :logged_in_userとbefore_action :correct_userの両方の役割を持っていると言える。
before_action :logged_in_userは、ユーザーがログインしていることを確認するメソッド。
before_action :correct_userは、特定のアクション（例えば、ユーザープロフィールの編集やアップデート）が実行される
前に、正しいユーザー（アクションを実行しようとしているユーザーが対象のユーザーであること）であることを確認するメソッ
ドです。
before_action :set_user_by_tokenは、Devise Token Authにおいて、トークンによる認証を行い、対応するユーザー
を特定する役割を持っています。
------------------------------------------------------------------------------------------------
:update_auth_header
意味: 認証ヘッダーの更新
挙動: レスポンスのHTTPヘッダーに新しい認証情報（アクセストークンとクライアントID）を設定します。ユーザーがログイン
またはアカウント情報を更新するたびに新しいアクセストークンが生成され、それをヘッダーに設定します。
意図: これにより、次回のリクエスト時には新しいアクセストークンを用います。
createとdestroyアクション後には実行されません。これは、createアクションの場合、ユーザーの登録直後は自動的にログ
インしない、または、destroyアクションの場合、ユーザーのアカウント削除後は認証情報を更新する必要がないためです。
- ユーザーの情報（例えば、プロフィール情報）を更新する際には、新しいアクセストークンが生成され、レスポンスヘッダー
に設定されます。
------------------------------------------------------------------------------------------------
. **`auth/registrations_controller.rb`に特定の`before_action`を書かない理由について**：
- `application_controller.rb`に`configure_permitted_parameters`メソッドがある場合、これは全てのDevise
コントローラーに影響を及ぼします。したがって、`auth/registrations_controller.rb`に個別の`before_action`を
書く必要がなくなります。
- `configure_permitted_parameters`メソッドにより、サインアップやアカウント更新時に追加で許可したいパラメータ
ーを定義しています。これは、Deviseの標準的なパラメーター（例：email、password）以外のカスタムフィールド（例：
name, profile, avatar）を許可するために使用されます。
- 逆に、`application_controller.rb`に`configure_permitted_parameters`がない場合、
`auth/registrations_controller.rb`に`before_action :configure_sign_up_params, only: [:create]`と
`before_action :configure_account_update_params, only: [:update]`を書いて、サインアップやアカウント更
新時のパラメーターを適切に設定する必要があります。

================================================================================================
5
render_create_success
DeviseTokenAuthのRegistrationsControllerクラスで新しいアカウントが作成されたときに呼び出される、成功応答をカ
スタマイズするためのメソッドです。
このメソッドは、ユーザーの新規登録が成功した場合に呼び出され、成功メッセージをJSON形式で返します。
DeviseTokenAuthでは、render_create_successメソッドをオーバーライドして、成功応答をカスタマイズすることができ
ます。
------------------------------------------------------------------------------------------------
I18nのtメソッドを使って、Deviseの国際化ファイルからdevise.registrations.signed_upに対応するメッセージを取得
しています。
18nは、多言語化に便利なライブラリで、デフォルトでRailsに組み込まれています。
tメソッドは、指定されたキーに対応する翻訳を取得し、ローカライズされた文字列を返します。この例では、新しいアカウント
が作成されたときに表示されるメッセージを取得するために使用されています。
------------------------------------------------------------------------------------------------
Deviseの国際化ファイルとは、Deviseで使用されるエラーメッセージや成功メッセージなどのテキストを、複数の言語に翻訳
するためのファイルです。ファイル名は"devise.{ロケール名}.yml"です。
devise.registrations.signed_upに対応するメッセージは、"devise.{ロケール名}.yml"ファイルの中の、
"registrations"セクション内にある"signed_up"というキーに対応するメッセージです。
------------------------------------------------------------------------------------------------
locales/devise.en.ymlとlocales/devise.ja.yml2つのファイルがある場合、英語の場合はlocales/devise.en.yml
に定義された"devise.registrations.signed_up"に対応するメッセージが取得される。
日本語の場合はlocales/devise.ja.ymlに定義された"devise.registrations.signed_up"に対応するメッセージが取得
される。
言語に対応するファイルがない場合は、デフォルトのメッセージが表示される。
言語は、リクエストヘッダーの"Accept-Language"に含まれる値で判断されます。
------------------------------------------------------------------------------------------------
実際のresの中身
{
  "data": {
    "status": "success",
    "message": "アカウント登録が完了しました。",
    "data": {
      "id": 85,
      "provider": "email",
      "uid": "zzz@zzz.com",
      "allowPasswordChange": false,
      "name": "zzz",
      "email": "zzz@zzz.com",
      "createdAt": "2023-06-06T04:25:10.933Z",
      "updatedAt": "2023-06-06T04:25:11.016Z",
      "admin": false,
      "profile": null
    }
  },
  "status": 200,
  "statusText": "OK",
  "headers": {
    <略>
  },
  "config": {
      <略>
  },
  "request": {}
}

================================================================================================
6.2
application_controller.rbで作成したメソッド

================================================================================================
6.3
@resource
Devise Token Authで使用される変数で、現在認証されているユーザー（つまり、現在のセッションに対応するユーザー）を
参照します。この時点でここにフロントから更新用で渡したパラメーターはまだ反映されていません。
通常、この変数はユーザーの認証に使用され、各アクションでユーザーの情報にアクセスするために使用されます。
更新アクションupdate内で、@resource.assign_attributes(account_update_params)としている部分では、
@resource（現在のユーザー）の属性に対して更新パラメータを設定（ただしまだ保存はしていない）しています。
そのため、@resourceは更新される可能性のある属性（パラメータ）を持つユーザーのインスタンスとなります。
------------------------------------------------------------------------------------------------
rails tutorialでは、ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能です。
*before_actionのlogged_in_user、correct_user。
DeviseTokenAuth::RegistrationsControllerのupdateにはデフォルトで、
before_action :set_user_by_token, only: [:destroy, :update]が設定されている。
そのため、「ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能」という設定がデフォル
トで設定されているため、特に自分で実装不要です。
------------------------------------------------------------------------------------------------
`set_user_by_token` メソッドを呼び出します。これは、リクエストヘッダに送られた認証トークンをもとに現在の認証ユー
ザを見つけます。
このメソッドは、トークンが有効な場合は `@resource` インスタンス変数に認証済みユーザーを設定し、トークンが無効な場
合はエラーを返します。
したがって、`update`アクションでは、アクションの実行時に `@resource` が既に認証済みユーザに設定、限定されている。
つまり、`update`アクションは認証済みユーザーの `@resource` を使って更新を行うので、現在の認証済みユーザーのみが
自分を更新できることになります。
------------------------------------------------------------------------------------------------
@resource.assign_attributes(account_update_params)
assign_attributes
Ruby on RailsのActiveRecordモデルに存在するメソッドで、引数に取ったハッシュのキーと値を元に、対応するモデルの属
性を一括で設定します。ただし、このメソッドは値の設定だけを行い、データベースへの保存は行いません。
------------------------------------------------------------------------------------------------
account_update_params
DeviseTokenAuthのRegistrationsControllerに定義されているprivateメソッド。
DeviseTokenAuth::RegistrationsControllerが親クラスになっているので、親クラスで定義されたpublic及び
protectedメソッドは子クラスから参照・実行可能です。
特定のモデル（この場合はユーザーモデル）の更新に使用するパラメータを返すメソッドです。
configure_permitted_parametersで設定したパラメータを含む、リクエストから取得したパラメータ（更新を許可されたパ
ラメータのみを抽出したハッシュ）が、account_update_paramsメソッドの返り値になります。
DeviseやDevise Token Authによって自動的に提供され、その中でパラメータのフィルタリングや必要なバリデーションも行
われます。
------------------------------------------------------------------------------------------------
DeviseTokenAuthではユーザーを操作する際に@resourceという変数名を慣例的に使用しています。
DeviseTokenAuth::RegistrationsController内では、ユーザーを操作するインスタンス変数として@resourceが定義さ
れています。

================================================================================================
6.4
. `@avatar_url = avatar_url`について:
- `@avatar_url`はインスタンス変数です。
- このインスタンス変数の意図は、DeviseTokenAuthの`update`アクションのレスポンスの要素にユーザーのアバターURLを
含めるためです。
- `@avatar_url`は、コントローラーのアクション内で設定され、対応するビューやJSONレスポンスで使用できます。
=end
