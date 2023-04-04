import Head from 'next/head';
import React from 'react';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';

type LayoutProps = {
  // title?: string;
  children: React.ReactNode;
};

// flexを子に適用
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='basic-yellow container mx-auto flex min-h-screen min-w-full flex-col outline'>
      {/* 2 */}

      <Header></Header>

      <div className='flex flex-1 flex-col md:flex-row'>
        <main className='flex-1 bg-basic-orange outline'>
          <h1>メイン部分</h1>
          {children}
        </main>
      </div>

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
