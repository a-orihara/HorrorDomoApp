import React from 'react';
import { useUpdateUser } from '../../../hooks/user/useUpdateUser';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Label from '../../atoms/Label';
import TextArea from '../../atoms/TextArea';
import { useAuthContext } from '../../../contexts/AuthContext';

// ================================================================================================
const UserEditForm = () => {
  const { name, setName, email, setEmail, profile, setProfile, setAvatar, handleUpdateUser } =
    useUpdateUser();
  const { currentUser  } = useAuthContext();
  // 3.1
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 3.2
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  // ================================================================================================
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mt-4 flex h-16 items-center justify-center text-2xl font-semibold md:mt-8 md:text-4xl lg:mt-4'>
        Update your profile
      </h1>
      {/* 2 */}
      <form className='mt-0 flex flex-1 flex-col md:mt-4 lg:mt-0' encType='multipart/form-data' method='post'>
        <div className='md:mt-4 lg:mt-0'>
          {/* 1 */}
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='name'>
            Name:
          </Label>
          <Input
            className='m-auto mb-2 w-4/5  md:w-3/5 lg:w-2/5'
            id='name'
            type='text'
            name='name'
            value={name}
            // currentUser(変数): User | undefinedで、undefinedの可能性があるので、currentUser?とする
            placeholder={currentUser ? currentUser.name : 'Name'}
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
            className='m-auto mb-2 w-4/5  md:w-3/5 lg:w-2/5'
            id='email'
            type='email'
            name='email'
            value={email}
            placeholder={currentUser ? currentUser.email : 'Email'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          ></Input>
        </div>
        <div className='flex flex-col md:mt-4 lg:mt-0'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='profile'>
            Profile:
          </Label>
          <TextArea
            className='m-auto mb-2 h-32 w-4/5  bg-blue-200 md:w-3/5 lg:w-2/5'
            id='profile'
            name='profile'
            value={profile || ''}
            placeholder={currentUser && currentUser.profile ? currentUser.profile : 'Profile'}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setProfile(e.target.value);
            }}
          ></TextArea>
        </div>
        <div className='md:mt-4 lg:mt-0'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='avatar'>
            Avatar:
          </Label>
          <Input
            className='m-auto mb-2 w-4/5  md:w-3/5 lg:w-2/5'
            id='avatar'
            type='file'
            // 4
            accept='image/*'
            onChange={handleAvatarChange}
          />
        </div>
        <div className='md:mt-8 lg:mt-0'>
          <Button
            className='m-auto mb-4 mt-4 bg-basic-yellow font-semibold hover:bg-hover-yellow'
            onClick={handleUpdateUser}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserEditForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
htmlForは、HTMLのlabelタグのfor属性に対応するReact JSXの属性です。htmlForを指定することで、labelタグと
inputタグを関連付ける（対応するinput要素のid属性を指定）ことができます。

================================================================================================
2
encType 'multipart/form-data'
HTMLの<form>要素の属性の1つです。この属性は、フォームデータのエンコーディングタイプを指定します。通常、フォームに
テキストや数字のデータが含まれる場合には、デフォルトのエンコーディングタイプである、
application/x-www-form-urlencodedが使用されます。しかし、フォームがファイルのアップロードを含む場合には、
encType を multipart/form-data に設定する必要があります。
------------------------------------------------------------------------------------------------
method='post'
HTTPリクエストメソッドを指定する属性です。postメソッドは、データをリクエスト本体に含めて送信する際に使用されます。
指定することで、フォームのデータのエンコーディング方法やデータの送信方法を明示的に指定することができます。


================================================================================================
3.1
. handleAvatarChange` は、特に名前やプロフィールのようなテキストベースの入力に比べ、ファイルハンドリングの性質上
必要
- バイナリデータとテキストデータ**： アバター画像はバイナリデータであり、単純なテキストではありません。ファイルを扱
うには、バイナリデータを扱う必要があり、テキストとは異なる方法で読み取り、処理する必要があります。
- **特別なオブジェクト `File`**： JavaScriptでは、ファイルは `File` オブジェクトを使って扱われる。このオブジ
ェクトにはファイルに関するメタデータ（名前、タイプ、サイズなど）とファイルの内容が格納されている。ユーザーがアップロ
ードするファイルを選択すると、この `File` オブジェクトを取得して適切に処理する必要があります。対照的に、テキスト入
力は単純な文字列であり、このレベルの処理は必要ありません。

================================================================================================
3.2
const file = e.target.files?.[0];
- target.filesには、選択されたファイルの情報が含まれています。複数のファイルが選択された場合には、配列としてファ
イル情報が格納されます。
- ?.は、オプショナルチェイニング演算子と呼ばれ、target.filesがundefinedの場合にはundefinedを返し、エラーを防
止します。
- [0]は、選択されたファイルのうち最初のファイルのみを取得するための記述。

================================================================================================
4
HTML では、`input` 要素の `accept` 属性はサーバーが受け付ける（ファイルアップロードで送信できる）ファイルの種類
を指定します。accept='image/*'`を `input` 要素で使用すると、ウェブブラウザに対して、ユーザが画像ファイルのみを
選択してアップロードできるように指示します。
*/
