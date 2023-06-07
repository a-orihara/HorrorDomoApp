import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signUp } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../hooks/error';
import { SignUpParams } from '../../types';
// ================================================================================================
// サインアップ処理。非同期通信なので、async awaitを使う。
const useSignUp = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { setIsSignedIn, setCurrentUser } = useAuthContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  // サインアップ処理
  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: SignUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
    };
    try {
      // 5
      const res = await signUp(params);
      console.log(`サインアップのres${JSON.stringify(res)}`);
      if (res.status === 200) {
        // 3 Cookieにトークンをセット
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        localStorage.setItem('firstTimeLogin', 'true');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(getErrorMessage(res.data));
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage(getErrorMessage(err.response.data));
      setAlertOpen(true);
    }
  };
  // ------------------------------------------------------------------------------------------------
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

*/
