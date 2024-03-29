# 1
class Api::V1::AuthenticatedUsersController < ApplicationController

  # 2 ログイン済みのユーザーが存在するかをチェックし、存在する場合はそのユーザーの情報を返す処理を自作
  def index
    logger.info "indexアクションが発火"
    # current_api_v1_user:現在サインインしているUser、または有効になっていなければnilを返す
    @user = current_api_v1_user
    # @userがnilの場合はエラー処理を行う
    if @user
      avatar_url = generate_avatar_url(@user)
      render json: {
        is_login: true,
        # 3
        data: @user.as_json.merge(avatar_url: avatar_url)
      }
    else
      # 404
      render json: { is_login: false, message: "ユーザーが存在しません" }
    end
  end

end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
ApplicationControllerが、include DeviseTokenAuth::Concerns::SetUserByTokenしているので、
ApplicationController を継承した全てのコントローラーで、current_api_v1_userなどの Devise Token Auth の
ヘルパーメソッドが利用可能になります。

================================================================================================
2
一般にこのメソッドの返り値は、
id: ユーザーのID
provider: 認証プロバイダーの種類（例えば、"email"や"facebook"など）
uid: ユーザーの識別子（例えば、メールアドレスやSNSのアカウント名など）
name: ユーザーの名前
email: ユーザーのメールアドレス
created_at: ユーザーのアカウント作成日時
updated_at: ユーザー情報の最終更新日時
------------------------------------------------------------------------------------------------
上記のコードは、ログイン済みのユーザーの存在をチェックして、ユーザーが存在する場合はログイン状態であることを示す
JSONレスポンスを返し、存在しない場合はログイン状態でないことを示すJSONレスポンスを返しています。
このコードの利用目的は、現在のログイン状態を確認し、必要に応じて処理を実行することです。この場合、ログイン状態を
チェックして、フロントエンド側でログイン・非ログインに応じた表示をするために利用されます。
このようなログイン状態のチェック処理は、一般的によく見られる設定です。ログインしているかどうかによって、表示内容
を切り替えたり、権限に基づいた処理を制御したりすることができます。また、ログイン状態を保持するために、セッション
やトークンなどの技術を利用する場合があります。
------------------------------------------------------------------------------------------------
「ヘルパーメソッド」とは、Railsアプリケーション内で再利用可能な小さなメソッドのことであり、アプリケーションのビジ
ネスロジックを記述するコントローラーからビューに渡す値を整形する、フォーマットする、あるいはテキストを処理するなど
、さまざまな用途に使われます。
current_api_v1_userというヘルパーメソッドは、devise_token_auth gemによって提供されるものであり、現在ログイ
ンしているユーザーを取得するために使用されます。このコードは、ユーザーがログインしている場合には、そのユーザーの情
報を含むJSONレスポンスを返し、ログインしていない場合にはエラーメッセージを含むJSONレスポンスを返します。
------------------------------------------------------------------------------------------------
. **Devise Token Authについて**
- Devise Token Authは、ユーザー認証情報をCookieではなくHTTPヘッダーに含める方式を採用しており、これによりAPI
主体のアプリケーションでの認証を効率的に行うことができる。
- Devise Token Authは、`access-token`、`client`、`expiry`、`uid`などの認証情報をヘッダーに含め、これらを
用いてユーザー認証を行う。
- `token-type`や`authorization`はOAuth2認証プロトコルで使用されるが、Devise Token Authの主な実装では必須
ではない。
------------------------------------------------------------------------------------------------
. **`Api::V1::AuthenticatedUsersController`の`index`アクションについて**
- このアクションは、`current_api_v1_user`ヘルパーメソッドを使用して現在ログインしているユーザーを取得し、その
ユーザーが存在するかどうかをチェックする。
- ユーザーが存在すれば、そのユーザーの情報とアバターURLを含むJSONをレスポンスとして返し、存在しなければログイン状
態でないというメッセージを含むJSONを返す。
- Devise Token Authを使用する場合、一般にSessionsコントローラーを自作する必要はなく、提供されているヘルパーメ
ソッドやコントローラーを利用することで、ログイン済みのユーザー情報を容易に取得できる。
------------------------------------------------------------------------------------------------
. **Devise Token Authの認証処理**
- Devise Token Authでは、ログイン時にアクセストークン、`uid`、`client`、`expiry`などの情報を発行し、これらを
HTTPヘッダーに含める。
- リクエストごとに、ヘッダーから`uid`、`client`、`access-token`を取得し、これらを基に認証を行う。
- ログアウト時には、これらの認証情報をヘッダーから削除する。
------------------------------------------------------------------------------------------------
. **Devise Token Authの主要なヘルパーメソッド**
- `authenticate_user!`：認証情報を取得し、認証されたユーザーを返す。認証に失敗した場合はエラーを返す。
- `current_api_v1_user`：現在のログインユーザーを返す。ログインしていない場合は`nil`を返す。
- `user_signed_in?`：ログインしているかどうかを判定し、`true`または`false`を返す。
------------------------------------------------------------------------------------------------
. **Api::V1::Auth::SessionsControllerの自作について**
- Devise Token Authでは、セッション情報をCookieではなくHTTPヘッダーに含めるため、特定の要件やカスタマイズされ
た動作が必要な場合、独自の`SessionsController`を実装することがある。
- ただし、Devise Token Authのデフォルトのコントローラーでも、ログイン状態の確認やユーザー情報の取得は可能であり、
独自のコントローラー作成は常に必要ではない。
------------------------------------------------------------------------------------------------
. **`Api::V1::AuthenticatedUsersController`の役割**
- このコントローラーは、`current_api_v1_user`を使用して現在ログインしているユーザーの存在を確認し、存在すればそ
のユーザーの情報を含むレスポンスを返す。
- ユーザーがログインしていない場合は、ログインしていないことを示すレスポンスを返す。

