// Context用のコンポーネント作成の為、AuthContext.js というファイルを作成
// 1.createContext();でAuthContextというコンテキストオブジェクトを作成
// AuthContextのProviderコンポーネントに渡す値（useState）を設定
// 2.AuthContextのProviderコンポーネントでラップされた、AuthProviderコンポーネントを作成

import React, { createContext, useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../api/auth';
import { User } from '../types';

type AuthProviderProps = {
  children: React.ReactNode;
};
// 1
const AuthContext = createContext(
  {} as {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);
console.log(AuthContext);

// ------------------------------------------------------------------------------------------------
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 3
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  // 認証済みのユーザーがいるかどうかチェック。
  // 確認できた場合はそのユーザーの情報を取得。

  // 2 認証済みのユーザー情報を取得し、現在の認証状態を確認する
  const handleGetCurrentUser = async (): Promise<void> => {
    try {
      const res = await getAuthenticatedUser();
      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        console.log(res?.data.data);
      } else {
        console.log('No current user');
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // 4 コンポーネントがマウントされたとき、認証済みのユーザー情報を取得し、現在の認証状態を確認する
  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ------------------------------------------------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isSignedIn,
        setIsSignedIn,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Contextオブジェクトの作成はcreateContextで行います。
Contextではデータを渡す側をProviderと呼びデータを受け取る側をConsumerと呼びます。
作成したUserCountをexportしているのは他のコンポーネントでimportを行なって利用するためです。

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

------------------------------------------------------------------------------------------------
createContext の初期値として空オブジェクトを設定することで、AuthContext が作成される際に、特定の値がまだ設定
されていなくても、コンテキストが適切に機能するようになります。

asの利用意図:
as キーワードは、TypeScript の型アサーション（Type Assertion）を行うために使用されます。これにより、開発者が
型推論を上書きして、特定の型であることを明示できます。

このような型定義をする利用意図:
型定義をすることで、コンテキストが提供するプロパティと関数に対して型安全性が保証されます。これにより、開発者が誤っ
た型の値を使用したり、存在しないプロパティや関数にアクセスしようとすることを防ぐことができます。

asで規定した型以外のプロパティは使えない？
はい、as で指定した型以外のプロパティは、TypeScript が型チェックを行う際に、エラーが発生するため、使用すること
ができません。

これはどういう時に見られる一般的な設定？
これは、React のコンテキストを使用してアプリケーションの状態管理を行い、その状態を型安全に管理したい場合によく見
られる設定です。TypeScript と組み合わせることで、状態管理に関連するバグのリスクを軽減できます。

------------------------------------------------------------------------------------------------
currentUserをundefinedにすることで、現在のユーザーが存在しない状態を表現します。nullにする場合、あたかも値が存
在しているように見えることがありますが、undefinedであれば、値が存在しないことを明示的に示すことができます。

================================================================================================
2
getAuthenticatedUser()の返り値はユーザー情報か、undefinedです。
その場合、elseが実行さconsole.log("No current user")で終了。
tryで例外が発生すればcatchが実行される。

------------------------------------------------------------------------------------------------
if (res?.data.isLogin === true)
res? とオプショナルチェイニングが使われている理由は、getAuthenticatedUser() 関数が return; ステートメントで
早期に終了する場合があるためです。この場合、getAuthenticatedUser() の戻り値は undefined になります。オプショ
ナルチェイニングを使用することで、res が undefined の場合にアクセスしようとするプロパティが存在しないというエラー
が発生しなくなります。

res?.data.isLogin === true の式では、以下の処理が行われます。

1.res が undefined の場合、オプショナルチェイニングによって式全体が undefined になります。
2.res が undefined でない場合、res.data.isLogin の値が取得されます。
3.res.data.isLogin が true であれば、res?.data.isLogin === true の式全体が true になります。それ以外の
場合は、false になります。

オプショナルチェイニングを使用することで、res の値が undefined の場合でも、エラーが発生せず、安全にプロパティに
アクセスできるようになります。
オプショナルチェイニングを使用すると、エラーが発生せずにundefinedを返します。

================================================================================================
3
const [loading, setLoading] = useState(true);
初期値をfalseと設定した理由は、最初は認証されていない状態から始まり、認証処理が完了してユーザーがログインするまで
の間はfalseが維持されるからです。ログイン処理が完了した後には、isSignedInの値がtrueに更新されます。

------------------------------------------------------------------------------------------------
const [isSignedIn, setIsSignedIn] = useState(false);
通常、API通信は非同期で行われるため、初期値にfalseを設定すると、初期レンダリング時にAPI通信が完了していないため
に誤った結果が表示される可能性があります。そのため、初期状態ではAPI通信中であることを明示するため、trueを初期値と
して設定するのが一般的です。

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
AuthProvider を _app.tsx で使用すると、アプリケーション全体に認証機能を提供できます。AuthProvider の中にある
useEffect の利用意図は、コンポーネントがマウントされたとき（アプリケーションが読み込まれたとき）に、認証済みのユー
ザー情報を取得して、現在の認証状態を確認するためです。
AuthProvider をアプリケーション全体のルートコンポーネント（_app.tsx）で使用することで、全ての子コンポーネントが
レンダリングされる前に認証済みユーザーの状態が確認されるようになります。これにより、アプリケーション全体で認証情報を
一元的に管理でき、各ページやコンポーネントで繰り返し認証チェックを行う必要がなくなります。また、認証に関連する状態
（isSignedIn, currentUser など）や関数（setIsSignedIn, setCurrentUser など）を、アプリケーション内の他の
全てのコンポーネントで使い回すことができるようになります。
*/