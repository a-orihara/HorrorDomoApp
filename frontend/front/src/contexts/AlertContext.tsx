// Context用のコンポーネント作成の為、AlertContext.js というファイルを作成
// 1.createContext();でAlertContextというコンテキストオブジェクトを作成
// 2.AlertContextの値を提供する、AlertContext.Providerコンポーネントを返す、AuthProviderコンポーネントを作成
// 3.AuthProviderコンポーネントにて、AlertContextのProviderコンポーネントに渡す値（useState）を設定
import React, { createContext, useContext, useState } from 'react';

type AlertContextProps = {
  // open:molalの表示状態を管理する真偽値を定義
  alertOpen: boolean;
  setAlertOpen: (isOpen: boolean) => void;
  // severity:アラートの重要度を示す文字列を定義
  alertSeverity: 'error' | 'success' | 'info' | 'warning';
  setAlertSeverity: (severity: 'error' | 'success' | 'info' | 'warning') => void;
  // message:アラートに表示するメッセージを定義
  alertMessage: string;
  setAlertMessage: (message: string) => void;
};

type AlertProviderProps = {
  children: React.ReactNode;
};

// 1
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// @          @@          @@          @@          @@          @@          @@          @@          @
// 2
export const AlertProvider = ({ children }: AlertProviderProps) => {
  // アラートメッセージの表示非表示を管理するステート
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  // アラートメッセージの種類を管理するステート
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
  // アラートのメッセージ内容を管理するステート
  const [alertMessage, setAlertMessage] = useState<string>('');
  // console.log('AlertContextが呼ばれた');

  // ================================================================================================
  return (
    // AlertContextから提供する値をvalueに設定
    <AlertContext.Provider
      value={{ alertOpen, setAlertOpen, alertSeverity, setAlertSeverity, alertMessage, setAlertMessage }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// @          @@          @@          @@          @@          @@          @@          @@          @
// 3 AlertContextから値を取得し、undefinedの場合にエラーをスローするカスタムフック
export const useAlertContext = () => {
  // AlertContextの値(AlertContextProps型の各種値、もしくはundefined)を取得
  const context = useContext(AlertContext);
  // AlertContextの値がundefinedの場合にエラーをスローする
  if (context === undefined) {
    throw new Error('useAlertはAlertProviderの中で使用する必要があります。');
  }

  // ================================================================================================
  return context;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);において、
undefinedを設定する理由は、以下の2点です。

1.コンテキストのデフォルト値を設定するため:
createContext関数は、引数としてコンテキストの初期値を受け取ります。
undefinedを初期値として渡すことで、コンテキストの初期値をundefinedとして設定しています。
2.コンテキストが正しく提供されなかった場合にエラーをスローするため:
useContextフックを使用してコンテキストを参照する際、コンテキストが提供されていない場合にはundefinedが返されます。
そのため、useContextの戻り値がundefinedである場合には、useAlertカスタムフック内でエラーをスローしています。

その他、初期値を空オブジェクトにしない理由は、空オブジェクトのプロパティにアクセスしようとしてもTypeScriptはエラー
を出さないので、空オブジェクトの`{}`は同じ目的を果たすことはできない。この場合、すべてのプロパティに `undefined`
という値が入るだけで、不明瞭なバグが発生し、デバッグが困難になる可能性があります。

================================================================================================
2
AlertContext.Providerで_app.tsxの<Component {...pageProps} />を囲んで使用したりするので、contextの
Providerコンポーネントは、propsに通常childrenを設定する。
AlertProviderはAlertContextの値を提供する、AlertContext.Providerコンポーネントを返す。

================================================================================================
3
const { open, setOpen, severity, message } = useAlertContext();のように使う。
const { open, setOpen, severity, message } = useContext(AlertContext);と使い方が同じ。
useContextもAlertContextの値を取得するためのフックだが、こちらは値がundefinedの場合にエラーをスローしない。
*/
