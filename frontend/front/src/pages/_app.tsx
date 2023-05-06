import type { AppProps } from 'next/app';
import Modal from 'react-modal';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

// 1 Appコンポーネントでアプリ全体の要素を設定する
Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }: AppProps) {
  console.log('_app.tsxが呼ばれた');
  return (
    <AuthProvider>
      <Component {...pageProps} />
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
*/
