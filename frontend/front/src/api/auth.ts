import Cookies from 'js-cookie';
import { SignInParams, SignUpParams } from '../types/user';
import { client } from './client';

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
  // 3.1 DELETEリクエストは、通常、リソースの削除やセッションの終了などに使用されます。
  return client.delete('/auth/sign_out', {
    // 3.2
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
    },
  });
};

// 4 認証済みのユーザーを取得
export const getAuthenticatedUser = () => {
  // トークンがない（サインインしていない）場合は何もしない
  if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) return;
  // railsのAuthenticatedUsersControllerへアクセス
  console.log("◆getAuthenticatedUserが発火")
  return client.get('/authenticated_users', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
    },
  });
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
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
ント識別子。client値は、ユーザーが異なるデバイスやブラウザからアクセスした場合に新しく生成されることが多い。
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
devise_token_authのregistrations#createの主なレスポンスヘッダー

access-control-allow-methods: GET, POST, OPTIONS, DELETE, PUT
CORSの設定で、許可されているHTTPメソッドを示す。

access-control-allow-origin: *
CORSの設定で、どのオリジンからのリクエストでも許可することを示す。

access-control-expose-headers: access-token, expiry, token-type, uid, client
CORSの設定で、クライアントに公開するレスポンスヘッダを示す。

access-control-max-age: 7200
CORSの設定で、許可されているリクエストをキャッシュする時間を示す。

access-token: 6X54pSS（略）/ユーザーの認証に使用される具体的なトークンの値
認証トークンの一種であるaccess-tokenの値を示す。

authorization: Bearer eyJhY2Nlc3MtdG9（略）/HTTPリクエストの認証ヘッダー
.認証ヘッダの一種であるauthorizationの値を示す。このヘッダーは認証スキーム（この場合はBearer）と実際のトークン
（access-token）を組み合わせて使用
.HTTPリクエストには、そのリクエストが正当なユーザーから送られていることを証明するための認証情報を含める必要があり
ます。authorizationヘッダーはこの目的で使われ、リクエストが認証されていることを示すためにHTTPリクエストに付加さ
れます。authorizationヘッダーは「Bearer」という認証スキームと、そのスキームに従って生成された具体的な認証トーク
ン（access-token）を組み合わせた形でHTTPリクエストに含まれます。これにより、リクエストを送信したクライアントが正
当に認証されていることをサーバーに伝えることができます。

client: oy0gqq_3vTI（略）/ユーザーが使用しているクライアント（例えばブラウザやモバイル）を特定するためのID
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
.devise_token_authのsessions#destroyの挙動

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
3.1
client.deleteの、このaxiosのdeleteメソッドについて、このメソッドは第一引数にパス、第二引数にオブジェクトを取り、
その第二引数のオブジェクトの中にプロパティ名がheadersのオブジェクトが入っている。
------------------------------------------------------------------------------------------------
**設定オブジェクト**：
これは2番目の引数です。これはリクエストの様々なコンフィギュレーション設定を含むことができるオブジェクトです。このオ
ブジェクトの一般的なプロパティの一つは `headers` で、リクエストと一緒に追加の HTTP ヘッダーを送信するために使用。

