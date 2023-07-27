Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 1 api/v1/auth
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations',
        sessions: 'api/v1/auth/sessions',
      }
      # 3
      root 'home_pages#home'
      # api/v1/authenticated_users
      resources :authenticated_users, only: %i[index]
      # api/v1/users
      resources :users, only: %i[index show] do
        # 2
        member do
          get :following, :followers, :is_following
          get 'likes/:post_id', to: 'likes#liked'
        end
      end
      # api/v1/posts
      resources :posts do, only: [:index, :show, :create, :destroy] do
        # 4 api/v1/posts/:post_id/likes
        resources :likes, only: [:create, :destroy]
      end

      # api/v1/admin/users
      namespace :admin do
        resources :users, only: [:destroy]
      end

      # api/v1/relationships
      resources :relationships, only: [:create, :destroy]
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
mount_devise_token_auth_for
deviseのdevise_forに相当

'User'
DeviseのUserモデルに対する設定
at: 'auth'
Deviseのトークン認証機能をマウントするエンドポイントのパスを /auth に設定します。
controllers:
devise_token_authで使用するコントローラーを指定します。
registrations: 'api/v1/auth/registrations'
ユーザーの登録に関する registrationsコントローラーを api/v1/auth/registrations_controller.rb に設定します。

mount_devise_token_auth_for 'User', at: 'auth', controllers: { registrations: 'api/v1/auth/registrations' }
という設定は、DeviseTokenAuthライブラリのモジュールを指定したモデル（この場合は'User'）とパス（'auth'）にマウン
トする設定です。ここでは特にregistrationsコントローラーについてカスタムのコントローラーを指定しています。

mount_devise_token_auth_for 'User':
mount_devise_token_auth_forはDeviseTokenAuthの全てのルーティングを設定します。この場合、'User'モデルに対し
て設定しています。つまり、DeviseTokenAuthの認証機能を'User'モデルで使用するためのルーティングを作成します。
at: 'auth'
atオプションは、指定したパス（この場合は'auth'）にDeviseTokenAuthのルーティングをマウントします。つまり、'auth'
というパスがDeviseTokenAuthの機能に関連するURLのプレフィクスになります。
controllers: { registrations: 'api/v1/auth/registrations' }:
controllersオプションは、DeviseTokenAuthのデフォルトのコントローラーをカスタムのコントローラーにオーバーライド
します。この場合、registrationsコントローラー（ユーザーの登録に関する処理を担当）をカスタムの
'api/v1/auth/registrations'コントローラーにオーバーライドしています。

この設定全体をまとめると、「'User'モデルのためのDeviseTokenAuthの認証機能を、'auth'というパスで利用し、その際
のユーザー登録に関する処理はカスタムの'api/v1/auth/registrations'コントローラーで行う」という意味になります。

------------------------------------------------------------------------------------------------
作成されるコントローラー（DeviseTokenAuth内で定義）
DeviseTokenAuth::SessionsController
DeviseTokenAuth::RegistrationsController
DeviseTokenAuth::ConfirmationsController
DeviseTokenAuth::PasswordsController
DeviseTokenAuth::OmniauthCallbacksController

@          @@          @@          @@          @@          @@          @@          @@          @
Path
@          @@          @@          @@          @@          @@          @@          @@          @
作成されるルート
[registrations: 'auth/registrations']にマウントされた結果

Prefix Verb                     URI Pattern                                     Controller#Action
new_api_v1_user_session         GET    /api/v1/auth/sign_in(.:format)           api/v1/auth/sessions#new
api_v1_user_session             POST   /api/v1/auth/sign_in(.:format)           api/v1/auth/sessions#create
destroy_api_v1_user_session     DELETE /api/v1/auth/sign_out(.:format)          api/v1/auth/sessions#destroy

new_api_v1_user_password        GET    /api/v1/auth/password/new(.:format)      devise_token_auth/passwords#new
edit_api_v1_user_password       GET    /api/v1/auth/password/edit(.:format)     devise_token_auth/passwords#edit
api_v1_user_password            PATCH  /api/v1/auth/password(.:format)          devise_token_auth/passwords#update
                                PUT    /api/v1/auth/password(.:format)          devise_token_auth/passwords#update
                                POST   /api/v1/auth/password(.:format)          devise_token_auth/passwords#create

cancel_api_v1_user_registration GET    /api/v1/auth/cancel(.:format)            api/v1/auth/registrations#cancel
new_api_v1_user_registration    GET    /api/v1/auth/sign_up(.:format)           api/v1/auth/registrations#new
edit_api_v1_user_registration   GET    /api/v1/auth/edit(.:format)              api/v1/auth/registrations#edit
api_v1_user_registration        PATCH  /api/v1/auth(.:format)                   api/v1/auth/registrations#update
                                PUT    /api/v1/auth(.:format)                   api/v1/auth/registrations#update
                                DELETE /api/v1/auth(.:format)                   api/v1/auth/registrations#destroy
                                POST   /api/v1/auth(.:format)                   api/v1/auth/registrations#create

