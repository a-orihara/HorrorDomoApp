# 1
class ApplicationController < ActionController::API
  # 2
  # Deviseコントローラーであれば、アクション実行前にconfigure_permitted_parametersメソッドを呼び出す。
  before_action :configure_permitted_parameters, if: :devise_controller?
  # current_api_v1_userなどの Devise Token Auth のヘルパーメソッドが利用可能
  include DeviseTokenAuth::Concerns::SetUserByToken

  # 3
  private
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [ :avatar] )
      devise_parameter_sanitizer.permit(:account_update, keys: [ :avatar])
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
ApplicationController は、アプリケーション内のすべてのコントローラーの基本クラスであり、一般的に共通の動作やヘ
ルパーメソッドが定義されています。
ApplicationControllerが、include DeviseTokenAuth::Concerns::SetUserByTokenしているので、
ApplicationController を継承した全てのコントローラーで、current_api_v1_userなどの Devise Token Auth の
ヘルパーメソッドが利用可能になります。

------------------------------------------------------------------------------------------------
DeviseTokenAuth::Concerns::SetUserByToken

devise_token_auth が提供するモジュールの一つで、APIでトークンベースの認証を行う際に、トークンに基づいて、様々
なメソッドが使えるようになります。

set_user_by_token ：渡されたトークンに対応するユーザーを設定する
current_user      ：現在ログインしているユーザーを返す
authenticate_user!：ユーザーがログインしているかどうかをチェックする
user_signed_in?   ：ユーザーがログインしているかどうかを返す

これらのメソッドを利用することで、トークンに基づくユーザーの認証や、ログインしているユーザーの取得などが簡単に行え
るようになります。

------------------------------------------------------------------------------------------------
Concernsは、関連するメソッドや機能をモジュール方式でグループ化し、複数のクラスやモジュールに含めることができる方
法です。Ruby on Railsアプリケーションでコードの繰り返しを避け、再利用性を促進する方法です。

================================================================================================
2
configure_permitted_parametersメソッドは、Strong Parametersを使用して、Deviseで許可するパラメーターを設定
します。devise_parameter_sanitizerを使用して、サインアップとアカウント更新時にavatarパラメーターを許可します。
Deviseを使用するアプリケーションで一般的に見られる設定です。

------------------------------------------------------------------------------------------------
if: :devise_controller?は具体的に下記
Devise::SessionsController
Devise::PasswordsController
Devise::RegistrationsController
Devise::ConfirmationsController
Devise::UnlocksController

================================================================================================
3
private
以下に定義されたメソッドがクラスの外部からアクセスできないようにするためのキーワードです。privateで定義されたメソ
ッドは、そのクラスの内部からしか呼び出すことができません。
configure_permitted_parametersはDeviseのコントローラーで使われるため、外部から呼び出される必要がなく、プライ
ベートメソッドとして定義しています。また、このメソッドはDeviseの設定をカスタマイズするために使用されるため、外部か
らのアクセスは必要ありません。

------------------------------------------------------------------------------------------------
configure_permitted_parameters
Deviseで許可するストロングパラメータを設定するためのメソッド。一般的には、ApplicationControllerに記述。
メソッド名はconfigure_permitted_parametersでなくても構いませんが、Deviseの命名規則に従い、この名前が慣習的に
使われています。

------------------------------------------------------------------------------------------------
devise gemをインストールしたら新規登録などに関わるストロングパラメーターを編集することはできません。
つまりdeviseで保存を許可されているのはマイグレーションファイル生成時に記述されているカラムのみになるのです。
configure_permitted_parameters
デフォルトの許可されたストロングパラメーターに追加のストロングパラメーターを追加するメソッドです。

------------------------------------------------------------------------------------------------
devise_parameter_sanitizer
Deviseコントローラーのインスタンスに対して、ストロングパラメータの設定や制限を行うメソッド。
Deviseの機能であるdevise_parameter_sanitizerは、コントローラーで扱うパラメータを許可するためのものであり、強
力な機能であるStrong Parametersと連携して使用されます。この機能を使用することで、Deviseが要求する一部のパラメー
タを許可したり、拒否したりすることができます。つまり、不正なパラメータの送信を防ぎ、アプリケーションの安全性を確保す
ることができます。

------------------------------------------------------------------------------------------------
permit
Railsのメソッドであり、Strong Parametersで使用されます。
Strong Parametersで使用されるメソッドで、指定されたキーを許可するために使用されます。例えば、上記のコードでは、
avatarパラメータを許可するために使用されています。
Deviseは、Railsの認証機能を拡張したGemであり、Strong Parametersを使用することが推奨されています。そのため、
Deviseもpermitメソッドを使用します。
keysオプションを使用すると、特定のパラメータに対して許可を指定することができます。上記の例では、keys: [:avatar]
を指定することで、avatarパラメータに対する許可を追加しています。

------------------------------------------------------------------------------------------------
基本理解

params.require(:user).permit(:name, :email, :password, :password_confirmation)

.params
Railsのコントローラーで使用される特別なメソッド。クライアントから送信されたパラメーターを含むハッシュを返す。
.require
paramsハッシュから必要なキーを要求する。:userはキーの名前で、クライアントが送信したデータがparams[:user]に格納
されるように要求しています。
paramsで返されたハッシュの内、:userキーのものしか受け付けないって意味。:user以外のキーが存在する場合は、取得でき
ないため、エラーが発生します。
.permit
許可されたパラメータを指定する。requireメソッドの戻り値に対して特定のキーが許可されるように使用されます。許可され
たパラメータは、フォームの入力フィールドなど、安全な入力フィールドのみです。
=end
