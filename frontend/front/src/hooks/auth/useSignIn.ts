import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useFollowContext } from '../../contexts/FollowContext';
import { usePostContext } from '../../contexts/PostContext';
import { SignInParams } from '../../types/user';

// ================================================================================================
// 1.1
export const useSignIn = () => {
  // カスタムフック内でローカル状態を作成し、管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // currentUserを取得する関数
  const { handleGetCurrentUser } = useAuthContext();
  // 1.3 アラートのメッセージ、表示状態、種類を管理
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  // currentUserの投稿総数を取得する関数
  const { handleGetCurrentUserPostsCount } = usePostContext();
  // currentUserのfollowing数とfollowers数を取得する関数
  const { handleGetFollowingCountByUserId, handleGetFollowersCountByUserId } = useFollowContext();
  const router = useRouter();

  // ------------------------------------------------------------------------------------------------
  // 2.1
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 2.2
    e.preventDefault();
    // paramsオブジェクトを作成、emailとpasswordを格納
    const params: SignInParams = {
      email: email,
      password: password,
    };
    try {
      // 2.3
      const res = await signIn(params);
      console.log(`◆サインインのres${JSON.stringify(res)}`);
      // サインインに成功すると、currentUserの情報が返る
      if (res.status === 200) {
        // ログインに成功したら、Cookieにアクセストークン、クライアント、uidを保存
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        // 1.2 サインインユーザーでcurrentUserを取得してセット
        handleGetCurrentUser();
        // currentUserのpost総数を取得
        handleGetCurrentUserPostsCount();
        // 指定userId＝currentUserのidのフォロー数を取得。ここで設定するとHomePageでfollowing数が表示される
        handleGetFollowingCountByUserId(res.data.data.id);
        // 指定userId＝currentUserのidのフォローワー数を取得。
        handleGetFollowersCountByUserId(res.data.data.id);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // 実装中：first-loginをtrueにすることで、初回ログイン時にwelcome-messageを表示する。
        // localStorage.setItem('firstTimeLogin', 'true');
        // Homeページへ遷移
        setTimeout(() => {
          // router.push(`/users/${res.data.data.id}`);
          router.push(`/`);
        }, 1000);
      } else {
        console.log("else作動")
        console.log(`サインイン失敗${JSON.stringify(res)}`)
        // setAlertSeverity('error');
        // setAlertMessage(`${res.data.errors[0]}`);
        // setAlertOpen(true);
      }
    } catch (err: any) {
      console.log("catch作動")
      setAlertSeverity('error');
      // エラーはresと省略するとエラーになる
      setAlertMessage(`${err.response.data.errors}`);
      // setAlertMessage(`${err.response}`);
      setAlertOpen(true);
    }
  };

  // ================================================================================================
  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
  };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
カスタムフックは確かに通常の関数コンポーネントと違ってHTMLを返さないが、`useState`などのReactのフックは使用できる。
カスタムフックは、ロジックの再利用を可能にするReactの機能で、状態管理や副作用のロジックをカプセル化し、複数のコン
ポーネント間で共有できる。カスタムフック内で`useState`, `useEffect`, `useContext`などの標準的なReactフック
を使うことができる。
`useState`を使って、カスタムフック内でローカル状態を作成し、管理することができる。
カスタムフックの利点は、その内部で行われる状態管理や副作用のロジックを、複数のコンポーネントで簡単に共有できること
にある。これにより、コードの重複を減らし、保守性を向上させることができる。また、カスタムフックを使うことで、コンポ
ーネント自体はより宣言的で読みやすくなる。

================================================================================================
1.2
- この`useSignIn` フック内で `handleGetCurrentUser` が実行されているため、ユーザーがサインインするたびにユ
ーザー情報が更新される。
- このため、`AuthContext.tsx` の `useEffect` で `currentUser` を依存変数として設定する必要は特にない。
------------------------------------------------------------------------------------------------
setIsSignedIn(true);
setCurrentUser(res.data.data);
だとサインイン直後にHomePageに行ってもavatarが表示されない。
handleGetCurrentUser();だと問題ない。理由不明。非同期処理が関係？

================================================================================================
1.3
setAlertMessage:アラートのメッセージを管理、setAlertOpen:アラートの表示状態を管理、
setAlertSeverity:アラートの種類を管理