================================================================================================
3.2
. **クライアント側のヘッダー管理**：
- frontend/front/src/api/auth.ts`内の`signOut`関数では、'/auth/sign_out'へのDELETEリクエストに対してヘ
ッダが設定される。ヘッダには 'access-token'、'client'、'uid' が含まれ、これらはクッキーから取得される。これら
のヘッダは、サーバがどのユーザがサインアウトしようとしているかを識別する。
- ここで、クッキーに格納されたトークンは、サインアウト・リクエストを認証するために使用される。これはトークンベース
の認証システムでよく行われることで、DeviseTokenAuth::SessionsController` の`destroy` はログアウト要求が認
証されたユーザからのものであることを確認する。
- destroyのbefore_action :set_user_by_token` は非常に重要で、入力されたヘッダに基づいて 、
`@resource` (user) と `@token` を設定します。

================================================================================================
4
返り値は、初めのif分で終わる場合は、戻り値は undefined になります。
JavaScriptでは、return文がない場合、return文があっても、何もreturnしない場合、関数の戻り値は自動的に
undefinedとなります。
------------------------------------------------------------------------------------------------
アクセストークン、クライアント情報、ユーザーIDが存在しない場合、true を返します。
いずれかが true の場合、全体の式は true になります。if (...) return;: 式が true の場合、関数はここで終了し、
以降の処理は実行されません。
------------------------------------------------------------------------------------------------
. `||`の意味と具体例：
JavaScriptにおける `||` は論理OR演算子です。この演算子は、左側のオペランド（値）がfalsy（falseと同等の値、例え
ば`false`, `0`, `''`, `null`, `undefined`, `NaN`）である場合に、右側のオペランドを評価します。もし左側のオ
ペランドがtruthy（trueと同等の値）であれば、右側のオペランドは評価されず、左側のオペランドの値が結果として返されま
す。
具体例：
```
let a = false || 'Hello'; // aは'Hello'になる
let b = true || 'World';  // bはtrueになる
```
`a`の例では、最初のオペランド（`false`）はfalsyなので、次のオペランド（`'Hello'`）が評価され、`'Hello'`が`a`
に代入されます。`b`の例では、最初のオペランド（`true`）はtruthyなので、それが直接`b`に代入され、二番目のオペラン
ド（`'World'`）は無視されます。
------------------------------------------------------------------------------------------------
. アクセストークン、クライアント情報、ユーザーIDのいずれかが存在しない場合（たとえば
`Cookies.get('_access_token')`が`undefined`、`Cookies.get('_client')`が`"client123"`、
`Cookies.get('_uid')`が`"user@example.com"`の場合）：
- `!Cookies.get('_access_token')`は`!undefined`、つまり`true`になります。
- `!Cookies.get('_client')`は`!true`、つまり`false`になります。
- `!Cookies.get('_uid')`も同様に`false`になります。
この場合、`true || false || false`は`true`に評価されるので、`true`だとif文の中身（`return;`）が実行され、
関数は何も返さずに終了します。
------------------------------------------------------------------------------------------------
. すべての値が存在する場合（たとえばすべての`Cookies.get()`関数が有効な値を返す場合）：
- すべての`!Cookies.get()`は`false`になります。
この場合、`false || false || false`は`false`に評価されるので、if文の中身は実行されず、関数はその後の
`return client.get(...)`を実行します。
------------------------------------------------------------------------------------------------
. `!`を使用して反転させる理由は、この条件式が「トークンが存在しない場合に特定の処理をする」というロジックを表現し
ているからです。
. `!`を使用しない場合の書き方は、条件式を「トークンが存在する場合に処理を続行する」という形に書き換えることです。
```javascript
export const getAuthenticatedUser = () => {
  // トークンがすべて存在する場合のみ処理を続行
  if (Cookies.get('_access_token') && Cookies.get('_client') && Cookies.get('_uid')) {
```
この書き方では、`if`文の中で全てのトークンが全て存在する場合のみ`client.get(...)`を実行します。
これは`!`を使用した場合と同じ結果を達成しますが、ロジックが異なるため、理解しやすいかどうかは個々の読み手に依存。
------------------------------------------------------------------------------------------------
if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) return;
をする意図は、必要な認証情報（アクセストークン、クライアント、ユーザーID）がすべて存在しているかどうかをチェックし
ています。これらの値のいずれかが存在しない場合、関数は早期に終了（return;）して、認証済みユーザーの情報を取得しよ
うとしないようにします。これは、不要なAPIリクエストを回避し、アプリケーションのパフォーマンスを向上させるための一
般的な方法です。
------------------------------------------------------------------------------------------------
Devise Token Authでは、認証済みのユーザー情報を取得するためにcurrent_userメソッドを使用します。
current_userメソッドを使うためには、まずトークン認証を行う必要があります。トークン認証を行うことで、サーバーは認
証済みのユーザーであることを確認します。
------------------------------------------------------------------------------------------------
admin:
allowPasswordChange:
avatarUrl:
createdAt:
email:
id:
name:
profile:
provider: 'email';
uid: 'koko@koko.com';
updatedAt:

@          @@          @@          @@          @@          @@          @@          @@          @

作成されたルート
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
@          @@          @@          @@          @@          @@          @@          @@          @
未課題
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
型定義
import { AxiosResponse } from 'axios'; // eslint-disable-line import/named
------------------------------------------------------------------------------------------------
export const signUp = (params: SignUpParams): Promise<AxiosResponse<SignUpResponse>> => {
  return client.post('/auth', params);
};
------------------------------------------------------------------------------------------------
export type SignUpResponse = {
  data: {
    status: string;
    message: string;
    data: User;
  };
};
------------------------------------------------------------------------------------------------
TypeScriptの型定義は、コード内で利用するデータの構造を明示的に指定するためのものです。
この場合、`status`、`message`、および`User`型のデータを含む`data`フィールドだけを利用しているため、それらだけ
を型として定義しています。
レスポンスの全体を受け取りますが、その中で実際に使用するdataフィールドに含まれるstatus、message、およびUser型の
データだけを型定義しています。
一般的にはレスポンスの中で実際にアプリケーションで使用する値だけを型定義します。これにより型定義が適切な規模で保たれ
、また不要なフィールドに対する変更が型定義に影響を与えないようにします。
------------------------------------------------------------------------------------------------
TypeScriptは静的型付けのためのツールであり、その主な目的はコードの安全性と可読性を高めることです。レスポンスオブジ
ェクトのすべてのフィールドを型定義に含めることも可能ですが、利用しないフィールドまで型定義すると、型定義が複雑になり
、可読性が下がる可能性があります。
TypeScriptの型定義は、コード内で利用するデータの構造を明示的に指定するものであり、レスポンス自体を受け取るかどうか
に影響を与えるものではありません。
型定義がないフィールドがあっても、それらのフィールドはレスポンス内に存在し、JavaScriptのコードからはアクセス可能で
す。
ただし、そのフィールドをTypeScriptのコードから直接アクセスしようとすると、TypeScriptは警告を出します。
*/
