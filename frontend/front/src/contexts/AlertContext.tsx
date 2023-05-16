// Context用のコンポーネント作成の為、AlertContext.js というファイルを作成
// 1.createContext();でAlertContextというコンテキストオブジェクトを作成
// 2.AlertContextの値を提供する、AlertContext.Providerコンポーネントを返す、AuthProviderコンポーネントを作成
// 3.AuthProviderコンポーネントにて、AlertContextのProviderコンポーネントに渡す値（useState）を設定
import React, { createContext, useContext, useState } from 'react';

type AlertContextProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  severity: 'error' | 'success' | 'info' | 'warning';
  message: string;
  setSeverity: (severity: 'error' | 'success' | 'info' | 'warning') => void;
  setMessage: (message: string) => void;
};

type AlertProviderProps = {
  children: React.ReactNode;
};

// 1
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// 2
export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
  const [message, setMessage] = useState<string>('');

  return (
    <AlertContext.Provider value={{ open, setOpen, severity, setSeverity, message, setMessage }}>
      {children}
    </AlertContext.Provider>
  );
};

// 3 AlertContextから値を取得し、undefinedの場合にエラーをスローするカスタムフック
export const useAlertContext = () => {
  // AlertContextの値(AlertContextProps型の各種値、もしくはundefined)を取得
  const context = useContext(AlertContext);
  // AlertContextの値がundefinedの場合にエラーをスローする
  if (context === undefined) {
    throw new Error('useAlertはAlertProviderの中で使用する必要があります。');
  }
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
