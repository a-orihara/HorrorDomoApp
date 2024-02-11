import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthenticatedUser } from '../api/auth';
import { User } from '../types/user';
// import { useAlertContext } from './AlertContext';
// ================================================================================================

// AuthProviderコンポーネントの引数の型
type AuthProviderProps = {
  children: React.ReactNode;
};

// 1.1 下記のkeyを持つオブジェクトのAuthContextPropsという名前の型を作成
type AuthContextProps = {
  // 1.5
  loading: boolean;
  // 1.2
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  // 1.3
  handleGetCurrentUser: () => Promise<void>;
};

// 1.4 AuthContextを作成。AuthContext.Providerが受け取るvalueプロパティの型を間接的に指定
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// @          @@          @@          @@          @@          @@          @@          @@          @
// AuthContextのプロパティ、AuthContext.Providerを返すAuthProviderコンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 3 サインインのローディング中（ローディング中ならtrue）かどうかの状態を管理するステート
  const [loading, setLoading] = useState(true);
  // ログインしているかどうかの状態を管理するステート。初期値はfalse（サインインしていない）
  const [isSignedIn, setIsSignedIn] = useState(false);
  // 現在ログインしているユーザーの情報を管理するステート。初期値はundefined（未定義）
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  // const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();

  // ------------------------------------------------------------------------------------------------

  // 認証済みのユーザー情報を取得し、ユーザー情報や認証状態を更新する
  const handleGetCurrentUser = async () => {
    // console.log('handleGetCurrentUserが発火');
    try {
      // 2.1 現在のサインインユーザーのユーザー情報を取得
      const res = await getAuthenticatedUser();
      // console.log(`getAuthenticatedUserのres.data:${JSON.stringify(res?.data)}`);
      // 2.2 サインインしていたら。[if (res && res.data.isLogin === true)]と同じ意味
      if (res?.data.isLogin === true) {
        // サインイン状態に変更
        setIsSignedIn(true);
        // 現在のユーザー情報をセット
        setCurrentUser(res?.data.data);
        console.log(`？？handleGetCurrentUserのカレントユーザー:${JSON.stringify(res?.data.data)}`);
      } else {
        console.log('No current user');
      }
    } catch (err) {
      console.log(err);
      // ここをアラートモーダルの表示にすると、エラーの際にモーダル表示の連続になるのでalertで処理
      alert('サインインのユーザー情報を取得出来ませんでした');
    }
    // 1.6
    setLoading(false);
  };

  // 4 コンポーネントがマウントされたとき、認証済みのユーザー情報を取得し、ユーザー情報や認証状態を更新する
  useEffect(() => {
    handleGetCurrentUser();
    console.log('%cAuthContextのuseEffectが発火', 'color: red;');
  }, []);

  // ================================================================================================
  return (
    // 5 サインしているか、現在のユーザー、現在のユーザーを取得する処理、ローディング
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isSignedIn,
        setIsSignedIn,
        currentUser,
        setCurrentUser,
        handleGetCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuthContext関数を作成
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // 6
    throw new Error('useAuthContextはAuthProviderの内部で使用する必要があります');
  }
  return context;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
Context用のコンポーネント作成の為、AuthContext.js というファイルを作成
1.createContext();でAuthContextというコンテキストオブジェクトを作成
AuthContextのプロパティのProviderコンポーネントに渡す値（useState）を設定
2.AuthContextのProviderコンポーネントでラップされた、AuthProviderコンポーネントを作成
------------------------------------------------------------------------------------------------
Contextオブジェクトの作成はcreateContextで行います。
Contextではデータを渡す側をProviderと呼びデータを受け取る側をConsumerと呼びます。
作成したAuthContextをexportしているのは他のコンポーネントでimportを行なって利用するためです。

