# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  # 4
  # （デフォ:コメントアウト）
  # before_action :configure_sign_up_params, only: [:create]
  # （デフォ:コメントアウト）
  # before_action :configure_account_update_params, only: [:update]

  # 6
  def create
    puts "createが発火:DeviseTokenAuth::RegistrationsController"
    super
  end

  # 7
  def update
    puts "updateが発火:DeviseTokenAuth::RegistrationsController"
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

    def render_update_success
      render json: {
        status: 'success',
        message: I18n.t('devise.registrations.updated'),
        data: resource_data
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
4
before_action
バックエンドのupdate(その他あればedit)に、ユーザーにログインを要求する before_actionを設定。
rails_tutorialでは、
before_action :logged_in_user, only: [:index, :edit, :update, :destroy,
                                      :following, :followers]
before_action :correct_user,   only: [:edit, :update]
------------------------------------------------------------------------------------------------
devise_token_authではデフォルトで、devise_token_auth/registrations_controller.rbに、
before_action :set_user_by_token, only: [:destroy, :update]
------------------------------------------------------------------------------------------------
[devise_token_auth/registrations_controller.rb]
before_action :set_user_by_token, only: [:destroy, :update]
before_action :validate_sign_up_params, only: :create
before_action :validate_account_update_params, only: :update
skip_after_action :update_auth_header, only: [:create, :destroy]
------------------------------------------------------------------------------------------------
*set_user_by_token
devise_token_authが提供するトークンベースの認証機能を利用し、リクエストから渡されたトークンに紐づくユーザーが存
在するかどうかを確認します。失敗した場合はnilを返します。
これはトークン認証を行い、リクエストを行ったユーザーが誰かを確認し、そのユーザーの情報を操作するために用いられます。
------------------------------------------------------------------------------------------------
before_action :set_user_by_tokenは、
railsのbefore_action :logged_in_userとbefore_action :correct_userの両方の役割を持っていると言える。
before_action :logged_in_userは、ユーザーがログインしていることを確認するためのメソッドです。
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
意図: これにより、次回のリクエスト時には新しいアクセストークンを用いることで、セッションを保持します。
createとdestroyアクション後には実行されません。これは、createアクションの場合、ユーザーの登録直後は自動的にログ
インしない、または、destroyアクションの場合、ユーザーのアカウント削除後は認証情報を更新する必要がないためです。
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

Deviseの国際化ファイルとは、Deviseで使用されるエラーメッセージや成功メッセージなどのテキストを、複数の言語に翻訳
するためのファイルです。ファイル名は"devise.{ロケール名}.yml"です。
devise.registrations.signed_upに対応するメッセージは、"devise.{ロケール名}.yml"ファイルの中の、
"registrations"セクション内にある"signed_up"というキーに対応するメッセージです。

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
6
継承元のDeviseTokenAuth::RegistrationsControllerの
before_action :set_user_by_token, only: [:destroy, :update]は自動で発火している

set_user_by_token
トークンによって認証されたユーザーを特定し、そのユーザーの情報をcurrent_api_v1_userという変数にセットするメソッ
ド。

------------------------------------------------------------------------------------------------
親クラスのupdate機能に追加して、アバター画像を更新する処理を追加。
ユーザーがプロフィール画像をアップロードした場合に、その画像でユーザーのプロフィール画像を更新するために使用。
active_strageで保存する場合、親要素.イメージ名.attach(params[:key]とする必要があります。
例えば,既存のuserにavatarを付与するには、
User.avatar.attach(params[:avatar])とします。

------------------------------------------------------------------------------------------------
.account_update_params[:avatar]
account_update_params
DeviseのStrong Parametersによって許可されたキーにアクセスするためのメソッド
:avatar
その中の一つのキー
つまり、更新フォームから送信されたファイルの情報が含まれるストロングパラメーターから :avatar キーの値を取得してい
る。

current_api_v1_user
現在認証されているユーザーを表します。

avatar
Userモデルで定義されたActive Storageのhas_one_attachedメソッドによって、ユーザーのプロフィール画像を参照する
ためのアクセッサーです。

attach
Active Storageのメソッドで、引数として渡されたファイルをアップロードし、アタッチメントを作成します。

account_update_params[:avatar]
ユーザーがアップロードしたプロフィール画像を含む、account_update_paramsというストロングパラメータのavatarキー
を参照します。

================================================================================================
7
rails tutorialでは、ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能です。
DeviseTokenAuth::RegistrationsControllerのupdateにはデフォルトで、
before_action :set_user_by_token, only: [:destroy, :update]
が設定されている。
そのため、「ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能」という設定がデフォル
トで設定されているため、特に自分で実装不要です。
------------------------------------------------------------------------------------------------
この `before_action` は、`update` や `destroy` アクションを実行する前に `set_user_by_token` メソッドを
呼び出します。これは、リクエストヘッダに送られた認証トークンをもとに現在の認証ユーザを見つけます。
このメソッドは、トークンが有効な場合は `@resource` インスタンス変数に認証済みユーザーを設定し、トークンが無効な場
合はエラーを返します。
したがって、`update`アクションでは、アクションの実行時に `@resource` が既に認証済みユーザに設定、限定されている。
つまり、`update`アクションは認証済みユーザーの `@resource` を使って更新を行うので、現在の認証済みユーザーのみが
自分の詳細を更新できることになります。
=end