================================================================================================
2.1
`(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)` における型指定は、Reactのイベントハンドリングに
おいて、イベントオブジェクトの型を明示的に指定するために使われる。この型指定は以下の要素を含む：
- `React.MouseEvent`: これはReactの型定義であり、マウスイベントを扱うためのもの。この型は、マウスイベントに関
連するプロパティ（例えば、クリックされた位置の座標、どのマウスボタンがクリックされたかなど）やメソッド
（例えば、`preventDefault`）にアクセスすることを可能にする。
- `<HTMLButtonElement>`: この部分は、イベントが発生したDOM要素の型を指定する。ここでは`HTMLButtonElement`
としており、ボタン要素から発生したイベントを示している。これにより、イベントハンドラ内で`e.target`などを通じてボ
タン要素の特定のプロパティに型安全にアクセスできる。
- `MouseEvent`: これはJavaScriptの標準的なマウスイベントオブジェクトの型。Reactの`React.MouseEvent`はこ
の標準型に基づいている。
この型指定により、イベントハンドラ関数`handleSignIn`内で、イベントオブジェクト`e`を使う際に、マウスイベントに
関連するプロパティやメソッドを型安全に利用できる。また、イベントが発生した特定の要素（この場合はボタン）に関連する
情報も型安全に扱うことが可能になる。
------------------------------------------------------------------------------------------------
. `React.MouseEvent<HTMLButtonElement, MouseEvent>`はジェネリック型を使用したインターフェイス型です。
ここでのジェネリック型は、特定のHTML要素（この場合は`HTMLButtonElement`）と特定のイベントタイプ（この場合は
`MouseEvent`）を指定するために使われます。ジェネリック型を使用することで、さまざまなHTML要素やイベントタイプに対
応する汎用的な型を柔軟に定義できます。
------------------------------------------------------------------------------------------------
. ジェネリック型の使用例を以下に示します：

interface Response<T> {
  status: number;
  data: T;
}

function handleResponse<T>(response: Response<T>) {
  console.log(response.status);
  console.log(response.data);
}

// 使用例
const response1: Response<string> = { status: 200, data: "Success" };
const response2: Response<number> = { status: 404, data: 12345 };

handleResponse(response1); // 処理中のデータタイプはstring
handleResponse(response2); // 処理中のデータタイプはnumber
```
------------------------------------------------------------------------------------------------
この例では、`Response`というインターフェイスがジェネリック型`T`を用いて定義されています。`Response<T>`は、任意
のタイプ`T`の`data`フィールドを持つレスポンスオブジェクトを表します。`handleResponse`関数は、このジェネリック
型を使用して、異なるタイプのレスポンスデータを処理できます。これにより、型安全性を保ちながら柔軟なコードを書くこと
ができます。
------------------------------------------------------------------------------------------------
`handleSignIn`関数で型として`React.MouseEvent<HTMLButtonElement, MouseEvent>`を指定しているのは、その
関数が`SignInForm`のボタンでのクリックイベントに使用されているためだ。この型指定により、関数が扱うイベントがマウ
スのクリックイベントであり、発生源がHTMLのボタン要素であることを明示している。
これにより、クリックイベントに関連するプロパティ（やメソッド（例えば`preventDefault`）を安全に使用できる。

================================================================================================
2.2
. `useSignIn`内で`e.preventDefault();`を使用する意図は、ブラウザのデフォルトのフォーム送信動作を防ぐためです。
通常、HTMLフォームがサブミットされると、ページが再読み込みされたり、新しいページに移動したりします。Reactでは、フ
ォームのデータをJavaScriptで処理し、その結果をハンドリングすることが一般的です。`e.preventDefault();`は、この
標準的なフォーム送信をキャンセルし、代わりに`handleSignIn`関数で定義されたカスタム処理を行うために使用されます。

================================================================================================
2.3
useSignIn** における `res` オブジェクト：
- `AxiosResponse` オブジェクトの `data` プロパティである `res.data` を直接ロギングして使用しています。この
`data` には、Rails バックエンドからの実際のレスポンスペイロードが格納されています。
------------------------------------------------------------------------------------------------
- レスポンスの処理 res.headers`と `res.data`からアクセストークンやユーザー情報などの必要な情報を抽出します。こ
れは、ログイン成功後に認証やユーザーデータを処理する必要があるアプリケーションでの典型的な使用方法です。
*/