// import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signUp } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
// import { useAuthContext } from '../../contexts/AuthContext';
import { SignUpParams } from '../../types/user';

// 7.1 サインアップ処理。非同期通信なので、async awaitを使う。
const useSignUp = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  // 1.1 サインアップ認証用のmailのリンク先のURL（認証に成功した後にリダイレクトされるページの指定）
  const confirmSuccessUrl = "http://localhost:3001/signin";
  // 7.2
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // サインアップ処理
  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // ここでparamsに値を入力
    const params: SignUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      // deviseでconfirmableを設定してればrails側で受け取って処理してくれる
      confirmSuccessUrl: confirmSuccessUrl,
    };
    try {
      // 5
      const res = await signUp(params);
      if (res.status === 200) {
        console.log(`サインアップのres${JSON.stringify(res)}`);
        alert("アカウント認証用のメールを送信しました！");
        setTimeout(() => {
            router.push('/');
            }, 1000);
      // 200以外のエラーではないレスポンスのケース
      } else {
        setAlertSeverity('error');
        setAlertMessage('認証に失敗しました');
        setAlertOpen(true);
      }
      // 6
    } catch (err) {
      // デフォルトメッセージを設定し、これをAxios以外のその他エラーの際に表示
      let errorMessage = '予期しないエラーが発生しました';
      if (err instanceof AxiosError) {
        // userが見つからないケース
        if (err.response?.status === 422) {
          // deviseのregistrationのerrorメッセージは下記の形式で取り出せる
          const errorMessages = err.response.data.errors.fullMessages;
          // errorMessagesは文字列の配列なので、連結する
          errorMessage = Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages;
        // AxiosErrorの上記以外のケース
        } else {
          setAlertMessage('サーバーへの接続に失敗しました');
        }
      }
      setAlertSeverity('error');
      setAlertMessage(errorMessage);
      setAlertOpen(true);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    handleSignUp,
  };
};

export default useSignUp;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
. **1.Railsの**config.action_mailer.default_url_options`：
- railsから送信されるメール内で生成されるリンクのベースURLを定義します。
- あなたの場合、`localhost`にポート `3010` が設定されています。
. **React Frontend（`useSignUp`フック）の**confirmSuccessUrl`：
- これは、ユーザーがメールの確認に成功した後にリダイレクトされるページを指定しています。
- ユーザーがメール内の確認リンクをクリックして確認プロセスを完了した後、`localhost:3001`のサインインページに移動
することを意味します。つまり、サインインを促します。
------------------------------------------------------------------------------------------------
簡単に言うと、1つ目(`config.action_mailer.default_url_options`)はメールの旅が始まる場所(メールリンクのベー
スURL)で、2つ目(`confirmSuccessUrl`)は旅が終わる場所(ユーザーがメールで要求されたことを行った後の行き先)。
================================================================================================
3
devise_token_authを使用して認証を行う際に、通常は以下の3つのクッキーを設定するのが一般的です。

_access_token: アクセストークンは、APIへのリクエストを認証するために使用されます。
_client: クライアントIDは、ユーザーが使用しているクライアント（ブラウザやデバイス）を識別するために使用されます。
_uid: ユーザーIDは、認証されたユーザーを特定するために使用されます。
これらのクッキーを設定することで、認証が必要なAPIリクエストを送信する際に、これらの値をリクエストヘッダーに含める
ことができます。サーバー側では、これらの値を検証してリクエストが正当なものであるかどうかを判断します。

================================================================================================
5
このresは、
{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders(以下略...)}
res.dataは、わかりいくいけど、dataの中にstatusとdataオブジェクトがある。
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
6
if文の条件で `res.status === 200` が満たされない場合、すなわちレスポンスステータスコードが201以外の場合に、
else文のブロック内が実行されます。これは何らかの理由でステータスコードが200以外が返された場合を含みます。
通信エラーの際は、catchブロックに入ります。これは、ネットワークエラーなど、HTTPリクエストそのものが失敗した場合を
指します。
その他、catchブロックは、次のような状況でも実行されます：
- tryブロック内で予期しないエラー（例えば、TypeErrorやReferenceErrorなどのJavaScriptの実行エラー）が発生し
た場合
- HTTPリクエスト自体は成功したが、サーバーがエラーステータスコード
（例えば、404 Not Found、500 Internal Server Error等）を返した場合。ただし、axiosではエラーステータスコード
を返すときもPromiseがrejectされ、catchブロックが実行されます。

