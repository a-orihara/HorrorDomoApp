# 1
class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
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
=end
