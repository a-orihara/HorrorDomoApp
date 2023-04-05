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

*/