api_v1_auth_validate_token      GET    /api/v1/auth/validate_token(.:format)    devise_token_auth/token_validations#validate_token

------------------------------------------------------------------------------------------------
api_v1_authenticated_users      GET    /api/v1/authenticated_users(.:format)    api/v1/authenticated_users#index
------------------------------------------------------------------------------------------------
api_v1_todos                    GET    /api/v1/todos(.:format)                  api/v1/todos#index
                                POST   /api/v1/todos(.:format)                  api/v1/todos#create
api_v1_todo                     GET    /api/v1/todos/:id(.:format)              api/v1/todos#show
                                PATCH  /api/v1/todos/:id(.:format)              api/v1/todos#update
                                PUT    /api/v1/todos/:id(.:format)              api/v1/todos#update
                                DELETE /api/v1/todos/:id(.:format)              api/v1/todos#destroy

------------------------------------------------------------------------------------------------
api_v1_users                    GET    /api/v1/users(.:format)                  api/v1/users#index
api_v1_user                     GET    /api/v1/users/:id(.:format)              api/v1/users#show

------------------------------------------------------------------------------------------------
api_v1_admin_user               DELETE /api/v1/admin/users/:id(.:format)        api/v1/admin/users#destroy

------------------------------------------------------------------------------------------------

active_storage/blobs/redirect#show

