/** @type {import('next').NextConfig} */
// 1
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
next.config.jsは、Next.jsアプリケーションのルートディレクトリに配置される設定ファイルです。
このファイルを使用することで、Next.jsの設定を変更することができます。

利用シーンとしては、例えば以下のような場合に使用されます。

- 画像やフォントなどの静的アセットの設定
- 環境変数の設定
- ビルド時の設定
- webpackの設定
- その他の設定

具体的には、以下のような設定が可能です。

- images: 画像の設定
- env: 環境変数の設定
- webpack: webpackの設定
- eslint: eslintの設定
- i18n: 国際化の設定
- typescript: TypeScriptの設定

================================================================================================
2
reactStrictMode:true（デフォルトの設定）
これはReactのStrict Modeを有効にし、開発モードでアプリケーションの潜在的な問題を検出するための機能を提供します。

swcMinify:true（デフォルトの設定）
これは、Next.jsアプリケーションのコードをSWCコンパイラを使用して最小化するオプションです。
*SWCコンパイラは、JavaScript/TypeScriptのコンパイラであり、Rustで実装されています。
Babelと同様に、コードを別の形式に変換するために使用されますが、SWCは高速であり、Rustの効率的なコンパイルエンジン
により、Babelよりも高速であるとされています。

images
画像の設定に関するオプションです。domainsプロパティにlocalhostを設定することで、このアプリケーションで使用する
画像のホストを指定しています。
この設定により、Next.jsのImageコンポーネントが表示する画像のURLが設定されます。


*/
