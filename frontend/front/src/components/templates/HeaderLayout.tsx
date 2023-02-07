// Headerをlayoutするテンプレート。
import { ReactNode } from 'react';
import { Footer } from '../organisms/Footer';
import { Header } from '../organisms/Header';
import Head from 'next/head';

type Props = {
  children: ReactNode;
  // <Head></Head>タグのタイトル
  title: string;
};

export const HeaderLayout = (props: Props): JSX.Element => {
  const { children } = props;
  return (
    <div className='container mx-auto flex min-h-screen flex-col outline'>
      <Head>
        <title>{props.title}</title>
        <meta charSet='utf-8' />
        <meta name='description' content='ホラー映画好きが集まる投稿サイトです' />
        {/* 4 */}
        <link rel='icon' href='/favicon.png' />
      </Head>
      {/* ヘッダーはヘッダー */}
      <Header></Header>
      {/* ここの[flex-1]は、全体に対するメイン画面に対して*/}
      <div className='flex flex-1 flex-col'>
        {/* ここの[flex-1]は、メイン画面に対するその中の子要素（この場合children）に対して*/}
        <main className='flex-1 bg-basic-orange outline'>{children}</main>
      </div>
      <Footer></Footer>
    </div>
  );
};
