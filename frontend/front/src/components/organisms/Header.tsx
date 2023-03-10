import Link from 'next/link';

export const Header = (): JSX.Element => {
  return (
    <header className='text-s flex h-20 items-center bg-basic-yellow font-spacemono font-semibold outline md:text-2xl'>
      <h1 className='text-s ml-3 mr-auto text-center font-spacemono font-semibold tracking-tighter md:text-3xl'>
        Horror Domo App
      </h1>
      <Link href={`/`}>
        <p className='text-s mr-3 cursor-pointer text-basic-pink duration-300 hover:text-hover-pink sm:mr-4 md:mr-12 md:text-3xl'>
          Home
        </p>
      </Link>
      <Link href={`/SignUp`}>
        <p className='text-s mr-3 cursor-pointer tracking-tighter text-basic-pink duration-300 hover:text-hover-pink md:text-3xl'>
          Log in
        </p>
      </Link>
    </header>
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
