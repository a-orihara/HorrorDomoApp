import type { NextPage } from 'next';
import { useContext } from 'react';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../contexts/AuthContext';

const Home: NextPage = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  // ------------------------------------------------------------------------------------------------
  return (
    <Layout title='HOME'>
      <div className='p-4'>
        {/* 1 */}

        <h1 className='text-xl font-bold'>ホームページ</h1>
        <p className='mt-4'>ここにツイート一覧や、他のコンポーネントを追加できます。</p>
        {isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )}
      </div>
    </Layout>
  );
};

export default Home;

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

*/
