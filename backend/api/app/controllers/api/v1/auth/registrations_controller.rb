# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  # 4
  # （デフォ:コメントアウト）
  before_action :configure_sign_up_params, only: [:create]
  # （デフォ:コメントアウト）
  before_action :configure_account_update_params, only: [:update]


  # 6
  # def update
  #   super
  #   if account_update_params[:avatar].present?
  #     current_api_v1_user.avatar.attach(account_update_params[:avatar])
  #   end
  # end

  protected
    # 2 ユーザー登録時に使用
    def configure_sign_up_params
      # サインアップ時に登録できるカラムを指定
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
      # params.permit(:email, :password, :password_confirmation, :name, :avatar)
    end

    # 3 ユーザー更新時に使用
    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update, keys: [:name])
    end

    # 5
    def render_create_success
      render json: {
        status: 'success',
        message: I18n.t('devise.registrations.signed_up'),
        data: resource_data
      }
    end

    def render_update_success
      render json: {
        status: 'success',
        message: I18n.t('devise.registrations.updated'),
        data:   resource_data
      }
    end


end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
このコードは、DeviseTokenAuthのRegistrationsControllerを継承した
Api::V1::Auth::RegistrationsControllerクラスで、サインアップ時に許可されるパラメータを指定する
sign_up_paramsメソッドを定義しています。params.permitで許可するカラムを指定しています。
このコードの利用意図は、サインアップ時に必要なカラムを指定することで、不必要なパラメータが登録されることを防止し、セ
キュリティを強化することです。
サインアップ時に必要なカラムを指定することは一般的であり、Railsのstrong parametersを使った設定も同様です。また
、Deviseの設定においても、ユーザー登録に必要なカラムを指定する設定が一般的です。

================================================================================================
2
configure_sign_up_paramsという名前がdeviseのデフォの名前だが、任意でいい。
その場合、devise_token_authにsign_up_paramsがあるので、これを使う。

DeviseTokenAuth::RegistrationsControllerが提供するメソッド。
サインアップ時に必要なパラメータを設定するメソッド。
sign_up_paramsメソッドは、サインアップ時に登録できるカラムを指定するために使用されます。具体的には、paramsオブ
ジェクトからemail、password、password_confirmation、nameの4つのパラメータのみを取得します。
sign_up_paramsメソッドの目的は、セキュリティ上の理由から、不要な情報が含まれている場合に備えて、許可されたパラメ
ータ以外は受け付けないようにすることです。
これはDeviseやDeviseTokenAuthなどの認証Gemを使用する場合によく見られます。また、Strong Parametersを使用する
Railsの標準的な方法でもあります。
sign_up_params は、Devise Token Auth の RegistrationsController に実装されているアクションです。ただし、
Devise の RegistrationsController でも、同様のアクションが存在するため、混乱が生じる場合があります。
Devise Token Auth の sign_up_params は、新規ユーザー登録に必要なパラメータを許可するストロングパラメーターを
定義するために使用されます。

------------------------------------------------------------------------------------------------
configure_permitted_parametersは、デフォルトの許可されたストロングパラメーターに追加のストロングパラメーターを
追加するメソッドです。
deviseのsign_up_paramsとconfigure_permitted_parameters、params.permitは機能が競合しているわけではありま
せん。
sign_up_params は Devise のメソッドで、params.permit は Rails の Strong Parameters のメソッドです。
configure_permitted_parametersはデフォルトの許可されたパラメーターに追加のパラメーターを追加するために使用され
ます。
Devise の sign_up_paramsメソッドは、params.permitを使用して、許可されたパラメータを定義しています。
つまり、Devise の機能である sign_up_params と Rails の機能である params.permit は協調して動作し、
configure_permitted_parameters は Devise で許可されたパラメータに加えて、さらにカスタムのストロングパラメー
ターを設定するために使用されます。

------------------------------------------------------------------------------------------------
許可された属性リストに admin が含まれていない。
これにより、任意のユーザーが自分自身にアプリケーションの管理者権限を与える ことを防止できます。

================================================================================================
3
account_update_params
DeviseとDeviseTokenAuthで提供されるユーザーアカウント情報の更新に関するメソッドで、ストロングパラメーターの一種
です。更新時に許可される属性を指定するために使用されます。
これをオーバーライドしています。

update_params
ハッシュオブジェクト。params.permit(:name, :email) によって許可されたキーと値がハッシュ形式で取得されます。

------------------------------------------------------------------------------------------------
Rubyにおいて、子クラスで親クラスのメソッドをオーバーライドした場合、子クラスのオーバーライドされたメソッドが呼び出
されます。このとき、親クラスの元のメソッドは呼び出されません。ただし、子クラスのオーバーライドされたメソッド内で
superキーワードを使用することで、親クラスの元のメソッドを呼び出すことができます。

------------------------------------------------------------------------------------------------
DeviseTokenAuth::RegistrationsControllerのデフォルトのupdateメソッドは、ユーザー情報（例：メールアドレス、
パスワード）の更新を行います。このメソッドは、認証済みのユーザーが自分の情報を更新する際に使用されます。通常、このア
クションは、ユーザーがアカウント情報を更新するフォームからリクエストが送信されたときに実行されます。

デフォルトのupdateメソッドをカスタマイズする場合、一般的に以下のようなカスタマイズが行われることが多いです。
パラメータの許可リストの変更: デフォルトのupdateメソッドでは、特定のパラメータ（メールアドレス、パスワードなど）が
許可されています。しかし、ユーザーモデルにカスタム属性が追加された場合、それらの属性も許可リストに追加する必要があり
ます。これがaccount_update_paramsメソッドのオーバーライドの目的です。
更新処理の追加: ユーザー情報の更新に伴って追加の処理（例：履歴の記録、通知の送信）が必要な場合、デフォルトのupdate
メソッドをオーバーライドして、その処理を追加できます。
バリデーションの追加: デフォルトのupdateメソッドでは、ユーザーモデルに定義されたバリデーションが適用されます。しか
し、更新時に特定の条件を満たす必要がある場合（例：パスワードの強度チェック、電話番号の形式チェック）、デフォルトの
updateメソッドをオーバーライドして、追加のバリデーションを実行できます。
DeviseTokenAuth::RegistrationsControllerのデフォルトのupdateアクションでは、account_update_paramsメソ
ッドが使用されています。
DeviseTokenAuth::RegistrationsController にはデフォルトの update メソッドが定義されており、その中で
account_update_params メソッドが使用されます。registrations_controller.rb で account_update_paramsを
オーバーライドすることで、デフォルトの update メソッドが使用するパラメータをカスタマイズできます。

------------------------------------------------------------------------------------------------
許可された属性リストに admin が含まれていない。
これにより、任意のユーザーが自分自身にアプリケーションの管理者権限を与える ことを防止できます。

================================================================================================
4
before_action

バックエンドのupdate(その他あればedit)に、ユーザーにログインを要求する before_actionを設定。
rails_tutorialでは、
before_action :logged_in_user, only: [:edit, :update]

ただし、devise_token_authではデフォルトで、devise_token_auth/registrations_controller.rbに、
before_action :logged_in_user, only: [:edit, :update]設定済みなので、特に設定不要。

*set_user_by_token
devise_token_authが提供するトークンベースの認証機能を利用し、リクエストから渡されたトークンに紐づくユーザーが存
在するかどうかを確認します。失敗した場合はnilを返します。

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

------------------------------------------------------------------------------------------------

=end
