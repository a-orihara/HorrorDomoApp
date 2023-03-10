// 1

import { useRouter } from 'next/router';
import PrimaryButton from '../components/atoms/PrimaryButton';
import { HeaderLayout } from '../components/templates/HeaderLayout';
// import { Inter } from "@next/font/google";
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // 3
  const router = useRouter();
  const onClickHome = (): void => {
    router.push('/');
  };
  return (
    <HeaderLayout title='HOME'>
      <div className='mx-auto px-6 py-16 pt-28 text-center'>
        <h1 className='mb-36 scale-y-150 text-center font-spacemono text-4xl font-semibold tracking-tighter text-black md:text-6xl'>
          Welcome to the Horror Domo App!
        </h1>
        <div className='pt-10'>
          <PrimaryButton onClick={onClickHome}>Sign up!</PrimaryButton>
        </div>
      </div>
    </HeaderLayout>
  );
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
このファイルはインデックスルート。ルーターはindexという名前のファイルをディレクトリのルートとしてルーティングしま
す。
URL で末尾のファイルを指定しない場合は、自動的にそのディレクトリ内の index.js にアクセスされるようになります。

-          --          --          --          --          --          --          --          -
pagesディレクトリ直下の構成がそのままルーティング構成になる。
例：pages/test/momo.tsx -> localhost:4000/pages/test/momo
それぞれのファイル(momo.tsx)で、Reactコンポーネントを返す関数を定義し、その関数をエクスポートする。
エクスポートする関数とファイル名は慣習的に同一とする。

-          --          --          --          --          --          --          --          -
※Next.jsでは、デフォルトで全てのページでプリレンダリングが有効化されています。
*プリレンダリング:事前にHTMLを生成。通常のReactアプリケーション(SPA)の場合、ユーザーがWebページにアクセスし、Web
ページを表示する時にブラウザ側でHTMLを生成します。（クライアントサーバーレンダリング）。プリレンダリングでは、ユーザ
ーがアクセスする前に事前にNext.jsのサーバーでHTMLを生成し、その用意されたHTMLをユーザーに提供する方式となっていま
す。そのため、ブラウザの負荷を下げて表示を高速化することができます。Next.jsでは、2種類のプリレンダリング方式（SSR・
SSG）があり、それぞれページごとに自由に選択して実装することができます。

=          ==          ==          ==          ==          ==          ==          ==          =
2
styles/Home.module.cssのstyleを[styles]という名前でimport。[styles.container]のような形で使用。
stylesディレクトリ下のcssファイルはどのコンポーネントからでも使えるcss。他のファイルからもこの
Home.module.cssは使用可能。
cssモジュール(.module.css)を使うと、ビルド時にクラス名やIDへ接頭辞や接語尾がランダムに作成される。

=          ==          ==          ==          ==          ==          ==          ==          =
3
next/routerは、routerオブジェクトにアクセスするためのパッケージ。
useRouter と withRouter(とそれらの型)をexportしていますが、
関数Component → useRouter
クラスComponent → withRouter
と覚えておけばOKです。両方とも、routerオブジェクトが返されます。

-          --          --          --          --          --          --          --          -
routerオブジェクト
基本的にはNext.jsに最適化されたwindow.locationやwindow.historyみたいなもので、url関連の情報を取得・操作する
ための処理が含まれています。

-          --          --          --          --          --          --          --          -
router.push

クライアント側の遷移処理をおこないます。基本的な書き方は、router.push(url, as, options);です。
型：
push(url: Url, as?: Url, options?: TransitionOptions): Promise<boolean>;
asは基本undefined（何も書かなくても）で良いです。また、optionsの型は下記になります。

interface TransitionOptions {
  shallow?: boolean;        // 浅いルーティングにするか (デフォは false)
  locale?: string | false;  // 新しいページのロケール設定
  scroll?: boolean;         // 遷移後に先頭にスクロールするか (デフォはtrue)
}

-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

=          ==          ==          ==          ==          ==          ==          ==          =
5
Nextpage型はNext.jsが用意している型。
pagesのための型。受付るpropsを決め、NextPage<Props>のように指定する。
NextPage<Props>でpropsが入るpagesである事を明示。

-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

@        @@        @@        @@        @@        @@        @@        @@        @
tailwind css
@        @@        @@        @@        @@        @@        @@        @@        @
min-h-screen(min-height: 100vh;):要素の高さの最小値を設定します。
vh(view height)は、要素のサイズを指定する単位の1つで、100vhは、スマホの画面の高さを示します。
Min-Height:要素の高さの最小値を設定するためのユーティリティです。

-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
flex(display: flex):フレックスを使用して、ブロックレベルのフレックスコンテナを作成します。flexbox
コンテナ(親要素)の子要素は自動的にflexboxアイテムのなり、さまざまなレイアウトが可能になります。

flex: 1(flex: 1 1 0%):「flex: 1;」は、「flex: 1;」は「flex-grow: 1;」として解釈される為、「flex-grow: 1;」、
「flex-shrink: 1;」（デフォルト値）、「flex-basis: 0;」の3つ同時に指定したことと同じ意味になります。
（flex-grow）:親要素のflexコンテナの余っているスペースを、子要素のflexアイテムに分配して、flexアイテ
ムを伸ばすプロパティです。「flex-grow: 1;」をそれぞれのflexアイテムに指定した場合は空きスペースが均等
に分配されます。

flex-col(flex-direction: column):フレックスアイテムを縦に配置する。

justify-around(justify-content: center):コンテナの主軸（コンテナの並びの中心）の中心に沿ってアイ
テムを整列させる。
Justify Content:flexboxアイテムを配置する際に、開始点や終了点、中心からの配置が可能になります。
コンテナの主軸に沿ってフレックスやグリッドアイテムがどのように配置されるかを制御するユーティリティです。

items-center(align-items: center):flexboxコンテナのクロス軸(縦並びなら横軸、横並びなら縦軸)の幅
に合わせて、flexboxアイテムを伸縮します
-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
-   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
Linkタグはprefetch機能で予め遷移先の情報を取得する

jsxがブラウザで読み込まれるとdomになる。それをreactではマウントという

イベントにはユーザーがアクションするものと、何かしらのタイミングで起こるものとの2種類ある

アロー関数の型定義
const increment = (num: number): number => num + 1;
関数の型定義
const increment: Increment = (num: number): number => num + 1;

@          @@          @@          @@          @@          @@          @@          @@          @
デフォルトのHome画面

<>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-red-500">
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
*/
