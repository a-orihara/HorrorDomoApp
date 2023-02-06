/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// ここに設定を書き込んでいきます;
module.exports = nextConfig;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
next.config.jsとは、Next.jsの細かい設定を決定できるファイルのことを指しています。リダイレクトやwebpackのカス
タマイズなど様々なことができます。

next.config.js は通常の Node.js モジュールであり JSON ファイルではありません。 Next.js サーバーとビルドフ
ェーズで使用され、ブラウザのビルドには含まれません。
next.config.jsは、Node.jsのモジュールです。ですので、ブラウザ側のビルドではなく、Next.jsのサーバー側のビルド
の段階で使用されるものです。
 */
