import Head from 'next/head';
import React from 'react';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

// flexを子に適用
const Layout = ({ children, title = 'HorrorDomoApp' }: LayoutProps) => {
  return (
    <div className='container mx-auto flex min-h-screen min-w-full flex-col font-spacemono outline'>
      {/* 1 */}
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='description' content='ホラー映画好きが集まる投稿サイトです' />
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
1
Headタグ
Headタグ(Next.jsで自動で<head>に変換)内にはmetaタグやlinkタグを設定する
Next.jsでは基本的にHeadタグを使ってmetaデータを更新する

------------------------------------------------------------------------------------------------
headタグ:HTMLの文書のヘッド部は、ページが読み込まれてもウェブブラウザーには表示されない部分です。
この部分には、例えば、<title> といった情報や CSS へのリンク（HTML を CSS で修飾する場合）、
独自のファビコンへのリンク、そしてほかのメタデータ（HTML を誰が書いたのかとかその HTML を表現する
重要なキーワードなど）の情報を含んでいます。

------------------------------------------------------------------------------------------------
titleタグ:Googleで検索した時に1番最初に表示されるのがTOPページに書かれたtitleテキスト。

------------------------------------------------------------------------------------------------
metaタグとは、Webページのメタ情報（そのデータを表す属性や関連する情報を記述したデータ）を指定し、
ブラウザや検索エンジン、ソーシャルメディアにWebページの情報を知らせるためのタグのこと。
*charset:文字コード。日本語は"utf-8"を指定。文字エンコーディングを指定しないと、英語版のブラウ
ザで日本語で作成されたウェブページにアクセスした場合などに文字化けが起きる可能性がある。
*description:Webページの概要や内容などを指定するためのタグ。
meta name="description" content="<内容を記載>"

------------------------------------------------------------------------------------------------
linkタグ
「そのページ」と「外部のファイルやページ」を関連づける。基本的にheadタグ内に書く。基本的に訪問者
の目には入らない、ブラウザや検索エンジンに向けた情報や指示を書くためのタグ。
aタグとは役割が大きく違う。aタグはbodyタグ内でリンクを貼るために使われる。
relでファイルとの関係性を、hrefで そのファイルがある場所（URL）を指定します。rel="stylesheet"や、
rel="icon"などがある。ここではタグ部分のアイコン表示に使われている。

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
