import Head from 'next/head';
import React from 'react';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';

type LayoutProps = {
  // title?: string;
  children: React.ReactNode;
  title: string;
};

// flexを子に適用
const Layout = ({ children, title = 'HorrorDomoApp' }: LayoutProps) => {
  return (
    <div className='container mx-auto flex h-full min-h-screen min-w-full flex-col font-spacemono  outline'>
      {/* 2 */}
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='description' content='ホラー映画好きが集まる投稿サイトです' />
        {/* 4 */}
        <link rel='icon' href='/favicon.png' />
      </Head>

      <Header></Header>

      <main className='basic-border basic-border flex flex-1 flex-row bg-basic-orange'>{children}</main>

      <Footer></Footer>
    </div>
  );
};

export default Layout;

/*
@          @@          @@          @@          @@          @@          @@          @@          @

@          @@          @@          @@          @@          @@          @@          @@          @
tailwind css
------------------------------------------------------------------------------------------------
container:要素の幅を現在のブレークポイントに固定するためのコンポーネント。
Tailwind CSSで定義されたクラスで、コンテンツの横幅を最大限の横幅(要素の幅を現在のブレークポイント)に制限するコン
テナ要素を表します。このクラスは、コンテンツが横幅いっぱいに広がりすぎないように制限するためによく使用されます。

================================================================================================
min-h-screen:min-height: 100vh;
画面の最小の高さを画面の高さに合わせるために使用されるTailwind CSSのクラスです。これにより、コンテンツがページ全
体の高さに広がり、画面にスクロールバーが表示されなくなります。このクラスは、一般的にWebページのコンテナ要素に使用
されます。

================================================================================================
mx-auto は、水平方向の余白を自動的に均等に設定するTailwind CSSのクラスです。これにより、要素が中央に配置されま
す。主に、幅が可変である要素に対して使用されます。

================================================================================================
flex-1
flex-grow、flex-shrink、flex-basisの3つのプロパティのショートハンド（省略形）。
「flex-grow: 1;」、「flex-shrink: 1;」、「flex-basis: 0;」の3つ同時に指定したことと同じ意味
になります。
flex-growは、親要素のflexコンテナの余っているスペースを、子要素のflexアイテムに分配して、flexアイテムを伸ばすプ
ロパティです。flex-growの値は整数値のみで、flexアイテムが伸びる比率を指定します。
親要素に対して子要素を均等に配置するために使用されます。

*/