初期値に空オブジェクトを設定する意図は、コンテキストのデフォルト値を空のオブジェクトとして定義し、アプリケーション
全体で使用されるデータを保持するためのプレースホルダーを作成することです。このプレースホルダーには、アプリケーショ
ンが実際のデータを取得する前に、一時的な値としてアクセスできるようにすることができます。また、この初期値は、別の値
で上書きすることができるため、空のオブジェクトで定義することで柔軟性を持たせることもできます。
------------------------------------------------------------------------------------------------
asは、TypeScriptの型アサーションの一種であり、ある型に対して強制的に別の型を割り当てるために使用されます。

asの例
// 変数numは型推論によりnumber型として扱われる
let num = 10;

// 変数numをany型に型アサーションする
let anyNum = num as any;

// any型の変数anyNumをstring型に型アサーションする
let str = anyNum as string;

変数numをany型に型アサーションして、変数anyNumに代入しています。最後に、変数anyNumをstring型に型アサーションし
て、変数strに代入しています。
TypeScriptの型アサーションの一種である「as」は、開発者が明示的に型を規定するためのものです。asを使用することで、変
数や式の型を、開発者が事前に定義することができます。

================================================================================================
1.2
. `React.Dispatch<React.SetStateAction<boolean>>`の意味:
- `React.Dispatch<React.SetStateAction<boolean>>`は、Reactのステート（状態）を更新する関数の型を表してい
る。
- `React.Dispatch`は、何かアクション（この場合はステートの更新）を引き起こす関数を示す。
- `React.SetStateAction<boolean>`は、そのアクションがboolean型（真か偽か）の値を扱うことを意味する。
- つまり、この型は「boolean型の値でステートを更新する関数」を表している。

================================================================================================
1.3
. `handleGetCurrentUser: () => Promise<void>;`の`Promise<void>`の意味:
- `Promise<void>`は、非同期処理を行う関数の型を表している。`Promise`は、非同期処理（すぐに結果が出ない処理、例
えばサーバーからデータを取得する処理など）を扱う際に使われる。
- `<void>`は、この非同期処理が特に値を返さない（つまり、結果として何も返さない）ことを意味する。
- したがって、`handleGetCurrentUser: () => Promise<void>;`は「非同期処理を行うが、その処理が終わった後に特に何も返さない関数」という意味になる。この場合、おそらくユーザー情報を取得し、ステートを更新するが、その関数自体は値を返さない。

================================================================================================
1.4
この型定義は、AuthContext.Providerコンポーネントが受け取るvalueプロパティの型を間接的に指定しています。つまり、
AuthContext.ProviderのvalueにはAuthContextProps型のデータを渡すことができるということです。
------------------------------------------------------------------------------------------------
`currentUser`を`undefined`に設定する理由は以下の通りだ。
. **未定義の状態を明示するため**:
- `currentUser`が`undefined`の場合、現在のユーザーが存在しない、すなわちログインしていない状態を明確に示す。
- `null`ではなく`undefined`を使用することで、「まだ何も設定されていない」または「ユーザーが未認証」であることを
より明確に伝えられる。
------------------------------------------------------------------------------------------------
. **ログイン状態の明確化**:
- ユーザーがログインしていない時、`currentUser`は`undefined`になる。これは、ログイン前やログアウト後の状態を
表す。
- `null`を使用すると、値があるかのような誤解を招く可能性があるが、`undefined`を使うことで「値がまだ設定されてい
ない」または「ユーザー情報が存在しない」という状態をはっきりさせる。
------------------------------------------------------------------------------------------------
. **nullとundefinedの意味の違い**:
- `null`は一般的に「値が存在しない」を意味し、オブジェクトが「空」であることを示す。
- `undefined`は値が「未定義」であることを示し、変数がまだ値を持っていない状態を表す。
- JavaScriptでは`null`はオブジェクト型を持つが、`undefined`は独自の型を持つ。これにより、`undefined`を使う
ことで「何も設定されていない」という状態がより明確になる。

================================================================================================
1.5
AuthContext` 内の `loading` 状態は、現在のユーザの認証状態を取得する際の非同期性を管理するために設計されている。
具体的には、アプリケーションがユーザがログインしているかどうかを判定している間は `true` に設定され、その処理が完了
すると `false` に設定される。
loading` の状態をチェックすることで、コンポーネントは認証状態がわかっているときだけ条件付きでレンダリングしたりロ
ジックを実行したりすることができます。

