/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1 プロジェクトのコンテンツソースを設定する。
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // 2 テーマの設定:プロジェクトのデフォルトテーマをカスタマイズ
  theme: {
    // 3
    extend: {
      colors: {
        'basic-yellow': '#F2CB05',
        'basic-orange': '#F28705',
        // 'basic-pink': '#F07171',
        'basic-pink': '#F22C5A',
        'basic-green': '#00b51a',
        'hover-yellow': '#FFF33F',
        'hover-pink': '#FC1919',
        'hover-orange': '#fef08a',
        'font-color-green': '#0f7d3b',
      },
    },
    // fontFamilyユーティリティを使って、テキストの書体を制御することができます。
    fontFamily: {
      // classに"font-spacemono"の設定で使用可能
      spacemono: ['Space Mono', 'monospace'],
    },
  },
  plugins: [],
};

// @          @@          @@          @@          @@          @@          @@          @@          @
// 1
// tailwind.config.jsファイルのcontentセクションには、HTMLテンプレート、JavaScriptコンポーネント、
// その他Tailwindのクラス名を含むすべてのソースファイルへのパスを設定することができます。
// ここでどのファイルにtailwindcssを適用させるかを設定します。

// -          --          --          --          --          --          --          --          -
// ソースパスの設定
// Tailwind CSSは、HTML、JavaScriptコンポーネント、およびその他のテンプレートファイルのクラス名をすべて
// スキャンし、それらのスタイルに対応するすべてのCSSを生成することで動作します。
// Tailwindが必要なCSSを生成するためには、Tailwindのクラス名を含むプロジェクト内の全てのファイルについて
// 知る必要があります。
// 設定ファイルのコンテンツセクションで、すべてのコンテンツファイルへのパスを設定します。
// パスは tailwind.config.js ファイルではなく、プロジェクトのルートからの相対パスです。したがって、
// tailwind.config.js ファイルが独自の場所にある場合でも、パスはプロジェクトのルートからの相対パスで記述
// する必要があります。

// =          ==          ==          ==          ==          ==          ==          ==          =
// 2
// テーマセクションで、プロジェクトのカラーパレット、文字スケール、フォント、ブレークポイント、ボーダー
// 半径の値などを定義します。

// =          ==          ==          ==          ==          ==          ==          ==          =
// 3
// テーマオプションのデフォルト値を維持しつつ新しい値をカスタムで追加したい場合は、設定ファイルのthemeセクションの
// extend キーの下に拡張モジュール(colorsプロパティ等)を追加します。たとえば、既存のブレークポイントを保持したま
// ま追加のブレークポイントを追加したい場合は、 screensプロパティを拡張します。
