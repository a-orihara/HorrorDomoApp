import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { signUpUser } from '../../api/auth';
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
      const res = await signUpUser(params);
      console.log(res);
      if (res.status === 200) {
        // 3
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
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
*/
