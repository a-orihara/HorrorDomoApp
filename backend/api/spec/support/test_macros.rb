# 1
module TestMacros
  # 2
  def login_user(user = FactoryBot.create(:user))
    # requestオブジェクトのenvにdeviseのmappingを設定
    @request.env['devise.mapping'] = Devise.mappings[:user]
    # sign_inメソッドはDeviseのヘルパーメソッド。
    sign_in user
  end

  # 3
  def login_admin
    # requestオブジェクトのenvにadminのmappingを設定
    @request.env['devise.mapping'] = Devise.mappings[:admin]
    admin = FactoryBot.create(:admin)
    sign_in admin
  end

  # 4
  def request_login_user(user = FactoryBot.create(:user))
    # ユーザーの新しい認証トークン（access-token、client、uid）セットを生成
    token = user.create_new_auth_token
    # リロードして、認証トークンをDBに保存
    user.reload
    # headerに空のハッシュを設定
    headers = {}
    # headerハッシュに認証トークンを設定
    token.each do |key, value|
      headers[key] = value
    end
    # 戻り値はトークンを設定したheaderハッシュ
    headers
  end
end

# 1
=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
TestMacrosモジュールの作成。
config.extend TestMacros, type: :request
の設定に一致。

spec/supportディレクトリを作成することで、RSpecの設定、共通処理、共通テストデータの作成などをまとめることができ
ます。

このファイルがリクエストスペックや他ファイルでも使用されるのであれば、名前をrequest_macros.rbやtest_macros.rb
のように、より汎用的な名前に変更するのが良いでしょう。これにより、そのファイルがリクエストスペックでも使用できること
が明示的になります。
------------------------------------------------------------------------------------------------
controller_macros.rbと命名された理由は、このファイルには、コントローラーのテストに必要なDeviseのテスト用のメ
ソッドが定義されているためです。このファイルの作成意図は、Deviseのコントローラーテストを簡単にするために、共通処
理をまとめて定義することです。また、この方法は一般的です。

================================================================================================
2
login_userメソッドを自作
(user = FactoryBot.create(:user))
FactoryBotで生成されたuserを引数に設定
------------------------------------------------------------------------------------------------
@request.env
Railsアプリケーションに対するHTTPリクエストに関する情報を保持するための、ActionDispatch::Requestオブジェクト
のインスタンス変数です。Railsアプリケーションのコントローラーでリクエストの情報を格納しているオブジェクトです。

@requestはRSpecのコントローラスペックで、リクエストのテストを実行するために使用されます。具体的には、ログインや
ログアウトのようなDeviseの機能をテストするために使用されることがよくあります。
@request.envプロパティは値にハッシュを持ちます。
@request.envプロパティのハッシュのキー['devise.mapping']に、Devise.mappings[:user]の値を設定。
------------------------------------------------------------------------------------------------
Devise.mappings[:user]
mappingsは、Deviseによって定義されたコントローラーやビューのマッピング情報を保持しているプロパティでハッシュです。
Devise.mappings[:user]は、:userというキーに対応するDeviseのマッピング設定を取得しています。これにより、
DeviseがUserモデルに対してどのような設定や動作をするかを判断できます。
------------------------------------------------------------------------------------------------
マッピング情報とは、Deviseが認証に関連する各機能を提供するために、モデルとコントローラー、ビュー、ルートなどの関連
設定を管理するための情報です。具体的には以下のような情報が含まれます。

