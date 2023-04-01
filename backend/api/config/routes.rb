Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 1
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
mount_devise_token_auth_for

devise_token_authの、API認証用のルーティングを設定するメソッドです。
Userモデルに対して、指定したルーティングパス（atオプション）に認証用のルーティングを設定することができます。例え
ば、at: 'auth'と指定すると、localhost:3000/auth/sign_inのようなURLで認証機能にアクセスできるようになりま
す。
また、このメソッドを呼び出すことで、devise_token_authに含まれる認証用の下記コントローラーが自動的に作成されます。
これにより、APIの認証に必要な機能を簡単に実装することができます。
------------------------------------------------------------------------------------------------
作成されるコントローラー
DeviseTokenAuth::SessionsController
DeviseTokenAuth::RegistrationsController
DeviseTokenAuth::ConfirmationsController
DeviseTokenAuth::PasswordsController
DeviseTokenAuth::OmniauthCallbacksController
================================================================================================
作成されるルート
[registrations: 'auth/registrations']にマウントされた結果

Prefix Verb                     URI Pattern                                     Controller#Action
new_api_v1_user_session         GET    /api/v1/auth/sign_in(.:format)           devise_token_auth/sessions#new
api_v1_user_session             POST   /api/v1/auth/sign_in(.:format)           devise_token_auth/sessions#create
destroy_api_v1_user_session     DELETE /api/v1/auth/sign_out(.:format)          devise_token_auth/sessions#destroy

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
api_v1_sessions                 GET    /api/v1/sessions(.:format)    api/v1/sessions#index

------------------------------------------------------------------------------------------------
api_v1_todos                    GET    /api/v1/todos(.:format)                  api/v1/todos#index
                                POST   /api/v1/todos(.:format)                  api/v1/todos#create
api_v1_todo                     GET    /api/v1/todos/:id(.:format)              api/v1/todos#show
                                PATCH  /api/v1/todos/:id(.:format)              api/v1/todos#update
                                PUT    /api/v1/todos/:id(.:format)              api/v1/todos#update
                                DELETE /api/v1/todos/:id(.:format)              api/v1/todos#destroy

--------------------------------------------------------------------------------------------------



=end