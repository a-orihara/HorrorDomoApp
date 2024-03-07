# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  # 4
  # （デフォ:コメントアウト）
  # before_action :configure_sign_up_params, only: [:create]
  # （デフォ:コメントアウト）
  # before_action :configure_account_update_params, only: [:update]

  # rubocop:disable Lint/UselessMethodDefinition
  # 2.1 DeviseTokenAuth::RegistrationsControllerのcreateメソッドを明示的に表示
  def create
    # 2.2
    super
  end
  # rubocop:enable Lint/UselessMethodDefinition

  def update
    # 6.1 @resourceはアップデート前のuser情報
    logger.info "@resourceの内容: #{@resource.inspect}"
    # 6.2 6.3 ユーザー情報を更新（`:name`、`:profile`、`:avatar`の3つのパラメータを許可）
    @resource.assign_attributes(account_update_params)
    # 更新後の@resourceの内容をログに出力
    logger.info "account_update_paramsの中身: #{account_update_params.inspect}"
    logger.info "アップデート後の@resourceの内容: #{@resource.inspect}"
    # 6.4 更新で渡された画像をリサイズし、そのリサイズされたavatarのURLを生成
    avatar_url = generate_avatar_url(@resource)
    logger.info "更新後のavatar_urlの内容: #{avatar_url}"
    # 6.5 最終的な@avatar_urlに設定
    @avatar_url = avatar_url
    logger.info "最終的な@avatar_urlの内容: #{@avatar_url.inspect}"
    # 6.6 親クラスのupdateメソッドを呼び出し
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
      # 更新成功時のJSONレスポンス。レスポンスをログで確認するために変数を設定
      response = {
        status: 'success',
        message: I18n.t('devise.registrations.updated'),
        data: resource_data,
        avatar_url: @avatar_url
      }
      # ここで最終的なレスポンスをログで確認
      logger.info "最終的なupdateレスポンス: #{response.inspect}"
      # 実際にレスポンスを返す
      render json: response
      # render json: {
      #   status: 'success',
      #   message: I18n.t('devise.registrations.updated'),
      #   data: resource_data,
      #   avatar_url: @avatar_url
      # }
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
2.1
.`rubocop:disable Lint/UselessMethodDefinition`
- この行は、直後のコードに対して `Lint/UselessMethodDefinition` という特定のRubocop警告を無視するように指
示します。これにより、Rubocopはこのルールに基づく警告を出さなくなります。
.`rubocop:enable Lint/UselessMethodDefinition`
- この行は、無効化された警告を再び有効にするためのものです。これにより、以降のコードに対しては通常通り
`Lint/UselessMethodDefinition` ルールが適用されます。
------------------------------------------------------------------------------------------------
- この使い方は、コードの特定の部分に対してRubocopの一部のルールを一時的に無視したい場合に便利です。ただし、この機
能を頻繁に使用するとコードの品質が低下する可能性があるため、慎重に使用することが推奨されます。

================================================================================================
2.2
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
6.1
logger.info "@resourceの内容: #{ @resource.inspect }"
@resource
Devise Token Authで使用される変数で、現在認証されているユーザー（つまり、現在のセッションに対応するユーザー）を
参照します。この時点でここにフロントから更新用で渡したパラメーターはまだ反映されていません。
通常、この変数はユーザーの認証に使用され、各アクションでユーザーの情報にアクセスするために使用されます。
更新アクションupdate内で、@resource.assign_attributes(account_update_params)としている部分では、
@resource（現在のユーザー）の属性に対して更新パラメータを設定（ただしまだ保存はしていない）しています。
そのため、@resourceは更新される可能性のある属性（パラメータ）を持つユーザーのインスタンスとなります。
------------------------------------------------------------------------------------------------
DeviseTokenAuthではユーザーを操作する際に@resourceという変数名を慣例的に使用しています。
DeviseTokenAuth::RegistrationsController内では、ユーザーを操作するインスタンス変数として@resourceが定義さ
れています。
------------------------------------------------------------------------------------------------
実際の@resourceの内容（アップデート前のuser情報）*profile（更新）とavatr（新規追加）の場合
#<User id: 1, provider: "email", uid: "momo@momo.com", allow_password_change: [FILTERED],
name: "momo", email: "momo@momo.com", created_at: "2024-01-06 14:19:53.267464000 +0900",
updated_at: "2024-01-14 15:00:54.710519000 +0900", admin: true, profile: "<更新前の文>">

================================================================================================
6.2
logger はRailsアプリケーションで利用できるロギングツールで、.info メソッドを使用して情報を記録します。