対象のモデル: Deviseがどのモデルに対して認証機能を提供するか。
利用するモジュール: モデルにどのような認証機能（例：パスワードリセット、アカウント確認など）を追加するか。
コントローラー: 各機能に対応するコントローラーを指定することができます。これにより、デフォルトのコントローラーをカ
スタマイズしたものに置き換えることができます。
ルート: 各機能に対応するルートの設定（URLパスやHTTPメソッドなど）が含まれます。
ビュー: デフォルトのビューが指定されており、カスタマイズが可能です。
Devise.mappings[:user]を使用することで、DeviseがUserモデルに対してどのような設定や動作をするかを判断し、それ
に応じてテスト環境を構築することができます。
------------------------------------------------------------------------------------------------
Devise.mappings は、Devise で設定された複数のモデルの認証情報のマッピング情報を格納するハッシュです。
[:user] は、Userモデルを認証に使用していることを示すために使われます。
Devise.mappings[:user] を使用することで、User モデルの認証に関する情報を取得することができます。例えば、
@request.env['devise.mapping'] のように使用することで、User モデルの認証に必要な情報を取得して、認証処理を行
うことができます。
------------------------------------------------------------------------------------------------
sign_in user

spec/rails_helper.rbに下記設定をする事により、sign_inを含むDeviseのヘルパーメソッドにアクセスすることができま
す。これにより、テスト内でユーザーをサインインさせることができるので、認証を必要とするアクションをテストすることがで
きます。
config.include Devise::Test::ControllerHelpers, type: :controller

================================================================================================
4
request_login_userメソッドを自作
(user = FactoryBot.create(:user))
FactoryBotで生成されたuserを引数に設定
------------------------------------------------------------------------------------------------
token = user.create_new_auth_token
引数として渡された user に対して、Devise Token Authでトークンを作成します。

*user.create_new_auth_tokenがここで使える理由
create_new_auth_tokenメソッドは、devise_token_auth gemによって提供されます。
UserモデルにはDeviseTokenAuth::Concerns::Userが含まれており、Userモデルにトークン認証機能を追加しています。
このConcernsを含めることで、create_new_auth_tokenメソッドがUserインスタンスで利用可能になり、ユーザー用の新し
い認証トークンを生成できるようになります。

*create_new_auth_token
ユーザーの新しい認証トークン（access-token、client、uid）セットを生成します。
これらのトークンは、その後のAPIリクエストでユーザーを認証するために使用されます。
このメソッドは、ユーザーのトークン関連属性を更新し、ユーザーレコードを保存して、新しく生成されたトークンを保存します。
これを使用して、APIリクエストに適切なヘッダーを設定することができます。
------------------------------------------------------------------------------------------------
user.reload
トークンが作成されると、ユーザーオブジェクトが更新されるため、reload メソッドでオブジェクトをリロードします。

*user.reloadはDB上のuserオブジェクトを再読み込みして、最新の状態に更新するために使用されます。
DB上のuser情報が更新されている可能性があるため、最新の情報を取得することが重要です。
例えば、ログイン後にUserオブジェクトにトークンが作成された等変更が加えられた場合、その変更がログインに反映されない
可能性があります。これを回避するために、ユーザー情報を再度読み込んで最新の情報を取得する必要があります。

*user.reloadがない場合、DB上のuser情報が更新された場合でも、変更が反映されません。
例えば、ユーザーがログインした時点で有効だったトークン情報が、ログイン後に無効化された場合、userオブジェクトが更新
されても、変更が反映されていないため、ログインに使用するトークン情報が古いままであるため、認証が通らなくなってしい
ます。
------------------------------------------------------------------------------------------------
token.each do |key, value|
トークンのヘッダー情報を取り出します。ヘッダー情報は、トークンを認証するために必要な情報を含んでいます。

*token.each はハッシュ token の各キーと値のペアに対して繰り返し処理を行います。
|key, value| はブロック引数で、各繰り返し処理において token のキーを key に、その値を value に割り当てます。
headers[key] = value は、ハッシュ headers の key というキーに value を割り当てることで、HTTPリクエストのヘ
ッダーにトークン情報を設定します。従って、ハッシュ headers は HTTPリクエストのヘッダー情報を保持していることが前
提となります。
------------------------------------------------------------------------------------------------
headers[key] = value
トークンのヘッダー情報をHTTPリクエストのヘッダーにセットします。HTTPリクエストには、セッション情報がないため、セッ
ション情報を代替するトークンが必要になります。
================================================================================================
=end
