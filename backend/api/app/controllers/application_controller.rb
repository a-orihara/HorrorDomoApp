# 1
class ApplicationController < ActionController::API
  # 4
  # before_action :authenticate_api_v1_user!

  # 2
  # Deviseコントローラーであれば、アクション実行前にconfigure_permitted_parametersメソッドを呼び出す。
  before_action :configure_permitted_parameters, if: :devise_controller?

  # current_api_v1_userなどの Devise Token Auth のヘルパーメソッドが利用可能
  include DeviseTokenAuth::Concerns::SetUserByToken

  # 3
  protected

    # 5 6
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
      devise_parameter_sanitizer.permit(:account_update, keys: [:name, :profile, :avatar])
    end

  private

    # 7
    def generate_avatar_url(user)
      # 8.1
      if user.avatar.attached?
        # 8.2
        variant = user.avatar.variant(resize: "150x150^", gravity: "center", crop: "150x150+0+0")
        # 8.3
        logger.info "Variantの中身はこれだ: #{variant.inspect}"
        rails_representation_url(variant, only_path: false)
      end
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
法です。Ruby on Railsアプリケーションでコードの繰り返しを避け、再利用性を促進する方法です。moduleみたいなもの

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
protected
deviseのドキュメントはprotectedで記述されている。
Rubyのアクセス制御キーワードの1つで、このキーワード以下に定義されたメソッドは、そのクラス自身またはその子クラスから
のみアクセス可能になります。このメソッドを外部から呼び出されないようにして、セキュリティを確保しています。
configure_permitted_parametersメソッドがprotectedメソッドとして定義されていることから、このメソッドは、
ApplicationControllerとその子クラスからのみアクセス可能になります。
================================================================================================
4
:authenticate_api_v1_user!
一般的にApplicationControllerに記載。
ApplicationController にこの before_action を追加することによって、アプリの全てのコントローラーがログインし
たユーザーだけにアクセスを許可するように設定されます。なので、実際には使えない。
*使用する際は、個別のコントローラーに記載する。

================================================================================================
5
デフォルトのフィールド：Deviseでは、emailとpasswordがデフォルトで必要なフィールドとして設定されています。
sign_upアクションでは、デフォルトのemailとpasswordに加えて、追加のパラメータ（例：:name）を許可したい場合にこの
メソッドを使います。
------------------------------------------------------------------------------------------------
configure_permitted_parameters
deviseのドキュメントにこのメソッド名で記載されている、ストロングパラメータを設定するためのメソッド。
Deviseで許可するストロングパラメータを設定するためのメソッド。ドキュメントでもApplicationControllerに記述。
メソッド名はconfigure_permitted_parametersでなくても構いませんが、deviseのドキュメントに従う。
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
keysオプションを使用すると、特定のパラメータに対して許可を指定することができます。上記の例では、keys: [:name]
を指定することで、nameパラメータに対する許可を追加しています。
------------------------------------------------------------------------------------------------
configure_sign_up_paramsはこのapp/controllers/application_controller.rbに記載。
------------------------------------------------------------------------------------------------
configure_sign_up_paramsという名前がdeviseのデフォの名前だが、任意でいい。
その場合、devise_token_authにsign_up_paramsがあるので、これを使う。

DeviseTokenAuth::RegistrationsControllerが提供するメソッド。
サインアップ時に必要なパラメータを設定するメソッド。
sign_up_paramsメソッドは、サインアップ時に登録できるカラムを指定するために使用されます。具体的には、paramsオブ
ジェクトからemail、password、password_confirmation、nameの4つのパラメータのみを取得します。
sign_up_paramsメソッドの目的は、セキュリティ上の理由から、不要な情報が含まれている場合に備えて、許可されたパラメ
ータ以外は受け付けないようにすることです。
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
これにより、任意のユーザーが自分自身にアプリケーションの管理者権限を与えることを防止できます。

================================================================================================
6
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
7
アバターが添付されている場合、バリアントURLを生成する。自作メソッド。
variant URL:元の画像ではなく、リサイズされたバージョンの画像へのリンクです。

================================================================================================
8.1
. `if user.avatar.attached?`の意味:
- このコードは、`User`モデルの`avatar`属性（Active Storageを介してアタッチされたファイル）が存在するかどうか
をチェックします。
- `.attached?`メソッドは、ユーザーがアバター画像をアップロード（アタッチ）している場合に`true`を返し、そうでない
場合は`false`を返します。
------------------------------------------------------------------------------------------------
. バリアントURLとは:
- variant URL:元の画像ではなく、リサイズされたバージョンの画像へのリンクです。
------------------------------------------------------------------------------------------------
「else節がない場合、if文がfalseだった時にはnilが返される」という特性を活用して、else節で単純にnilを返すのではな
く、else節自体を削除出来る。
if user.avatar.attached?
  variant = user.avatar.variant(resize: "100x100^", gravity: "center", crop: "100x100+0+0")
  rails_representation_url(variant, only_path: false)
else
  nil
