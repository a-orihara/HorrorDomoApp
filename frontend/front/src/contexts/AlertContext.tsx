// 1
import React, { createContext, useContext, useState } from 'react';

// AlertContextの引数の型を設定
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

// 1.1 子のコンポーネントを受け取れるようにする
type AlertProviderProps = {
  children: React.ReactNode;
};

// 1.2 AlertContextを引数<AlertContextProps | undefined>の型の初期値(undefined)で作成
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// @          @@          @@          @@          @@          @@          @@          @@          @
// 2.1 AlertContextプロパティの、AlertContext.Providerコンポーネントを返す、AuthProviderコンポーネントを作成
export const AlertProvider = ({ children }: AlertProviderProps) => {
  // アラートメッセージの表示非表示を管理するステート
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  // 2.2 アラートメッセージの種類を管理するステート
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
  // アラートのメッセージ内容を管理するステート
  const [alertMessage, setAlertMessage] = useState<string>('');

  // ================================================================================================
  return (
    // 2.3 AlertContext.Providerコンポーネントを返す。AlertContextから提供する値をvalueに設定
    <AlertContext.Provider
      value={{ alertOpen, setAlertOpen, alertSeverity, setAlertSeverity, alertMessage, setAlertMessage }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// @          @@          @@          @@          @@          @@          @@          @@          @
// 3.1 AlertContextから値を取得し、undefinedの場合にエラーをスローするカスタムフック
export const useAlertContext = () => {
  // 3.2 AlertContextの値(AlertContextProps型の各種値、もしくはundefined)を取得
  const context = useContext(AlertContext);
  // AlertContextの値がundefinedの場合にエラーをスローする
  if (context === undefined) {
    // 3.3
    throw new Error('useAlertContextはAlertProviderの内部で使用する必要があります。');
  }
  // ================================================================================================
  return context;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Context用のコンポーネント作成の為、AlertContext.js というファイルを作成
1.createContext();でAlertContextというコンテキストオブジェクトを作成
2.AlertContextプロパティの、AlertContext.Providerコンポーネントを返す、AuthProviderコンポーネントを作成
3.AuthProviderコンポーネントにて、AlertContextプロパティのProviderコンポーネントに渡す値（useState）を設定

================================================================================================
1.1
シンプルな親コンポーネントと子コンポーネントの作成例と使用例を説明する。
まず、`Box`という親コンポーネントを作成します。このコンポーネントは`children`プロパティを受け取り、それを表示。

```
import React from 'react';

type BoxProps = {
  children: React.ReactNode;
};

# 分割代入
const Box = ({ children }: BoxProps) => {
  return <div style={{ border: '2px solid blue', padding: '10px', margin: '5px' }}>{children}</div>;
};

export default Box;
```
------------------------------------------------------------------------------------------------
次に、`Box`コンポーネントを使用する子コンポーネントを作成します。例として、`Text`というコンポーネントを作成

```
import React from 'react';

const Text = () => {
  return <p>ここは子コンポーネントの内容です。</p>;
};

export default Text;
```
------------------------------------------------------------------------------------------------
最後に、これらのコンポーネントを使った使用例です。

```
import React from 'react';
import Box from './Box';
import Text from './Text';

const App = () => {
  return (
    <div>
      <Box>
        <Text />
      </Box>
    </div>
  );
};

export default App;
```
------------------------------------------------------------------------------------------------
この例では、`App`コンポーネント内で`Box`（親コンポーネント）を使用し、その中に`Text`（子コンポーネント）を配置し
ています。`Box`コンポーネントは受け取った`children`（この場合は`Text`コンポーネント）を青い枠の中に表示します。

================================================================================================
1.2
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);において、
undefinedを設定する理由は、以下の2点です。
------------------------------------------------------------------------------------------------
.コンテキストのデフォルト値を設定するため:
createContext関数は、引数としてコンテキストの初期値を受け取ります。
コンテキストの初期値をundefinedとして設定しています。
.コンテキストが正しく提供されなかった場合にエラーをスローするため:
useContextフックを使用してコンテキストを参照する際、コンテキストが提供されていない場合にはundefinedが返されます。
そのため、useContextの戻り値がundefinedである場合には、useAlertカスタムフック内でエラーをスローしています。
------------------------------------------------------------------------------------------------
その他、初期値を空オブジェクトにしない理由は、空オブジェクトのプロパティにアクセスしようとしてもTypeScriptはエラー
を出さないので、空オブジェクトの`{}`は同じ目的を果たすことはできない。この場合、すべてのプロパティに `undefined`
という値が入るだけで、不明瞭なバグが発生し、デバッグが困難になる可能性があります。
------------------------------------------------------------------------------------------------
コンテキストの初期値を`undefined`に設定する理由はプログラムがちゃんと動いているかどうかを確認するため。
. **はじめに何も設定されていない状態を作るため**:
`createContext`は、スタート時にどんな情報を持っているかを設定するために使う。ここで`undefined`を使うと、「まだ
何も設定されていないよ」という状態を作ることができる。これがあると、後で「このコンテキストはちゃんと設定されたかな？
」と確認するときに役立つ。
. **間違いがあった時にすぐ気づけるようにするため**:
`useContext`っていう機能を使ってこのコンテキストをどこかで呼び出すとき、もし何も設定されてなかったら`undefined`
が返ってくる。だから、もし`undefined`が返ってきたら、「あ、このコンテキストはどこかで間違えて設定されてないな」と
すぐに分かる。
. また、空のオブジェクト`{}`を使わないのは、それだと「ちゃんと設定されているのか、されていないのか」が分かりにくく
なるからだよ。空のオブジェクトだと、エラーが起きてもすぐには気づけないかもしれない。
------------------------------------------------------------------------------------------------
. `null`ではなく`undefined`を使用する理由は、JavaScriptとTypeScriptにおける`undefined`と`null`の意味の違
いに基づく。`undefined`は「値が未定義である」を意味し、これはコンテキストがまだ設定されていない状態を表すのに適し
ている。一方で、`null`は「値が意図的に空である」を意味し、これは異なる意味合いを持つ。`null`を使用すると、コンテ
キストが意図的に空であると誤解される可能性があるため、`undefined`の方が適切である。また、`undefined`は、
JavaScriptにおいてより「自然な」未初期化状態を表すため、一般的に好まれる。

================================================================================================
2.1
AlertContext.Providerで_app.tsxの<Component {...pageProps} />を囲んで使用したりするので、contextの
Providerコンポーネントは、propsに通常childrenを設定する。
AlertProviderコンポーネントは、AlertContextの値を提供する、AlertContext.Providerコンポーネントを返す。

================================================================================================
2.2
. <'error' | 'success' | 'info' | 'warning'>('error');`の解説:
- `useState`を使って、アラートの種類を設定できるようにしている。
- `'error'`, `'success'`, `'info'`, `'warning'`の４種類があり、それぞれ「エラー」「成功」「情報」「警告」
を意味する。
- はじめの状態は`'error'`に設定されている。つまり、何も設定しなければ、アラートは「エラー」として表示される。
------------------------------------------------------------------------------------------------
- アラートは異なる状況や目的で使われる。たとえば、ユーザーが何か間違いを犯した時は「エラー(error)」、何かがうまく
いった時は「成功(success)」、情報を知らせるだけの時は「情報(info)」、注意が必要な時は「警告(warning)」を使う。
================================================================================================
2.3
. `<AlertContext.Provider value={{ alertOpen, setAlertOpen, alertSeverity, setAlertSeverity, alertMessage, setAlertMessage }}>{children}</AlertContext.Provider>`の解説:
- これは`AlertContext.Provider`コンポーネントを返している。
- `value`というプロパティに、アラートの状態と設定を変更する関数を設定している。
- `{children}`は、このコンポーネント内で表示する他のコンポーネント（子コンポーネント）を意味する。
- つまり、このコードはアラートの情報を持つコンテキストを提供し、その中で子コンポーネントを表示する仕組みを作る。
------------------------------------------------------------------------------------------------
. `AlertProvider`の引数を`AlertContext.Provider`に渡しているかの解説:
- `AlertProvider`は、子コンポーネント（`children`）を引数として受け取る。
- この`children`は、`AlertContext.Provider`に渡される。
- つまり、`AlertProvider`の引数（子コンポーネント）は、`AlertContext.Provider`を通じて他のコンポーネントに情
報を提供する役割を果たしている。
- これにより、`AlertProvider`内で設定されたアラートの状態や関数が、子コンポーネントに渡され、使用できるようになる。

================================================================================================
3.1
const { open, setOpen, severity, message } = useAlertContext();のように使う。
const { open, setOpen, severity, message } = useContext(AlertContext);と使い方が同じ。
useContextもAlertContextの値を取得するためのフックだが、こちらは値がundefinedの場合にエラーをスローしない。

================================================================================================
3.2
. `useContext(AlertContext)`について:
- `useContext`はReactで提供されるフックの一つで、関数です。
- `useContext(AlertContext)`の場合、`AlertContext`というコンテキスト（共有されるデータ）からデータを取得し
て、それを使用するコンポーネントで使えるようにするために使われます。
- これにより、使用するコンポーネントは`AlertContext`に保存されたデータ（アラートの状態や関数など）にアクセス可。

================================================================================================
3.3
. `throw new Error('useAlertはAlertProviderの中で使用する必要があります。');`でエラーをスローする意図:
- このコードは、`useAlertContext`フックが`AlertProvider`コンポーネントの外で使われている場合にエラーを出すた
めに使われます。
- `AlertContext`のデータは`AlertProvider`内で提供されるため、このフックは`AlertProvider`の内側でのみ機能し
ます。
- もし`AlertProvider`の外でこのフックを使うと、コンテキストのデータにアクセスできないため、エラーが発生します。
- このエラーは、開発者がこの問題に気付き、修正できるようにするためのものです。
*/
