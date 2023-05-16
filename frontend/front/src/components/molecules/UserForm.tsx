import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { updateUser } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import { UserUpdateParams } from '../../types';
import AlertMessage from '../atoms/AlertMessage';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
// ================================================================================================
const UserForm: React.FC = () => {
  const { currentUser, handleGetCurrentUser } = useContext(AuthContext);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: UserUpdateParams = {
      name: name,
      email: email,
    };
    try {
      const res = await updateUser(params);
      if (res.status === 200) {
        console.log(`updateのres.data:${JSON.stringify(res.data)}`);
        // 認証済みのユーザー情報を取得し、ユーザー情報や認証状態を更新する
        handleGetCurrentUser();
        // setUserUpdated(true);
        // getAuthenticatedUser();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // ページをリロードして、ユーザー情報を更新する
        // router.push(`/user/${res.data.data.id}`);

        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.full_messages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors.fullMessages}`);
      setAlertOpen(true);
    }
  };

  // ================================================================================================
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mt-10 flex h-20 items-center justify-center pt-4 text-2xl font-semibold md:text-4xl'>
        Update your profile
      </h1>
      <form className='mt-11 flex flex-1 flex-col' encType='multipart/form-data' method='post'>
        <div>
          {/* 1 */}
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='name'>
            Name:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-2/5'
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

        <div>
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='email'>
            Email:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-2/5'
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

        <div>
          <Button className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
        <AlertMessage></AlertMessage>
      </form>
    </div>
  );
};

export default UserForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
htmlForは、HTMLのlabelタグのfor属性に対応するReact JSXの属性です。htmlForを指定することで、labelタグと
inputタグを関連付ける（対応するinput要素のid属性を指定）ことができます。

================================================================================================
2


================================================================================================
3
const file = e.target.files && e.target.files[0];
eは、Reactのイベントオブジェクトで、targetプロパティを通じてイベントが発生したDOMノードを参照できます。ファイル
選択欄では、e.targetは<input type="file">要素を参照します。
<input type="file">は、複数のファイルを選択できるので、e.target.filesはFileListオブジェクトを返します。&&
演算子を使用することで、filesが存在する場合に限り、files[0]のような配列の要素を取得できます。これにより、ファイ
ル選択欄が空の場合にエラーが発生することを防ぐことができます。
最終的に、fileは選択されたファイルの配列の最初の要素になります。setAvatar関数を使用して、このファイルをReactの
状態に保存しています。

if (file) は、ファイルが選択された場合のみ、そのファイルを処理するために必要です。もしファイルが選択されていな
い場合、file には undefined が入ります。それを setAvatar に渡してしまうと、null ではなく undefined がセッ
トされることになります。そのため、後で avatar を使うときにエラーが発生してしまいます。
また、

================================================================================================
4
const file = e.target.files?.[0];
target.filesには、選択されたファイルの情報が含まれています。複数のファイルが選択された場合には、配列としてファイ
ル情報が格納されます。
?.は、オプショナルチェイニング演算子と呼ばれ、target.filesがundefinedの場合にはundefinedを返し、エラーを防止
します。
[0]は、選択されたファイルのうち最初のファイルのみを取得するための記述。

------------------------------------------------------------------------------------------------
eは、Reactのイベントオブジェクトで、targetプロパティを通じてイベントが発生したDOMノードを参照できます。ファイル
選択欄では、e.targetは<input type="file">要素を参照します。

------------------------------------------------------------------------------------------------
if (!file) return;
!fileは、fileがundefinedやfalseの場合に真となり、returnで以降の処理を実行することなく、呼び出し元に戻る。

------------------------------------------------------------------------------------------------
onChange イベントは、ファイルを選択しなくても発生することがあります。例えば、ファイルダイアログをキャンセルした場
合でも onChange イベントは発生します。しかし、e.target.files は空の配列になります。それを考慮してif (!file)
を使うことで、不要なエラーを回避することができます。

================================================================================================
5

`const formData = new FormData();`
- ファイルをサーバに送信するために、フォームデータを作成するためのコードです。
- `FormData`は、HTMLフォームからデータを収集し、それを送信するためのキーと値のペアを保持するJavaScriptオブジェ
  クトです。
- `const formData = new FormData();`と記述することで、空のフォームデータが作成されます。

------------------------------------------------------------------------------------------------
`formData.append('avatar', avatarFile!);`
- フォームデータのオブジェクトにファイルデータを追加するためのコードです。
- `formData.append()`は、キーと値のペアをフォームデータオブジェクトに追加するメソッドです。
- 第1引数には、キーとして使用する文字列を指定します。
- 第2引数には、フォームデータの値として追加するデータを指定します。ここでは、フォームから選択されたファイルデータで
  ある`avatarFile`を指定しています。`!`を付けていることで、`avatarFile`が`null`または`undefined`でないこと
  を保証しているため、TypeScriptのエラーが発生しないようにしています。`!`を付けてアクセスしています。

------------------------------------------------------------------------------------------------
!
*TypeScriptの非nullアサーション演算子です。
TypeScriptには、値がnullでないことを示すための、非nullアサーション演算子(Non-Null Assertion Operator) !
という構文があります。
!を変数名の後に付けることで、その変数がnullまたはundefinedではないことをTypeScriptに明示的に伝えることができま
す。!を付けることで、TypeScriptはその変数がnullまたはundefinedでないことを保証し、実行時にエラーが発生しないよ
うにします。つまりコンパイル時にエラーを出すことで、実行時のエラーを防ぐことができます。
あくまで要素が存在していることが保証されている場合に使用します。

*handleAvatarSubmit関数内でif (!file) return;という条件文があることで、avatarFileがnullまたはundefinedで
ないことが保証されるようになっています。

*document.getElementById('input')!.focus()
! は、オペランドが非nullかつ非undefinedであることをassertするものです。これは、以下のように明示的にassertする
ことを省略した書き方とも言えます。
(document.getElementById('input') as HTMLElement).focus()
「assertする」とは、プログラムの実行中に特定の条件が満たされていることをチェックすることで、その条件が間違っている
場合にエラーを出すことを意味します。

------------------------------------------------------------------------------------------------
if (!avatarFile)
handleAvatarChangeでfileが存在しない場合はreturnしているので、handleAvatarSubmitの中で再度
if (!avatarFile)をチェックする必要は基本的にはありません。ただし、以下の理由でチェックを入れておくことも一定の意
味があります。
.万が一、handleAvatarChangeが正常に実行されなかった場合や、setAvatarFileがうまく動作しなかった場合に備える。
.コードの可読性や保守性を向上させる。将来的にhandleAvatarChangeが変更された場合でも、handleAvatarSubmit内で
nullチェックをしていれば、エラーが発生するリスクを減らすことができます。
ただし、冗長に感じる場合や、他のバリデーションが適切に実装されている場合は、handleAvatarSubmit内のnullチェックを
削除しても問題ありません。

================================================================================================

@          @@          @@          @@          @@          @@          @@          @@          @
avatarを登録したときの実装コード
@          @@          @@          @@          @@          @@          @@          @@          @
const [avatarFile, setAvatarFile] = useState<File | null>(null);

================================================================================================
// 4
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
  };

================================================================================================
5
router.reload()
現在のページを再読み込みする。例えば、特定のアクションが実行された後、現在のページを更新する必要がある場合に使用され
ます。
router.reload()を使用する場合は、ページのリロードに伴い、ユーザーが入力したデータやスクロール位置などの状態もすべ
てリセットされることに注意が必要です。適切に扱ってください。

================================================================================================
@          @@          @@          @@          @@          @@          @@          @@          @
avatar
@          @@          @@          @@          @@          @@          @@          @@          @
<form className='mt-11 flex flex-1 flex-col' encType='multipart/form-data' method='post'>
        <div>
          <Label className='m-auto w-2/5 pl-3 text-left text-lg md:text-2xl' htmlFor='avatar'>
            Avatar:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-2/5'
            id='avatar'
            type='file'
            name='avatar'
            onChange={handleAvatarChange}
          ></Input>
        </div>

        <div>
          <Button
            className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow'
            onClick={handleAvatarSubmit}
          >
            Update Avatar
          </Button>
        </div>
      </form>
================================================================================================
// 5
  // ファイルを送信するためのフォームデータを作成し、選択されたファイルをフォームデータに追加する
  const handleAvatarSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!avatarFile) {
      setAlertSeverity('error');
      setAlertMessage('ファイルが選択されていません。');
      setAlertOpen(true);
      return;
    }
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const res = await updateAvatar(formData);
      if (res.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('ユーザーアバターの更新に成功しました！');
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertSeverity('error');
      setAlertMessage('ユーザーアバターの更新中にエラーが発生しました。');
      setAlertOpen(true);
    }
  };

*/
