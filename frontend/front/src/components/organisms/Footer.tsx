import { JsxElement } from "typescript";
import Link from "next/link";

export const Footer = (): JSX.Element => {
  return (
    // <div className="flex flex-col min-h-screen container mx-auto bg-green-300 outline">
    <footer className="bg-basic-yellow outline md:h-14 h-11 flex justify-center items-center text-black text-sm">
      &copy; Ori 2022
      {/* <span > */}
      {/* /public/vercel.svgの省略形 */}
      {/* <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} /> */}
      {/* </span> */}
    </footer>
  );
};

/*
@        @@        @@        @@        @@        @@        @@        @@        @
Tailwind CSS
@        @@        @@        @@        @@        @@        @@        @@        @
min-h-screen:min-height: 100vh;
コンテンツが増えても画面が見切れないように、高さの下限を画面一杯に設定。

=          ==          ==          ==          ==          ==          ==          ==          =
outline:outline-style: solid;
外側に枠線を書く。

=          ==          ==          ==          ==          ==          ==          ==          =
container:要素の幅を現在のブレークポイントに固定するためのコンポーネント

=          ==          ==          ==          ==          ==          ==          ==          =
flex:flexコンテナ内にflexアイテムを設定

-          --          --          --          --          --          --          --          -
flex-col(row):コンテナの主軸(flex-directionで水平か垂直か)を指定
クロス軸 (交差軸) は、主軸 (メイン軸) と交差する軸(flex-directionが水平なら縦、垂直なら横)。

-          --          --          --          --          --          --          --          -
justify-contentプロパティは、flexコンテナの主軸に沿ってflexアイテムを一行に配置します
justify-content: center;アイテムを中央に寄せて配置。

-          --          --          --          --          --          --          --          -
align-items: center;アイテムの配置方法。centerでアイテムを中央に寄せて配置。
*[justify-content: center]と[align-items: center]で中央の真ん中に寄せている

-          --          --          --          --          --          --          --          -
vw	viewport width	ビューポートの幅に対する割合
vh	viewport height	ビューポートの高さに対する割合

-          --          --          --          --          --          --          --          -
flex: 1;
flex-grow、flex-shrink、flex-basisの3つのプロパティのショートハンド（省略形）。
「flex-grow: 1;」、「flex-shrink: 1;」、「flex-basis: 0;」の3つ同時に指定したことと同じ意味
になります。
flex-growは、親要素のflexコンテナの余っているスペースを、子要素のflexアイテムに分配して、flexアイ
テムを伸ばすプロパティです。flex-growの値は整数値のみで、flexアイテムが伸びる比率を指定します。

=          ==          ==          ==          ==          ==          ==          ==          =
tracking-tighter:letter-spacing: -0.05em;
文字間の幅を指定

=          ==          ==          ==          ==          ==          ==          ==          =
md:@media (min-width: 768px)
スクリーンサイズが768px以上の場合に適用

mr-auto:margin-right: auto;
marginの値にautoを指定すると、[親要素の横幅 - 指定した要素の横幅]によりmarginを自動で算出します。
子要素が左寄せになる
*/
