// Headコンポーネントをimport
import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css';
// import PrimaryButton from "./atoms/button/PrimaryButton";

// -        --        --        --        --        --        --        --        -
// 型エイリアス
// コンポーネントに直接指定:Layout(props:{children:React.ReactNode ,title: string})
type Props = {
  children: React.ReactNode;
  title: string;
};

// 1
export const Layout = (props: Props) => {
  return (
    // jsx(tsx)ではclassではなく、classNameを使用
    <div className='basic-yellow container mx-auto flex min-h-screen flex-col outline'>
      {/* 2  */}
      <Head>
        <title>{props.title}</title>
        <meta charSet='utf-8' />
        <meta name='description' content='ホラー映画好きが集まる投稿サイトです' />
        {/* 4 */}
        <link rel='icon' href='/favicon.png' />
      </Head>

      <header className='text-s flex h-20 items-center bg-basic-yellow font-spacemono font-semibold outline md:text-2xl'>
        <h1 className='text-s ml-3 mr-auto text-center font-spacemono font-semibold tracking-tighter md:text-2xl'>
          Horror Domo App
        </h1>
        <Link href={`/`}>
          <p className='mr-3 cursor-pointer text-basic-pink duration-300 hover:text-hover-pink sm:mr-4 md:mr-12'>
            Home
          </p>
        </Link>
        <Link href={`/SignUp`}>
          <p className='mr-3 cursor-pointer tracking-tighter text-basic-pink duration-300 hover:text-hover-pink'>
            Log in
          </p>
        </Link>
      </header>

      <div className='flex flex-1 flex-col md:flex-row'>
        {/* <nav className="bg-orange-300 outline md:w-56"> */}
        {/* </nav> */}
        <main className='flex-1 bg-basic-orange outline'>{props.children}</main>
      </div>

      <footer className='flex h-11 items-center justify-center bg-basic-yellow text-sm text-black outline md:h-14'>
        @Ori 2022
        {/* <span > */}
        {/* /public/vercel.svgの省略形 */}
        {/* <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} /> */}
        {/* </span> */}
      </footer>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
関数コンポーネントは型指定しないと、JSX.Element型になる。
現在FC、VFCは使われない傾向。下記のようにpropsに型指定する。

-          --          --          --          --          --          --          --          -
親Componentのタグの間に入れられた要素を、子Componentにprops経由で渡し、それを子Componentで表示する
*親側Homeコンポーネントで、子側Layoutコンポーネントの内容を指定する。
親側Homeコンポーネント:<Layout>テキスト情報</Layout>
*子で受け取る
子側Layoutコンポーネント:<main>{props.children}</main>
Propsとは「プロパティ：Propertys」の略称.

=          ==          ==          ==          ==          ==          ==          ==          =
2
Headタグ
Headタグ(Next.jsで自動で<head>に変換)内にはmetaタグやlinkタグを設定する
Next.jsでは基本的にHeadタグを使ってmetaデータを更新する

-          --          --          --          --          --          --          --          -
headタグ:HTMLの文書のヘッド部は、ページが読み込まれてもウェブブラウザーには表示されない部分です。
この部分には、例えば、<title> といった情報や CSS へのリンク（HTML を CSS で修飾する場合）、
独自のファビコンへのリンク、そしてほかのメタデータ（HTML を誰が書いたのかとかその HTML を表現する
重要なキーワードなど）の情報を含んでいます。

-          --          --          --          --          --          --          --          -
titleタグ:Googleで検索した時に1番最初に表示されるのがTOPページに書かれたtitleテキスト。

metaタグとは、Webページのメタ情報（そのデータを表す属性や関連する情報を記述したデータ）を指定し、
ブラウザや検索エンジン、ソーシャルメディアにWebページの情報を知らせるためのタグのこと。
*charset:文字コード。日本語は"utf-8"を指定。文字エンコーディングを指定しないと、英語版のブラウ
ザで日本語で作成されたウェブページにアクセスした場合などに文字化けが起きる可能性がある。
*description:Webページの概要や内容などを指定するためのタグ。
meta name="description" content="<内容を記載>"

linkタグ
「そのページ」と「外部のファイルやページ」を関連づける。基本的にheadタグ内に書く。基本的に訪問者
の目には入らない、ブラウザや検索エンジンに向けた情報や指示を書くためのタグ。
aタグとは役割が大きく違う。aタグはbodyタグ内でリンクを貼るために使われる。
relでファイルとの関係性を、hrefで そのファイルがある場所（URL）を指定します。rel="stylesheet"や、
rel="icon"などがある。ここではタグ部分のアイコン表示に使われている。

@        @@        @@        @@        @@        @@        @@        @@        @
Tailwind CSS
@        @@        @@        @@        @@        @@        @@        @@        @
min-h-screen:min-height: 100vh;
コンテンツが増えても画面が見切れないように、高さの下限を画面一杯に設定。

-       --       --       --       --       --       --       --       --       -
outline:outline-style: solid;
外側に枠線を書く。

-       --       --       --       --       --       --       --       --       -
container:要素の幅を現在のブレークポイントに固定するためのコンポーネント

-       --       --       --       --       --       --       --       --       -
flex:flexコンテナ内にflexアイテムを設定
flex-col(row):コンテナの主軸(flex-directionで水平か垂直か)を指定
クロス軸 (交差軸) は、主軸 (メイン軸) と交差する軸(flex-directionが水平なら縦、垂直なら横)。

justify-contentプロパティは、flexコンテナの主軸に沿ってflexアイテムを一行に配置します
justify-content: center;アイテムを中央に寄せて配置。

align-items: center;アイテムの配置方法。centerでアイテムを中央に寄せて配置。
*[justify-content: center]と[align-items: center]で中央の真ん中に寄せている

vw	viewport width	ビューポートの幅に対する割合
vh	viewport height	ビューポートの高さに対する割合

flex: 1;
flex-grow、flex-shrink、flex-basisの3つのプロパティのショートハンド（省略形）。
「flex-grow: 1;」、「flex-shrink: 1;」、「flex-basis: 0;」の3つ同時に指定したことと同じ意味
になります。
flex-growは、親要素のflexコンテナの余っているスペースを、子要素のflexアイテムに分配して、flexアイ
テムを伸ばすプロパティです。flex-growの値は整数値のみで、flexアイテムが伸びる比率を指定します。

-       --       --       --       --       --       --       --       --       -
tracking-tighter:letter-spacing: -0.05em;
文字間の幅を指定

-       --       --       --       --       --       --       --       --       -
md:@media (min-width: 768px)
スクリーンサイズが768px以上の場合に適用

mr-auto:margin-right: auto;
marginの値にautoを指定すると、[親要素の横幅 - 指定した要素の横幅]によりmarginを自動で算出します。
子要素が左寄せになる
*/