================================================================================================
1.6
`AuthContext` の `loading` 状態は、主にユーザー認証に関するアプリの最初のロード状態を反映することを意図している。
handleGetCurrentUser` で `loading` を明示的に `false` に設定することは、この目的に適している。他の操作でロ
ード状態を操作する必要がある場合は、`AuthContext` 内で (グローバルに関連する場合)、または個々のコンポーネント内
で (ローカルなロード状態の場合) 個別に処理する必要があります。
================================================================================================
2.1
getAuthenticatedUser()の返り値はユーザー情報か、undefinedです。
その場合、elseが実行さconsole.log("No current user")で終了。
tryで例外が発生すればcatchが実行される。

================================================================================================
2.1
if (res?.data.isLogin === true)
res?.data`の`?`は、オプショナルチェーニング演算子。もし `res` が `undefined` ならば、エラーを投げる代わりに
`res?.data` は `undefined` を返します。これは、実行時エラーを防ぐのに役立つ。
もし `res` が `undefined` で、オプショナルチェーニングの演算子?を使わずに `res.data` にアクセスしようとすると、
JSは `undefined` のプロパティ `data` にアクセスできない、という `TypeError` を投げます。
------------------------------------------------------------------------------------------------
res?.data.isLogin === true の式では、以下の処理が行われます。
.res が undefined の場合、オプショナルチェイニングによって式全体が undefined になります。
.res が undefined でない場合、res.data.isLogin の値が取得されます。
.res.data.isLogin が true であれば、res?.data.isLogin === true の式全体が true になります。それ以外の
場合は、false になります。
------------------------------------------------------------------------------------------------
オプショナルチェイニングを使用することで、res の値が undefined の場合でも、エラーが発生せず、安全にプロパティに
アクセスできるようになります。エラーが発生せずにundefinedを返します。

================================================================================================
3
const [loading, setLoading] = useState(true);
通常、API通信は非同期で行われるため、初期値にfalseを設定すると、初期レンダリング時にAPI通信が完了していないため
に誤った結果が表示される可能性があります。そのため、初期状態ではAPI通信中であることを明示するため、trueを初期値と
して設定するのが一般的です。
------------------------------------------------------------------------------------------------
const [isSignedIn, setIsSignedIn] = useState(false);
初期値をfalseと設定した理由は、最初は認証されていない状態から始まり、認証処理が完了してユーザーがログインするまで
の間はfalseが維持されるからです。ログイン処理が完了した後には、isSignedInの値がtrueに更新されます。
------------------------------------------------------------------------------------------------
const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
currentUser の型を User | undefined と定義することで、初期値として undefined を設定できるようにしています。
このようにすることで、最初は currentUser が定義されていない状態から始め、認証済みのユーザーがいる場合には値がセッ
トされるようにすることができます。
また、User | undefined という型は、User 型と undefined 型のどちらかをとることができるという意味です。このた
め、currentUser が未定義の場合には undefined を返すようにしています。

================================================================================================
4
useEffectはReactのフックの1つで、コンポーネントがマウントされたときや更新されたときに実行される副作用（処理）を
定義するために使用されます。

handleGetCurrentUser関数は、認証済みのユーザー情報を取得し、現在の認証状態を確認するために使用されています。
useEffectフックは、currentUserの状態が更新されたときに、この関数が実行されるようにしています。つまり、ユーザー
がログインした状態でアプリケーションを開始した場合、currentUserが更新されるたびに、handleGetCurrentUser関数
が実行されて、認証状態が確認されます。これにより、認証状態を迅速に反映し、アプリケーション全体で正しい挙動を実現す
ることができます。
------------------------------------------------------------------------------------------------
発火するタイミング

.コンポーネントがマウントされた時（初回レンダリング時）useEffectはまず初回レンダリングする。
.その後、依存配列に指定されたsetCurrentUserが変更された時
ただし、setCurrentUserはReactのuseStateから返される関数であり、通常は変更されないため、このuseEffectは主にコ
ンポーネントがマウントされた時に実行されることになります。これにより、コンポーネントがマウントされた時に認証済みの
ユーザー情報を取得し、現在の認証状態を確認する処理が行われます。