================================================================================================
3
as_json
Rubyのメソッドであり、Active RecordのオブジェクトをJSONに変換する。
------------------------------------------------------------------------------------------------
merge
Rubyのメソッドであり、2つのハッシュを1つにマージする。
引数として別のハッシュを取り、元のハッシュに追加または更新します。
------------------------------------------------------------------------------------------------
avatar.attached?
railsのActive Storageで使用されるメソッドであり、アップロードされたファイルがアタッチされているかどうかを判断す
る。戻り値は、アバター画像が添付されている場合にtrue、添付されていない場合にfalseです。
------------------------------------------------------------------------------------------------
url_for
Railsで定義されているヘルパーメソッドで、与えられたリソースから、blobの永続的なURLを生成するURLを生成する。
これは、blobのRedirectControllerにルーティングされるblobのsigned_idを持つURL（署名付きURL）を生成します。
RedirectControllerは、実際のサービスエンドポイントにリダイレクトします。このリダイレクトにより、サービスの URL
と実際の URL が切り離され、たとえば異なるサービスの添付ファイルをミラーリングして高可用性を実現することができます。
このリダイレクトには、5分間のHTTP有効期限があります。

引数として生成したいURLの情報を取ります。この場合は、current_api_v1_user.avatarで、avatarはActive Storage
でアタッチされたファイルオブジェクトを表します。

url_for(current_api_v1_user.avatar)が返す URL は、Blob オブジェクトの属性に直接格納されているわけではあり
ません。url_forメソッドは、Active Storage が内部的に保持している情報を使って、Attachment オブジェクトのBlob
オブジェクトに紐付けられた URL を生成します。
具体的には、`url_for` は以下の情報を組み合わせて URL を生成します。
1. ストレージサービスの設定情報（例：ディスク、S3 など）
2. Blob オブジェクトの `key` 属性
`url_for` が実際に URL を生成する際、ストレージサービスの設定情報と Blob オブジェクトの `key` 属性を組み合わせ
て、実際にファイルが保存されている場所の URL を生成します。このため、Blob オブジェクトの属性に直接 URL が格納され
ているわけではなく、`url_for` メソッドがその URL を動的に生成して返す形になります。
------------------------------------------------------------------------------------------------
current_api_v1_user.avatar
このavatarはメソッドではなく、Active Storage の Attachment オブジェクトを返します。Attachment オブジェクト
は、Blob オブジェクトへの参照とレコードの関連を持っています。
------------------------------------------------------------------------------------------------
avatar_url: current_api_v1_user.avatar.attached? ? url_for(current_api_v1_user.avatar) : nil
「current_api_v1_user.avatarがアタッチされている場合は、そのURLを生成して、avatar_urlというキーでハッシュに
追加する。
そうでなければ、avatar_urlというキーにnilを追加する」。つまり、現在のログインユーザーにアバターがアタッチされてい
る場合は、そのアバターのURLを追加し、アタッチされていない場合はnilを追加します。
これにより、JSONで返すデータに、現在のログインユーザーのアバターのURLを含めることができます。

@          @@          @@          @@          @@          @@          @@          @@          @
デフォルト
@          @@          @@          @@          @@          @@          @@          @@          @
new, create, destroy
=end