================================================================================================
6.3
@resource.assign_attributes(account_update_params)
assign_attributes
assignは日本語で割り当てる
RailsのActiveRecordモデルに存在するメソッドで、引数に取ったハッシュのキーと値を元に、対応するモデルの属性を一括
で設定。ただし、このメソッドは値の設定だけを行い、データベースへの保存は行いません。
------------------------------------------------------------------------------------------------
account_update_params
.`account_update_params`の中身は、ユーザーがアカウント情報を更新する際に許可されたパラメータを決定する。この設
定は`ApplicationController`内の`configure_permitted_parameters`メソッドにて定義。
- `configure_permitted_parameters`メソッドでは、`devise_parameter_sanitizer`を使って、どのパラメータが
許可されるかを指定する。
- ここでは、`:account_update`アクションに対して、`:name`、`:profile`、`:avatar`の3つのパラメータが許可。
- これは、ユーザーがアカウント情報を更新する際に、これら3つのフィールドのみを変更できることを意味する。
------------------------------------------------------------------------------------------------
account_update_paramsの中身（*profile（更新）とavatr（新規追加）の場合）:
#<ActionController::Parameters {
  "email"=>"momo@momo.com", "name"=>"momo", "profile"=>"<フロントから送られて来た更新後の文>",
  "avatar"=>#<avatr情報の入ったオブジェクト>
} permitted: true>
* ActionController::Parameters`: RailsのHTTPリクエストのパラメータを管理・操作するクラス。
* permitted: true: Railsのストロングパラメータで許可されたことを示す
------------------------------------------------------------------------------------------------
@resource.assign_attributes(account_update_params)の中身（アップデート後の@resourceの内容）
#<User id: 1, provider: "email", uid: "momo@momo.com", allow_password_change: [FILTERED],
name: "momota", email: "momo@momo.com", created_at: "2024-01-06 14:19:53.267464000 +0900",
updated_at: "2024-01-14 15:00:54.710519000 +0900", admin: true, profile: "<フロントから送られて来た更新後の文>">
* avatr（新規追加）の情報はまだ含まれていない。assign_attributes`だけではファイルのアップロードは扱えません。ユ
ーザー情報の更新とファイルアップロードの処理は、2つの異なる処理です。前者はテキストベースの属性を更新し、後者はファ
イルデータを処理する。後段で処理。
------------------------------------------------------------------------------------------------
rails tutorialでは、ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能です。
*before_actionのlogged_in_user、correct_user。
DeviseTokenAuth::RegistrationsControllerのupdateにはデフォルトで、
before_action :set_user_by_token, only: [:destroy, :update]が設定されている。
そのため、「ユーザーのupdateアクションは、サインイン済みで、かつそのユーザー自身のみ実行可能」という設定がデフォル
トで設定されているため、特に自分で実装不要です。
------------------------------------------------------------------------------------------------
`set_user_by_token` :リクエストヘッダに送られた認証トークンをもとに現在の認証ユーザを見つけます。
このメソッドは、トークンが有効な場合は `@resource` インスタンス変数に認証済みユーザーを設定し、トークンが無効な場
合はエラーを返す。
したがって、`update`アクションでは、アクションの実行時に `@resource` が既に認証済みユーザに設定、限定されている。
つまり、`update`アクションは認証済みユーザーの `@resource` を使って更新を行うので、現在の認証済みユーザーのみが
自分を更新できることになる。

================================================================================================
6.4
`avatar_url = generate_avatar_url(@resource)`の挙動について解説する。
. **`generate_avatar_url`メソッドの概要**
- このメソッドは、`ApplicationController`に定義されている。
- 引数`user`にユーザーオブジェクトを受け取り、そのユーザーのアバター画像のURLを生成する。
- メソッド内では、まずユーザーがアバター画像をアップロードしているかどうかをチェックする（`user.avatar.attached?`）。
------------------------------------------------------------------------------------------------
. **アバター画像がある場合の処理**
- ユーザーがアバター画像をアップロードしている場合（`if user.avatar.attached?`）、画像のサイズを調整し
（`resize: "150x150^"`）、中央を基準にクロッピングする（`gravity: "center", crop: "150x150+0+0"`）。
- その後、`rails_representation_url`を使用して、処理された画像のURLを生成する。このURLはフルパスで返される
（`only_path: false`）。
------------------------------------------------------------------------------------------------
. **`generate_avatar_url`メソッドの呼び出し**
- `Api::V1::Auth::RegistrationsController`の`update`アクション内で、
`avatar_url = generate_avatar_url(@resource)`が呼び出される。
- ここで`@resource`は現在のユーザーオブジェクトを指し、このユーザーのアバター画像URLを取得するために使用される。
------------------------------------------------------------------------------------------------
. **使用意図**
- ユーザーがプロフィールを更新する際（例えば、アバター画像を変更したとき）、新しいアバター画像のURLを生成して、それ
をフロントエンドに返すことが目的。
- フロントエンド側では、このURLを使用してユーザーのアバター画像を表示することができる。
------------------------------------------------------------------------------------------------
最終的な@avatar_urlの内容: "http://localhost:3010/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBZ3ciLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--8e33bf229ab5cdf09c12a896f8dbcaa533232ffd/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpRFRFMU1IZ3hOVEJlQmpzR1ZEb01aM0poZG1sMGVVa2lDMk5sYm5SbGNnWTdCbFE2Q1dOeWIzQkpJaEF4TlRCNE1UVXdLekFyTUFZN0JsUT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--5a7879e781efe9585fa988f34f0a2fd2a74b3cfe/momo.jpg"

================================================================================================
6.5
インスタンス変数 (接頭辞に @ を含む) はクラス全体からアクセス可能です。つまり、`@avatar_url` はクラス内のどのメ
ソッドでも使用することができます。これは `render_update_success` で `@avatar_url` がレスポンスに含まれる場
合に重要です。

================================================================================================
6.6
- `super` メソッドは、で@resourceを使用。@avatar_urlは使用していないが、`render_update_success`で使用。
- `@` がない場合、 `avatar_url` はローカル変数になります。ローカル変数は定義されたメソッド内でのみアクセス可能
です。これは `avatar_url` が定義されている `update` メソッド内でのみアクセス可能であることを意味します。
- render_update_success`のような `RegistrationsController` クラスの他のメソッドは `avatar_url` にアク
セスできません。
------------------------------------------------------------------------------------------------
- 最終的なupdateレスポンス: {:status=>"success", :message=>"アカウント情報を変更しました。",
:data=>{"id"=>1, "provider"=>"email", "uid"=>"hiro@hiro.com", "allow_password_change"=>false,
"name"=>"hiro", "email"=>"hiro@hiro.com", "created_at"=>"2024-03-04T16:00:30.578+09:00",
"updated_at"=>"2024-03-05T14:57:59.644+09:00", "admin"=>true, "profile"=>""}, :avatar_url=>nil}
=end