依存配列にuseStateから返される関数（この場合はsetCurrentUser）を指定することで、useEffectはコンポーネントが
マウントされた時（初回レンダリング時）に実行されます。この例では、初回レンダリング時に認証済みのユーザー情報を取得
し、現在の認証状態を確認する処理が行われることを意図しています。
一般的には、初回レンダリング時のみuseEffectを実行させたい場合、依存配列に空の配列（[]）を指定するのが一般的です。
これにより、useEffectはコンポーネントがマウントされた時にのみ実行されます。
------------------------------------------------------------------------------------------------
この`useEffect`の目的は、コンポーネントがマウントされたときに一度だけ`handleGetCurrentUser`を実行すること。
そのため、依存配列が空のままで適切です。
依存配列が空の場合、`useEffect`内のコードはコンポーネントがマウントされた直後に一度だけ実行されます。依存配列に何
らかの変数を指定すると、その変数が変更されたときに`useEffect`内のコードが再度実行されます。
今回のケースでは、認証済みのユーザー情報を取得する`handleGetCurrentUser`関数はコンポーネントがマウントされた時
に一度だけ実行すればよいので、依存配列を空にするのが適切です。
------------------------------------------------------------------------------------------------
- `AuthContext.tsx` の `useEffect` には依存変数が設定されていないが、問題なく動作していることが確認できる。
- これは、`useSignIn` フック内で `handleGetCurrentUser` が実行されているため、ユーザーがサインインするたびに
ユーザー情報が更新される。
- このため、`AuthContext.tsx` の `useEffect` で `currentUser` を依存変数として設定する必要は特にない。
`handleGetCurrentUser` はサインイン時に別途実行されるため、状態は適切に管理されていると考えられる。

================================================================================================
5
AuthProviderコンポーネントでvalueプロパティに値を設定しています。
valueプロパティに渡すオブジェクトのプロパティは、
loading、setLoading、isSignedIn、setIsSignedIn、currentUser、setCurrentUserの6つです。
変数名valueは任意の名前です。

================================================================================================
6
このエラーメッセージは、`useAuthContext` は `AuthProvider` の子であるコンポーネントの内部でのみ使用する必要が
あることを述べています。もしそうでなければ、 `useContext(AuthContext)` は `undefined` を返すので、これを防ぐ
ために新しい Error を投げ、開発者が間違った場所でフックを使っていることを知らせます。
AuthContext.Providerの子であるコンポーネントの内部で使用すれば、undefinedではなく、初期値が設定された
AuthProviderのプロパティが返されます。
------------------------------------------------------------------------------------------------
Reactでは、Contextは、ツリーの各レベルに明示的にpropを渡すことなく、コンポーネント間で値を共有する方法を提供しま
す。アプリケーションの `AuthProvider` コンポーネントは、 `AuthContext.Provider` を使用してこれらの値を提供し
ます。
------------------------------------------------------------------------------------------------
AuthContext.Provider` の子コンポーネント： AuthContext.Provider` 内でレンダリングされるすべてのコンポーネン
トは、このプロバイダの子とみなされます。これらの子プロバイダーだけが `AuthContext.Provider` が提供する値に直接
アクセスすることができます。
------------------------------------------------------------------------------------------------
useAuthContext` フック： このカスタムフックは、基本的に `useContext(AuthContext)` のラッパーとして作成され
ます。このフックは、`AuthContext.Provider` の子プロパティの中で使用すると、現在のコンテキスト値
(`AuthContext.Provider` の value prop) を返します。
------------------------------------------------------------------------------------------------
`AuthContext.Provider` の子ではないコンポーネントで使用しようとすると、 `useContext(AuthContext)` は
`undefined` を返します。

@          @@          @@          @@          @@          @@          @@          @@          @
export const AuthContext = createContext(
  {} as {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    handleGetCurrentUser: () => Promise<void>;
  }
);
*/