end
------------------------------------------------------------------------------------------------
- 実際のuserの中身を、[logger.info "generate_avatar_url(user)の中身: #{user.inspect}"]で見ても、その中
のuser情報にavatar情報はない。しかしこれはログに表示されないだけ。実際はあるので、後続のifはtrueとして処理される。
- if文の中の処理では、ログを確認すると、generate_avatar_urlで、ActiveStorageテーブルにクエリを実行してユーザ
ーのavatrに関連付けられたblobを見つけ、その情報を使ってアバターのURLを生成している。
- `これは `user.inspect` が `User` オブジェクトの属性を現在サーバーのメモリに読み込まれている状態で表示し、ア
バターのような関連ファイルを自動的に含まないためです。
------------------------------------------------------------------------------------------------
- 実際のuserの中身
#<User id: 1, provider: "email", uid: "momo@momo.com", allow_password_change: [FILTERED],
name: "momo", email: "momo@momo.com", created_at: "2024-01-06 14:19:53.267464000 +0900",
updated_at: "2024-01-16 16:07:36.668582000 +0900", admin: true, profile: "<プロフィール文>">

================================================================================================
8.2
variant
Active Storageで画像のバリアント（変形）を作成するためのメソッドです。このメソッドは、指定した変形オプションに基
づいて画像を変形し、変形後の画像のURLやパスを取得します。
戻り値はVariantオブジェクトで、変形対象の画像ファイルへの参照や、変形後の画像のURLやパスを生成するためのメソッドが
含まれる。
この変換はImageMagickソフトウェアによって行われる
------------------------------------------------------------------------------------------------
variantの中身
#<ActiveStorage::VariantWithRecord:0x00007f301b596058 @blob=#<ActiveStorage::Blob id: 71,
key: "cllqr1augn2m6eghvjibt5w8ym7n", filename: "koko.jpg", content_type: "image/jpeg",
metadata: {"identified"=>true, "width"=>360, "height"=>480, "analyzed"=>true},
service_name: "local", byte_size: 37111, checksum: "hwa10lUmyxXcr0OZWxVGqQ==",
created_at: "2024-01-16 16:07:36.000000000 +0900">,
@variation=#<ActiveStorage::Variation:0x00007f301b58f460 @transformations={:format=>"jpg", :resize=>"150x150^",
:gravity=>"center", :crop=>"150x150+0+0"}>>

================================================================================================
8.3
. rails_representation_url(variant, only_path: false)
- variant` は画像のリサイズ後に生成されたオブジェクト。リサイズ後の情報を持つ。
- Active Storageで作成したvariantのURLを生成するためのRailsのヘルパーメソッド。variantのURLの生成には、
url_forではなくこちらを使う。リサイズしてトリミングしたアバター画像のURLを、variantから生成する。このパスでリサ
イズ後の画像を表示する。
- only_path: falseはオプションで、生成されるURLが絶対パスとなることを指定しています。
- railsへフロントからアクセスするので、絶対パスでないとアクセス出来ない。
絶対パス:"http://localhost:3000/rails/active_storage/representations/redirect/
相対パス:"/rails/active_storage/representations/redirect""
------------------------------------------------------------------------------------------------
引数(variant, only_path: true)の解説
variant：バリアントとして作成する画像の指定です。この引数には、変形オプション（例えば、リサイズ、重心、クロップなど
）が含まれています。
only_path: true：オプション引数で、生成されるURLを相対パスとして取得することを指定します。相対パスを使用すると、
ホスト名やドメインを含まないURLが生成されます。
------------------------------------------------------------------------------------------------
. **Active Storageでの画像の表示:**。
- 簡単に言うと、RailsのActive Storageは画像ファイルを保存し、これらのファイルにアクセスするためのパス（URL）を
提供することで画像を管理・表示します。画像をアップロードすると、Active Storageは画像ファイルを保存場所（サーバや
クラウドサービスのようなもの）に保存します。その後、その画像に固有のパスまたはURLが生成されます。このURLをアプリケ
ーションで使用して、ウェブページやJSON応答などで画像を表示。このようにして、画像は一旦保存され、画像を表示する必要
がある場所では、その画像にアクセスするためのパスが使用されます。
------------------------------------------------------------------------------------------------
. **Active Storageでのサイズ変更またはバリアントの作成
- 画像のサイズを変更したり、バリアント（サムネイルのような、元の画像の変更 バージョン）を作成するとき、
Active Storageは元の画像を変更しません。代わりに、指定された変更（サイズ変更など）を加えた画像の新バージョンを作
成し、この新バージョンの一意のパスを生成します。
- 元の画像はまだ存在し、元のパスを保持します。バリアントには別のパスがあります。アプリケーションでバリアント (リサ
イズされた画像) を表示したいときは、このバリアントのために生成されたパスを使います。この仕組みにより、元の画像は
変更されずに利用可能なままで、必要に応じて異なるバージョンの画像を使うことができます。

@          @@          @@          @@          @@          @@          @@          @@          @
基本理解
@          @@          @@          @@          @@          @@          @@          @@          @

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
