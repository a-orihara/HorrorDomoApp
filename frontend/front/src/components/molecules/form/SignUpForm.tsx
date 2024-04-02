import React from 'react';
import useSignUp from '../../../hooks/auth/useSignUp';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Label from '../../atoms/Label';

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

  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mt-4 flex h-20 items-center justify-center pt-4 text-2xl font-semibold md:mt-12 md:text-4xl lg:mt-8'>
        Sign Up
      </h1>
      <form className='mt-4 flex flex-1 flex-col md:mt-12 lg:mt-8'>
        <div className='md:mt-4 lg:mt-0'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='name'>
            Name:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            // 3.1
            id='name'
            type='text'
            // 3.2
            name='name'
            value={name}
            // 1
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
          ></Input>
        </div>
        <div className='md:mt-4 lg:mt-0'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='email'>
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

        <div className='md:mt-4 lg:mt-0'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='password'>
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

        <div className='md:mt-4 lg:mt-0'>
          <Label
            className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5'
            htmlFor='passwordConfirmation'
          >
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
          <Button
            className='m-auto mt-8 bg-basic-yellow font-semibold hover:bg-hover-yellow md:mt-4'
            onClick={handleSignUp}
          >
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
------------------------------------------------------------------------------------------------
Reactでは、`Input`コンポーネントの`onChange`属性を使って、入力の値が変わるたびに呼び出される関数を指定する。
ユーザーが入力フィールドにタイプすると、`onChange`イベントがトリガーされます。このイベントは `onChange` 属性に
割り当てられた関数を呼び出す。
ユーザーが名前入力にタイプすると、入力フィールドの現在の値でsetName関数が呼び出される
================================================================================================
2
htmlFor
label要素が紐づけるinput要素のid属性と対応させるために使用されるプロパティ。ラベルをクリックすることで対応
するinputにフォーカスが当たるようになっています。
ここで、for属性ではなくhtmlFor属性が使用されているのは、ReactではforはJavaScriptの予約語であり、そのために
htmlForを使用する必要があるためです。

================================================================================================
3.1
1. **id`属性の説明と例** HTMLの`id`属性は要素に一意な識別子を与えます。
- HTMLの `id` 属性は要素に一意な識別子を与えます。特定の要素をCSSでスタイルしたり、JavaScriptで操作したりする
場合に特に便利です。
- 例えば、`SignUpForm.tsx`では、各`Input`コンポーネントが `id='name'`、`id='email'` などの一意な`id`を持
っています。これにより、CSSやJavaScriptで特定の入力フィールドを簡単に参照できるようになります。JavaScriptでは、
`document.getElementById('name')`でこの要素を簡単に取得できます。

================================================================================================
3.2
. **Railsバックエンドのコンテキストにおける`name`属性の機能**について
- フォームでは、各入力フィールドの `name` 属性が、フォーム送信時にサーバに送信されるキーと値のペアのキー部分を指定
します。Railsはこれらの`name`属性を使用して、リクエストに入力されたフォームデータを解析し、分類します。例えば、フ
ォームに `name='email'` という入力フィールドがある場合、ユーザがこのフィールドに入力した値はサーバ側で 
`params[:email]` に格納されます。
- Railsはデータを特定の形式で受け取ることを期待し、通常はモデル名と属性を使って整理します。例えばユーザデータを送
信する場合、Railsは `user[name]`、`user[email]` などの形式でデータを送信することを期待します。
- RailsバックエンドがUserモデルを扱うように設定されている場合、
{
  "name": "input value for name",
  "email": "input value for email",
  "password": "input value for password",
  "passwordConfirmation": "input value for passwordConfirmation"
}
で受け取る。

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
