import React, { useState } from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

const SignUpForm = () => {
  type User = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = () => {
    alert('送信');
  };
  // 1
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setValues({ ...values, [name]: value });
  // };

  // ------------------------------------------------------------------------------------------------
  return (
    <form>
      <Label htmlFor='name'>Name</Label>
      <Input
        id='name'
        type='text'
        name='username'
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(e.target.value);
        }}
      ></Input>
      <Label htmlFor='email'>Email</Label>
      <Input
        id='email'
        type='email'
        name='email'
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      ></Input>
      <Label htmlFor='password'>Password</Label>
      <Input
        id='password'
        type='password'
        name='password'
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      ></Input>
      <Label htmlFor='passwordConfirmation'>Password Confirmation</Label>
      <Input
        id='passwordConfirmation'
        type='password'
        name='passwordConfirmation'
        value={passwordConfirmation}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPasswordConfirmation(e.target.value);
        }}
      ></Input>
    </form>
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

*/