rails_blob_representation       GET    /rails/active_storage/representations/redirect/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations/redirect#show
rails_blob_representation_proxy GET    /rails/active_storage/representations/proxy/:signed_blob_id/:variation_key/*filename(.:format)    active_storage/representations/proxy#show
                                GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format)          active_storage/representations/redirect#show
rails_disk_service              GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                                       active_storage/disk#show
update_rails_disk_service       PUT    /rails/active_storage/disk/:encoded_token(.:format)                                               active_storage/disk#update
rails_direct_uploads            POST   /rails/active_storage/direct_uploads(.:format)
================================================================================================
deviseのdevise_forメソッド
ルーティング設定の1つです。Deviseが提供する様々なユーザー認証機能にアクセスするためのURLが自動的に生成されます。

devise_for :users
devise_for
Deviseによって提供されるルーティングを作成するためのメソッド。
:users
Deviseによって認証するためのモデル名を指定。ここではユーザーのモデル名である "User" を指定している

devise_for :usersでcontrollersオプションを指定することで、デフォルトのコントローラ以外を使用したい場合にカス
タマイズできます。
devise_for :users, controllers: {
  sessions: 'users/sessions',
  passwords: 'users/passwords',
  registrations: 'users/registrations',
  confirmations: 'users/confirmations',
  unlocks: 'users/unlocks'
}
*Deviseが提供するデフォルトのコントローラ名と、カスタマイズしたコントローラ名
sessions: Devise::SessionsController -> users/sessions
passwords: Devise::PasswordsController -> users/passwords
registrations: Devise::RegistrationsController -> users/registrations
confirmations: Devise::ConfirmationsController -> users/confirmations
unlocks: Devise::UnlocksController -> users/unlocks

------------------------------------------------------------------------------------------------
devise_forとmount_devise_token_auth_forは、それぞれDeviseとDevise Token Auth認証システム用のルートを生
成するために使用されます。これらのシステムはどちらもRailsアプリケーションの認証ソリューションを提供します。

DeviseとDevice Token Authの認証システム用のルートを生成するために使用されます。Devise Token Authを使用する
場合、サーバーはセッション状態を保持せず、代わりにクライアントから送信されたトークンに依存して各リクエストを認証し
ます。
devise_forは従来のRailsアプリケーションの認証ソリューションとしてよく使われています。登録、サインイン、パスワー
ド回復など、さまざまなDeviseコントローラのアクションに対応したルートを生成します。

------------------------------------------------------------------------------------------------
devise_token_auth は、devise に基づいて構築されています。これにより、APIベースのアプリケーションでトークンベー
スの認証を提供します。そのため、devise_token_auth の動作は、基本的に devise の動作に密接に関連しています。

registrations#create アクションは、ユーザー登録（サインアップ）のプロセスを処理します。このアクションが呼び出さ
れると、以下の手順が実行されます：
新しいユーザーオブジェクトを作成し、リクエストから受け取ったパラメータでオブジェクトを初期化します。
ユーザーオブジェクトを検証して、指定された情報が正しく、モデルのバリデーションに合格することを確認します。
検証に合格した場合、新しいユーザーをデータベースに保存します。
devise_token_auth では、ユーザー登録時にユーザーが作成されるだけでなく、アクセストークンも生成されます。

------------------------------------------------------------------------------------------------
devise_forの結果

ログイン関連
# ログインページ
new_user_session GET            /users/sign_in(.:format)        devise/sessions#new
user_session POST               /users/sign_in(.:format)        devise/sessions#create
destroy_user_session DELETE     /users/sign_out(.:format)       devise/sessions#destroy

------------------------------------------------------------------------------------------------
パスワード関連
# パスワードページ
# Forgot your password?の画面（パスワード再設定のメール送信の画面）にいく
new_user_password GET           /users/password/new(.:format)   devise/passwords#new
# パスワード再設定の画面(パスワード再設定メールからでないとアクセスできない)
edit_user_password GET          /users/password/edit(.:format)  devise/passwords#edit
user_password PATCH             /users/password(.:format)       devise/passwords#update
              PUT               /users/password(.:format)       devise/passwords#update
              POST              /users/password(.:format)       devise/passwords#create

------------------------------------------------------------------------------------------------
サインアップ関連

cancel_user_registration GET    /users/cancel(.:format)         devise/registrations#cancel
# サインアップページ
new_user_registration GET       /users/sign_up(.:format)        devise/registrations#new
# ユーザー情報の設定の画面（メアドやパスワード）
edit_user_registration GET      /users/edit(.:format)           devise/registrations#edit
user_registration PATCH         /users(.:format)                devise/registrations#update
                  PUT           /users(.:format)                devise/registrations#update
                  DELETE        /users(.:format)                devise/registrations#destroy
                  POST          /users(.:format)

------------------------------------------------------------------------------------------------
devise_for :usersで自動的に生成されるURLヘルパーメソッド

# ログイン・ログアウト
new_user_session_path             # ログイン画面を表示するGETリクエスト用のパス
user_session_path                 # ログイン処理を行うPOSTリクエスト用のパス
destroy_user_session_path         # ログアウト処理を行うDELETEリクエスト用のパス  /users/sign_out

# ユーザー登録・編集・削除
new_user_registration_path        # ユーザー登録画面を表示するGETリクエスト用のパス
user_registration_path            # ユーザー登録処理を行うPOSTリクエスト用のパス
edit_user_registration_path       # ユーザー編集画面を表示するGETリクエスト用のパス
user_path                          # ユーザー情報を表示するGETリクエスト用のパス

# パスワードリセット
new_user_password_path            # パスワードリセット画面を表示するGETリクエスト用のパス
edit_user_password_path           # パスワード再設定画面を表示するGETリクエスト用のパス
user_password_path                # パスワード再設定処理を行うPUTリクエスト用のパス

================================================================================================
postのルート

api_v1_posts GET    /api/v1/posts(.:format)     api/v1/posts#index
            POST   /api/v1/posts(.:format)      api/v1/posts#create
api_v1_post GET    /api/v1/posts/:id(.:format)  api/v1/posts#show
            PATCH  /api/v1/posts/:id(.:format)  api/v1/posts#update
            PUT    /api/v1/posts/:id(.:format)  api/v1/posts#update
            DELETE /api/v1/posts/:id(.:format)  api/v1/posts#destroy
------------------------------------------------------------------------------------------------
生成されるパスのヘルパーメソッド
- `api_v1_posts`: 対応するパスは`/api/v1/posts`で、HTTPメソッドは`GET`。全てのpostを取得するためのパス。
- `new_api_v1_post`: 対応するパスは`/api/v1/posts/new`で、HTTPメソッドは`GET`。新規post作成画面のためのパ
ス（APIではあまり使用されません）。
- `edit_api_v1_post`: 対応するパスは`/api/v1/posts/:id/edit`で、HTTPメソッドは`GET`です。post編集画面のた
めのパスです（APIではあまり使用されません）。
- `api_v1_post`: 対応するパスは`/api/v1/posts/:id`で、HTTPメソッドは`GET`です。特定のpostを取得するパス。
- `api_v1_posts`: 対応するパスは`/api/v1/posts`で、HTTPメソッドは`POST`です。新規postを作成するパス。
- `api_v1_post`: 対応するパスは`/api/v1/posts/:id`で、HTTPメソッドは`PATCH`または`PUT`です。特定のpostを
更新するためのパスです。
- `api_v1_post`: 対応するパスは`/api/v1/posts/:id`で、HTTPメソッドは`DELETE`です。特定のpostを削除するた
めのパスです。

================================================================================================
2
`member`
Railsのルーティングで使用されるメソッドで、`resources`ブロック内で使用されます。
これは、そのリソースの特定のメンバー(つまり、特定のIDを持つレコード)に対する追加のルートを定義します。
`member`はブロックとして引数を取り、そのブロック内でHTTP動詞メソッド(`get`, `post`, `patch`, `put`,
  `delete`)を使用してルートを定義します。
  今回のケースでは、`:following`と`:followers`という名前の`get`リクエストを受け取るルートが定義されています。
------------------------------------------------------------------------------------------------
作成されるルートパスは以下の2つとなります。
- `/api/v1/users/:id/following`: 指定したIDのユーザーがフォローしているユーザーのリストを取得します。
- `/api/v1/users/:id/followers`: 指定したIDのユーザーをフォローしているユーザーのリストを取得します。
これらの`:id`部分は、対象となるユーザーのIDに置き換えられます。
------------------------------------------------------------------------------------------------
member do ブロック内に記述された get :following は、/api/v1/users/:id/following というパスに対する GET
リクエストが送られたとき、そのリクエストを UsersController の following アクションにルーティングします。
同様に、get :followers は /api/v1/users/:id/followers というパスに対する GET リクエストを followers アク
ションにルーティングします。
------------------------------------------------------------------------------------------------
is_following
ユーザーが特定のユーザーをフォローしているか確認するためのAPIエンドポイント
------------------------------------------------------------------------------------------------
GET api/v1/users/1/following following following_user_path(1)
GET api/v1/users/1/followers followers followers_user_path(1)
GET api/v1/users/:id/is_following

================================================================================================
3
root メソッドを使ってルート URL "/" をコントローラーのアクションに紐付け。
それ以外にも、生のURLではなく、名前付きルートを使ってURLを参照することができるようになります。
例えばルート URL を定義すると、root_path や root_url といったメソッドを通して、URL を参照することができます。
ちなみに前者はルート URL 以下の文字列を、後者は完全な URL の文字列を返し ます。
root_path -> '/'
root_url -> 'https://www.example.com/'
なお、Rails チュートリアルでは一般的な規約に従い、基本的には_path 書式を使い、リダイレクトの場合のみ_url 書式を使
うようにします。これは HTTP の標準としては、リダイレクトのときに完全な URL が要求されるためです。ただしほとんどのブ
ラウザでは、どちらの方法でも動作します。

/home_pages/home というURLに対するgetリクエストを、HomePagesコントローラのhomeアクションと結びつけています。
get 'home_pages/home'

================================================================================================
4
likesがpostsにネストされる形でroutesが定義されています。これにより、ある投稿(post)に対するいいね(like)を作成し
たり削除したりする際に、どの投稿に対する操作なのかをURLのパスから直接判断できます。この形式は、RESTfulなURL設計の
一部として推奨されています。
------------------------------------------------------------------------------------------------
以下のようにルートが作成されます:

1. いいねを作成するためのルート:`/posts/:post_id/likes`, HTTPメソッド: `POST`

2. いいねを削除するためのルート:`/posts/:post_id/likes/:id`, HTTPメソッド: `DELETE`
------------------------------------------------------------------------------------------------



@          @@          @@          @@          @@          @@          @@          @@          @
基本知識
@          @@          @@          @@          @@          @@          @@          @@          @
Devise Token Authの各コントローラー。アクションの実装はドキュメントを参照

DeviseTokenAuth::RegistrationsController
DeviseTokenAuth::SessionsController
DeviseTokenAuth::PasswordsController
DeviseTokenAuth::ConfirmationsController
DeviseTokenAuth::OmniauthCallbacksController
DeviseTokenAuth::TokenValidationsController

================================================================================================
Deviseの各コントローラーアクション

Devise::SessionsController
new: ログイン画面を表示するアクション
create: ログイン処理を行うアクション
destroy: ログアウト処理を行うアクション

Devise::RegistrationsController
new: 新規登録画面を表示するアクション
create: 新規登録処理を行うアクション
edit: 登録情報編集画面を表示するアクション
update: 登録情報編集処理を行うアクション
destroy: アカウント削除処理を行うアクション

Devise::PasswordsController
new: パスワード再設定画面を表示するアクション
create: パスワード再設定用のメールを送信するアクション
edit: パスワード再設定画面を表示するアクション
update: パスワード再設定処理を行うアクション

Devise::ConfirmationsController
new: アカウント認証用のメール再送画面を表示するアクション
create: アカウント認証用のメールを再送するアクション
show: アカウント認証完了画面を表示するアクション

Devise::UnlocksController
new: アカウントロック解除用のメール再送画面を表示するアクション
create: アカウントロック解除用のメールを再送するアクション
show: アカウントロック解除完了画面を表示するアクション

Devise::OmniauthCallbacksController
=end