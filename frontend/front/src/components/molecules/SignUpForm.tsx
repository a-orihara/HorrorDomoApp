import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { signUp } from '../../api/auth';
import { SignUpParams } from '../../types';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

const SignUpForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // 非同期通信なので、async await
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      console.log(res.data);
      if (res.status === 200) {
        // 3
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        // const a = Cookies.get('_access_token');
        // console.log(a);
      }
      alert('登録成功');
    } catch (err) {
      console.log(err);
      alert(`登録失敗${err}`);
    }
  };

  // 1
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setValues({ ...values, [name]: value });
  // };

  // ------------------------------------------------------------------------------------------------
  return (
    <div className='mar flex h-full flex-1 items-center justify-center bg-slate-300'>
      <div className='flex-1 bg-red-200'>
        <h1>Sign Up From</h1>
        <form>
          <div>
            <Label htmlFor='name'>Name:</Label>
            <br />
            <Input
              id='name'
              type='text'
              name='username'
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Label htmlFor='email'>Email:</Label>
            <br />
            <Input
              id='email'
              type='email'
              name='email'
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Label htmlFor='password'>Password:</Label>
            <br />
            <Input
              id='password'
              type='password'
              name='password'
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Label htmlFor='passwordConfirmation'>Password Confirmation:</Label>
            <br />
            <Input
              id='passwordConfirmation'
              type='password'
              name='passwordConfirmation'
              value={passwordConfirmation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPasswordConfirmation(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Button onClick={handleSubmit}>Sign Up!</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
e
ブラウザが発生させるイベント（ユーザーがボタンをクリックする、キーを押すなど）に関する情報を提供するオブジェクトで
す。
React.ChangeEvent は、Reactにおけるイベントオブジェクトの型の一つ。
e.target は、イベントが発生したDOM要素を参照します
input要素のonChangeイベントでe.targetを使う関数を使用すると、そのイベントが発生したinput要素を参照することが
できます。

e.targetが返すオブジェクトの例
{
  name: 'email',
  value: 'example@example.com',
  type: 'email',
  checked: false,
  ...
}
*イベントが発生した後の<input> 要素の属性にアクセスできる。
================================================================================================
2

htmlFor
label要素が紐づけるinput要素のid属性と対応させるために使用されるプロパティ。ラベルをクリックすることで対応
するinputにフォーカスが当たるようになっています。
ここで、for属性ではなくhtmlFor属性が使用されているのは、ReactではforはJavaScriptの予約語であり、そのために
htmlForを使用する必要があるためです。

================================================================================================
3
devise_token_authを使用して認証を行う際に、通常は以下の3つのクッキーを設定するのが一般的です。

_access_token: アクセストークンは、APIへのリクエストを認証するために使用されます。
_client: クライアントIDは、ユーザーが使用しているクライアント（ブラウザやデバイス）を識別するために使用されます。
_uid: ユーザーIDは、認証されたユーザーを特定するために使用されます。
これらのクッキーを設定することで、認証が必要なAPIリクエストを送信する際に、これらの値をリクエストヘッダーに含める
ことができます。サーバー側では、これらの値を検証してリクエストが正当なものであるかどうかを判断します。

================================================================================================
4
e.preventDefault() は、イベントハンドラ内で使用される JavaScript のメソッドです。このメソッドは、ブラウザー
のデフォルトのイベント処理をキャンセル（または「抑制」）することができます。
例えば、HTML フォームの送信ボタンがクリックされたとき、ブラウザのデフォルトの動作はフォームデータを送信し、ページ
をリフレッシュまたはリダイレクトすることです。しかし、JavaScript を使用してフォームデータを非同期的に処理したい
場合は、e.preventDefault() を使用してブラウザのデフォルトの動作をキャンセルし、代わりにカスタムロジックを実行
することができます。
このコードの場合、e.preventDefault() は、フォームのデフォルトの送信動作をキャンセルし、handleSubmit 関数内
で非同期的にサインアップ処理を実行しています。これにより、ページのリフレッシュやリダイレクトを避けることができ、
ユーザーエクスペリエンスが向上します。

一般的な利用方法:
フォームの送信時に非同期通信（Ajax）を行いたい場合
リンクのクリック時に、ページ遷移ではなく JavaScript で何らかの処理を行いたい場合
イベントが伝播（バブリングやキャプチャリング）されて、親要素で不要なイベントハンドラが実行されるのを防ぎたい場合
e.preventDefault() は、これらのシナリオでよく使用されます。ただし、e.preventDefault() はイベント処理をキ
ャンセルするため、通常のブラウザの動作が必要な場合は使用しないでください。

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
