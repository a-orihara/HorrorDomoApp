import React from 'react';
import useSignUp from '../../hooks/auth/useSignUp';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

// ================================================================================================
const SignUpForm = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    handleSignUp,
  } = useSignUp();

  // ================================================================================================
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mt-10 flex h-20 items-center justify-center pt-4 text-2xl font-semibold md:text-4xl'>Sign Up</h1>
      <form className='mt-11 flex flex-1 flex-col'>
        <div>
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='name'>
            Name:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            id='name'
            type='text'
            name='name'
            value={name}
            // 1
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
          ></Input>
        </div>
        <div>
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='email'>
            Email:
          </Label>

          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
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
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='password'>
            Password:
          </Label>

          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
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
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='passwordConfirmation'>
            Password Confirmation:
          </Label>

          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            id='passwordConfirmation'
            type='password'
            name='passwordConfirmation'
            value={passwordConfirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPasswordConfirmation(e.target.value);
            }}
          ></Input>
        </div>
        <div className='md:mt-8 lg:mt-0'>
          <Button className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSignUp}>
            Sign Up!
          </Button>
        </div>
      </form>
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
*/
