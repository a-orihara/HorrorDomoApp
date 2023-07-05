import type { AppProps } from 'next/app';
import Modal from 'react-modal';
import { AlertProvider } from '../contexts/AlertContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PostProvider } from '../contexts/PostContext';
import '../styles/globals.css';

// 1 Appコンポーネントでアプリ全体の要素を設定する
Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }: AppProps) {
  // console.log('_app.tsxが呼ばれた');
  return (
    <AuthProvider>
      <AlertProvider>
        <PostProvider>
          <Component {...pageProps} />
        </PostProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default MyApp;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Modal.setAppElement('#__next');
React Modalの setAppElement 関数を使用して、モーダルを開いたときに screen reader がアプリのメインコンテンツ
を読み上げないようにするために、アプリ全体の要素を設定するためのものです。
React Modalでモーダルを使用する際に必要な設定の1つであり、モーダルが開かれたときに screen reader がアプリのメ
インコンテンツを読み上げないようにするために、アプリ全体の要素を設定するために記述されています。
モーダルが開かれたときに、screen reader がアプリのメインコンテンツを読み上げると、モーダルの内容が意図せず
screen reader に読み上げられてしまい、ユーザーが混乱する可能性があります。
*screen reader
コンピュータの画面上のテキストやUI要素を音声合成技術で読み上げることができ、視覚障害のある人々にとって情報へのアク
セシビリティを向上させる役割を持っています。

setAppElement
React Modal によって提供される関数で、アプリ全体の要素を設定するために使用されます。これにより、モーダルが開かれ
たときに、screen reader がメインコンテンツを読み上げないようにすることができます。

('#__next')
これは、Next.jsアプリケーションで、アプリ全体の要素を示すための要素を指定しています。#__next は、Next.jsアプリ
ケーションのルート要素であり、React Modalを含む他のコンポーネントがレンダリングされます。

================================================================================================
2
ここでの`useEffect`は、`loading`ステートと`isSignedIn`ステートのいずれかが変化した時にトリガーされます。依存配
列に両方のステートを含める理由は、それぞれのステートが変化した時に特定の処理（リダイレクト）を行いたいからです。

- `loading`: このステートは非同期処理（ここでは認証済みのユーザー情報の取得）が終了したことを示します。この非同期
処理が終了した時点で、ユーザーがサインインしているかどうかをチェックしたいため、このステートの変化に反応して処理を行
います。
- `isSignedIn`: このステートはユーザーがサインインしているかどうかを示します。もしユーザーがサインアウトした場合
（つまり`isSignedIn`が`false`に変わった場合）、ユーザーをサインインページにリダイレクトするため、このステートの変
化にも反応します。
------------------------------------------------------------------------------------------------
routerを含めるのは、lintのエラーが出るため。
lintのルール：
useEffectの依存配列にrouterが含まれていないために発生します。React Hookのルールとして、useEffect内で参照される
すべての変数（state, props, context, refs）は依存配列に含める必要がある。
routerオブジェクトが変更されたときに、useEffect内の処理がトリガーされるようになります。ただし、Next.jsの
useRouterフックによって提供されるrouterオブジェクトは通常、アプリケーションのライフサイクル全体で不変です。そのた
め、実際の動作にはほとんど影響を及ぼさないと考えられます。

*/
