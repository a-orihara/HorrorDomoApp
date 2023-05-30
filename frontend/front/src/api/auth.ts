import Cookies from 'js-cookie';
import { SignInParams, SignUpParams } from '../types';
import client from './client';
// 1
export const signUp = (params: SignUpParams) => {
  return client.post('/auth', params);
};

// 2
export const signIn = (params: SignInParams) => {
  return client.post('/auth/sign_in', params);
};

// 3 クライアント側とサーバー側の両方でセッションを終了
// /auth/sign_out:DeviseTokenAuth::SessionsController#destroy
export const signOut = () => {
  // DELETEリクエストは、通常、リソースの削除やセッションの終了などに使用されます。
  return client.delete('/auth/sign_out', {
    // サーバーから受け取った各種ヘッダー。これらのヘッダーは、Cookieから取得されます。
    // これらのヘッダーをリクエストに添付することで、サーバーはどのユーザーがサインアウトしたいのかを識別。
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 5 ユーザー情報を更新
export const updateUser = (formData: any) => {
  return client.put('/auth', formData, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
// export const updateUser = (params: UserUpdateParams) => {
//   return client.put('/auth', params, {
//     headers: {
//       'access-token': Cookies.get('_access_token'),
//       client: Cookies.get('_client'),
//       uid: Cookies.get('_uid'),
//     },
//   });
// };

// 4 認証済みのユーザーを取得
export const getAuthenticatedUser = () => {
  // トークンがない場合は何もしない
  if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) return;
  console.log('getAuthenticatedUserが呼ばれた');
  return client.get('/authenticated_users', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
// admin:
// allowPasswordChange:
// avatarUrl:
// createdAt:
// email:
// id:
// name:
// profile:
// provider: 'email';
// uid: 'koko@koko.com';
// updatedAt:
/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
Devise Token Authでのユーザー登録の挙動

1.ユーザーがPOSTリクエストを送信する。リクエストボディには、name、email、password、password_confirmationの
情報が含まれている。
2.RegistrationsControllerのcreateメソッドが呼び出される。
3.ユーザーが提供した情報が検証される。メールアドレスが正しい形式かどうか、パスワードが必要な長さかどうかなどが確認
される。また、ユーザーが提供した情報が既に登録されていないかどうかも確認される。
4.パスワードがハッシュ化され、DBに保存（カラム名は "encrypted_password）。
5.トークンが生成される。トークンがDBに保存。
.トークンにはaccess-token、client、uid、およびexpiryです。またtoken-typeは、認証に使用されるトークンの種類
を示す情報で通常 "Bearer" として設定されます。これは Devise Token Auth のデフォルト動作です。

.Devise Token Authでは、トークンはtokensというカラムに保存されます。このカラムは、ユーザーのidと紐づいています。
"access-token"、"client"、"uid"は、この "tokens" カラムの中にハッシュ形式で格納されます。
{
  "client_id_1": {
    "access-token": "access_token_1",
    "client": "client_id_1",
    "expiry": "expiry_timestamp_1",
    "uid": "user@example.com"
  },
  "client_id_2": {
    "access-token": "access_token_2",
    "client": "client_id_2",
    "expiry": "expiry_timestamp_2",
    "uid": "user@example.com"
  }
}

------------------------------------------------------------------------------------------------
ユーザー情報
サインアップしたユーザーの情報が含まれます。例えば、name, emailなどが含まれます。

トークン情報
サインアップに成功した場合、サーバーは新しいトークンを生成します。このトークンは、ユーザーがサーバーに認証要求を送
信するたびに、リクエストヘッダーに含める必要があります。

クライアント情報
クライアント情報には、uid、clientという2つの値が含まれます。uidは、ユーザーがサインアップ時に提供したemailアド
レスと同じ値です。
clientは、ユーザーが認証要求を送信するたびに変更される一意のIDです。OAuth2.0の認可サーバーから発行されるクライア
ント識別子。ユーザーがアプリケーションにアクセスするために必要な認証情報の一つです。

------------------------------------------------------------------------------------------------
devise_token_authのregistrations#createの挙動

1.createアクションは、新しいユーザーの登録処理を実行します。
2.リクエストパラメータから、ユーザーが入力した情報（例: email, password, password_confirmationなど）を取得
します。
3.入力された情報が適切な形式であるか検証します。例えば、メールアドレスが正しい形式かどうか、パスワードが必要な長さ
かどうかなどが確認されます。
4.ユーザーが提供した情報が既に登録されていないかどうかも確認されます。重複したメールアドレスやユーザー名などがない
ことが検証されます。
5.入力情報が適切であれば、新しいユーザーがデータベースに保存されます。
6.パスワードはハッシュ化されて保存されます（カラム名は "encrypted_password"）。
7.トークンが生成され、HTTPレスポンスのヘッダーにトークン情報が含められてクライアントに送信されます。トークンには
access-token、client、uidが含まれます。
8.新規登録が成功すると、ユーザーは自動的にログイン状態になります。
9.レスポンスには、ユーザーの情報、トークン、クライアント情報が含まれます。

このcreateアクションにより、新規ユーザー登録が適切に実行され、その結果の影響がアプリケーション全体に及びます。新
規登録によって、ユーザーがアプリケーションの機能を利用できるようになり、ユーザーエクスペリエンスが向上します。また、
登録後の自動ログインによって、ユーザーはすぐにアプリケーションを使用することができます。

------------------------------------------------------------------------------------------------
実際のres

このresは、
{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders(以下略...)}
このresのdataオブジェクトの中にさらにstatusのキー、値とdataオブジェクトがある。
{ data:{status: 'success', data: {…}} }
このres.data.dataの中身は、
{data: {allowPasswordChange:false, createdAt:"2023-04-08T03:21:18.624Z", email: "koko@momo.com",
id: 4, image: null, name: "koko", provider: "email", uid: "koko@momo.com",
updatedAt: "2023-04-08T03:21:18.734Z"}}

------------------------------------------------------------------------------------------------
さらにCookieがセットされて帰ってきており、
Cookie:
_access_token=-TytLB7ijMdEVE-L7fTvDg;
_client=T0JHkn5sIWxbp9pOtzJhow;
_uid=koko@momo.com

------------------------------------------------------------------------------------------------
主なレスポンスヘッダー

access-control-allow-methods: GET, POST, OPTIONS, DELETE, PUT
CORSの設定で、許可されているHTTPメソッドを示す。

access-control-allow-origin: *
CORSの設定で、どのオリジンからのリクエストでも許可することを示す。

access-control-expose-headers: access-token, expiry, token-type, uid, client
CORSの設定で、クライアントに公開するレスポンスヘッダを示す。

access-control-max-age: 7200
CORSの設定で、許可されているリクエストをキャッシュする時間を示す。

access-token: 6X54pSSjgNB4LNzkKpQc1Q
認証トークンの一種であるaccess-tokenの値を示す。

authorization: Bearer eyJhY2Nlc3MtdG9rZW4iOiI2WDU0cFNTamdOQjRMTnprS3BRYzFRIiwidG9rZW4tdHlwZSI6IkJlYXJlciIsImNsaWVudCI6Im95MGdxcV8zdlRJOFVURktiaXhxb1EiLCJleHBpcnkiOiIxNjgyMTM2NjY3IiwidWlkIjoibW9tb0Btb21vLmNvbSJ9
認証ヘッダの一種であるauthorizationの値を示す。

client: oy0gqq_3vTI8UTFKbixqoQ
認証トークンの一種であるclientの値を示す。

Content-Type: application/json; charset=utf-8
レスポンスのコンテンツタイプを示す。

expiry: 1682136667
認証トークンの有効期限を示す。

token-type: Bearer
認証トークンの種類を示す。

uid: momo@momo.com
認証ヘッダの一種であるuidの値を示す。

================================================================================================
2
devise_token_authのsessions#createの挙動

1.createアクションは、ユーザーのログイン処理を実行します。
2.リクエストパラメータから、ユーザーが入力した情報（例: email, password）を取得します。
3.入力された情報に基づいて、ユーザーを特定します。通常、メールアドレスやユーザー名などの一意の識別子を使用します。
4.入力されたパスワードが、データベースに保存されているハッシュ化されたパスワードと一致するかどうかを確認します。
5.パスワードが正しい場合、トークンが生成されます。トークンにはaccess-token、client、uid、およびexpiryが含まれ
ます。
6.生成されたトークンは、HTTPレスポンスのヘッダーに含められてクライアントに送信されます。
7.ユーザーはログイン状態になり、以降のリクエストで認証が必要なアクションを実行できるようになります。
8.レスポンスには、ユーザーの情報、トークン、クライアント情報が含まれます。

この create アクションにより、ユーザーがアプリケーションにログインし、認証が必要な機能を利用できるようになります。
ログインが成功すると、ユーザーエクスペリエンスが向上し、アプリケーションの利用が促進されます。また、トークンを使用
した認証方式により、セキュリティが向上し、ユーザーの信頼性が確保されます。

------------------------------------------------------------------------------------------------
実際のres

このresは、
{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders(以下略...)}
このresのdataオブジェクトの値がdataで、dataにはキーsuccessのオブジェクトがある。
{ data:{ success: true } }
*res = { data: { data:{ success: true } } }
*ユーザー情報はない

================================================================================================
3
利用意図は、ユーザーがアプリケーションからサインアウトする際に、クライアント側とサーバー側の両方でセッションを終了
し、ユーザーのアクセス権を正常に解除することです。このコードは、サーバーと通信し、サインアウト処理を適切に実行する
ために必要なリクエストを送信する役割を果たしています。
このユーザーの 'access-token',client,uidが削除されることで、サーバー側のセッションが終了する。

------------------------------------------------------------------------------------------------
devise_token_authのsessions#destroyの挙動

1.destroyアクションは、ユーザーのログアウト処理を実行します。
2.before_action :set_user_by_tokenにより、現在の認証済みユーザーが@resourceインスタンス変数にセットされま
す。
3.@tokenインスタンス変数が@resourceに紐づく認証トークンから取得され、@token.clear!でトークンがクリアされます。
4.ユーザーのトークン情報がデータベースから削除されます。user.tokens.delete(client)で対象のクライアントのトー
クンが削除され、user.save!でデータベースに保存されます。
5.もしCookieが有効であれば、Cookieも削除されます。
6.render_destroy_successメソッドが呼び出され、ログアウト成功のJSONレスポンスがクライアントに返されます。
7.ユーザーはログアウト状態になり、以降の認証が必要なリクエストでは、再度ログインが必要になります。

このdestroyアクションにより、ユーザーのログアウト処理が適切に実行され、その結果の影響がアプリケーション全体に及び
ます。セキュリティ面で、ユーザーがログアウトすることで不正なアクセスを防ぐことができます。

================================================================================================
4
返り値は、初めのif分で終わる場合は、戻り値は undefined になります。
JavaScriptでは、return文がない場合、return文があっても、何もreturnしない場合、関数の戻り値は自動的に
undefinedとなります。

------------------------------------------------------------------------------------------------
アクセストークン、クライアント情報、ユーザーIDが存在しない場合、true を返します。
いずれかが true の場合、全体の式は true になります。if (...) return;: 式が true の場合、関数はここで終了し、
以降の処理は実行されません。

if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) return;
をする意図は、必要な認証情報（アクセストークン、クライアント、ユーザーID）がすべて存在しているかどうかをチェックし
ています。これらの値のいずれかが存在しない場合、関数は早期に終了（return;）して、認証済みユーザーの情報を取得しよ
うとしないようにします。これは、不要なAPIリクエストを回避し、アプリケーションのパフォーマンスを向上させるための一
般的な方法です。

------------------------------------------------------------------------------------------------
Devise Token Authでは、認証済みのユーザー情報を取得するためにcurrent_userメソッドを使用します。
current_userメソッドを使うためには、まずトークン認証を行う必要があります。トークン認証を行うことで、サーバーは認
証済みのユーザーであることを確認します。
Devise Token Authでは、トークン認証を使用してAPIのリクエストを保護することが推奨されています。つまり、APIサー
バーのあらゆるメソッド（アクション）において、トークン認証が必要になります。認証されていない場合は、リクエストに失
敗して認証エラーが返されます。

================================================================================================
5
updateAvatar に headers: { 'content-type': 'multipart/form-data' } を追加するかどうか。
通常、FormData オブジェクトを使用してファイルを送信する場合、content-type ヘッダーに multipart/form-data を
設定することが推奨されています。
ただし、Axiosは、自動的に content-type ヘッダーを multipart/form-data に設定します。したがって、明示的に追加
する必要はありません。
@          @@          @@          @@          @@          @@          @@          @@          @

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
api_v1_sessions                 GET    /api/v1/auth/sessions(.:format)    api/v1/sessions#index

*/