================================================================================================
7.1
http://localhost:3001/mail-confirmation?confirmation_token=eDzx5KmeRo_xhQmxy9Xs
. **ユーザーがサインアップする。
- ユーザーが値を入力してサインアップフォームが送信されると、`useSignUp.ts` の `handleSignUp` がトリガー。これ
らの詳細情報がバックエンド (`auth` API の `signUp` 関数) に送信。
- リクエストには `confirmSuccessUrl` が含まれており、メール確認後のリダイレクト先を Devise に伝えます。
------------------------------------------------------------------------------------------------
. **バックエンドがサインアップリクエストを受け取る:**。
- Railsはリクエストを受け取り、`DeviseTokenAuth::RegistrationsController`を通して処理。
- このプロセスの一環として、Deviseは確認トークンを生成し、確認リンクを含むメールをユーザーに送信します。このメール
は、`http://localhost:3001/mail-confirmation?confirmation_token=<actual_token>`のようなURLに誘導する
ように設定されています。ユーザーのアカウントは作成されますが、まだ認証されていません。
------------------------------------------------------------------------------------------------
. **フロントエンドは確認リンクを処理
- ユーザーはメールを受信し、確認リンクをクリック。このリンクはユーザーをフロントの `mail-confirmation` ページに
誘導。
- フロントの `MailConfirmation` ページは URL から `confirmation_token` を取り出す。
- railsの `Api::V1::User::ConfirmationsController` の `update` アクションに API リクエストを行い、ユー
ザーのメールを確認する。
------------------------------------------------------------------------------------------------
. **ユーザー認証
- ユーザが確認リンクをクリックすると、フロントエンドの `mail-confirmation` ページに誘導されます。
- フロントエンドの `MailConfirmation` コンポーネントは URL から `confirmation_token` を取得し、ユーザのメ
ールを確認するためにバックエンド（パス `/user/confirmations` ）に API リクエストを行います。
- このデザインは、フロントエンド（ユーザーとのインタラクションを処理する）とバックエンド（データと認証ロジックを処
理する）の間の懸念を分離します。
- この設定は、バックエンドがデータ処理とビジネスロジックに集中する、最新のフルスタックアプリケーションアーキテクチ
ャに沿ったものです。
- config/environments/developmentの、`config.action_mailer.default_url_options`設定はメール確認リン
クの生成には利用されません。
------------------------------------------------------------------------------------------------
**Devise `confirmed_at` による `confirm` 認証:**.
- Deviseでは、データベースの `confirmed_at` 属性にタイムスタンプ（日付と時刻）がある場合、ユーザーは確認された
とみなされます。この属性はユーザー作成時のデフォルトではNULLです。
- 確認プロセスでは、ユーザが確認リンクをクリックしてトークンが認証されると、`confirmed_at`属性に現在の日時が設定
されます。
- その時点から、ユーザーはDeviseによって確認されたとみなされます
------------------------------------------------------------------------------------------------
＊ **devise_token_auth/confirmations_controller.rb` における `show` と `create` の役割:このアプリでは
使用していない。
- 通常、`show` はサーバサイドの確認フローで使用され、バックエンドが確認メールのリンクを直接処理します。フロントエ
ンドが確認プロセスを管理しているので、このフローでは直接使用しません。
- 関数 `create` は、ユーザが確認メールを再送するように要求した場合などに、確認の指示を再送するために使用します。
これは最初のサインアップと確認のフローには含まれません。
------------------------------------------------------------------------------------------------
. これはバックエンドのみで処理する時の流れ。
- ユーザーがメール内の確認リンクをクリックすると、railsにリクエストが送信。このリクエストは標準的な Devise のフロ
ーに従って `DeviseTokenAuth::ConfirmationsController` の `show` アクションにルーティング。
- show` アクションは、指定された確認トークンを持つユーザーを見つけ、そのレコードを更新することで、ユーザーのメール
アドレスを確認します。
- 確認が成功し、ユーザーが既にサインインしている場合は、新しいトークンを生成して `redirect_url` (この場合は、
`http://localhost:3001/signin`) にリダイレクトします。ユーザーがサインインしていない場合は、単に
`redirect_url` にリダイレクトします。

================================================================================================
7.2
. **アプリへの統合:**.
- src/pages/_app.tsx`では、`AlertProvider`がアプリケーションコンポーネントをラップし、アプリ全体にアラートコ
ンテキストを提供します。
- このセットアップにより、アプリケーション全体でアラートの状態にアクセスできるようになり、どのコンポーネントでもこ
の状態に変更があると、それに応じて`AlertMessage`モーダルが更新され、表示されるようになります。
まとめると、`AlertContext` はアプリケーション全体でアラートの状態を管理する方法を提供し、`AlertMessage` コンポ
ーネントはこの状態に基づいてモーダルをレンダリングする(表示する)責任を持ちます。
*/
