//frontend/front/src/components/molecules/Pagination.tsx
import ReactPaginate from 'react-paginate';

type PaginationProps = {
  // 総数
  totalCount: number;
  // iページあたりの数
  itemsPerPage: number;
  // 1 ページ遷移時の処理
  handlePageChange: (data: { selected: number }) => void;
};

// 3
const Pagination = ({ totalCount, itemsPerPage, handlePageChange }: PaginationProps) => {
  return (
    // 2.1
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      // 2.2
      pageCount={Math.ceil(totalCount / itemsPerPage)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      onPageChange={handlePageChange}
      containerClassName={'pagination justify-around flex space-x-3 h-8 lg:h-12 md:text-2xl lg:text-xl text-base'}
      activeClassName={'active bg-basic-pink'}
    />
  );
};
export default Pagination;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
handlePageChange: (data: { selected: number }) => void;
ReactPaginateでよく使う型です。
------------------------------------------------------------------------------------------------
handlePageChange は、ページ番号が変更されたときに実行される関数です。
ReactPaginate の onPageChange プロパティにこの関数を渡しています。ReactPaginate は、ページ番号が変更される
とこの関数を呼び出し、その関数の引数としてオブジェクトを渡します。
そのオブジェクトのプロパティ selected が、新しく選択されたページの番号になります。
------------------------------------------------------------------------------------------------
handlePageChange: (data: { selected: number }) => void; は、新しいページ番号を selected プロパティとし
て持つオブジェクトを引数として受け取り、それを使って何らかの処理（この場合は現在のページ番号の更新）を行う関数、とい
う意味になります。これは ReactPaginate で一般的に使われるパターンです。

================================================================================================
2.1
ReactPaginateのプロパティの解説
- pageCount:
ページの総数を表す数値。itemsPerPageで割った商をMath.ceilで切り上げたものを渡すことで、ページ数を算出しています
- pageRangeDisplayed:
このプロパティは、ページネーションコントロールの現在のページの周囲にいくつのページ番号が表示されるかを決定します。例
えば、`pageRangeDisplayed`が2に設定されている場合、現在のページの前後に最大2つのページ番号が表示されます。つま
り、あなたが5ページにいる場合、ページネーションには3、4、5、6、7ページが表示されます。
- marginPagesDisplayed:
このプロパティは、ページネーション・コントロールの最初と最後に表示するページ数を指定します。例えば、
`marginPagesDisplayed`が1であれば、現在のページに関係なく、最初に1つ、最後に1つのページ番号が表示されます。その
ため、長いページのリストでは、1 ... 4 5 6 ...10 のように表示されます。
- onPageChange:
ページが変更された際に呼び出されるコールバック関数。この関数には、新しいページ番号が引数として渡されます。
- containerClassName:
ページネーションを含む要素に付与されるクラス名を表す文字列。CSSでこのクラス名を指定することで、ページネーションのス
タイリングを行えます。
- activeClassName:
これは、ページネーションコントロールの現在のアクティブなページ番号に適用されるクラス名を表します。CSSでこのクラスを
ターゲットにすることで、現在のページ番号を他のページとは異なるスタイルにすることができます。例えば、ハイライト表示し
たり、色を変えて選択されているページであることを示すことができます。
------------------------------------------------------------------------------------------------
<li> タグがReactPaginate内で使用されている
ReactPaginateコンポーネントは、その内部でHTMLの一部（<ul>や<li>など）を生成しています。
ReactPaginateは、ページネーションの各ページ番号をリスト形式で表示するために、内部的に<li>タグを使用しています。
つまり内部で<li>タグが生成され、それがブラウザに表示されます。
これらのHTML要素は、ブラウザのデフォルトのスタイルが適用されます。たとえば、<li>タグはデフォルトでブロックレベル要
素として扱われ、縦に並ぶようになっています。これを変更するには、CSSを用いてスタイルを上書きする必要があります。

================================================================================================
2.2
Math:
JavaScriptにおける組み込みオブジェクトの一つ。数学的な定数や関数が含まれています。例えば、整数をランダムに生成する
関数、小数点以下を切り上げる関数など。
ceil関数:
引数で与えられた数値の小数点以下を切り上げ、最も近い整数値を返します。例えば、Math.ceil(1.1)は2を返します。
利用意図は、ページネーションを実装する際に、全ページ数を求めるために使われます。例えば、1ページあたりのアイテム数と
して10を設定している場合、総アイテム数が27個ある場合、27 / 10 = 2.7となりますが、小数点以下を切り上げることで必要
なページ数である3ページ分の情報が得られます。
この関数を利用することで、ページネーションに必要な総ページ数を求めることができます。ページネーションには、ページ番号
の表示やページャーの制御に総ページ数が必要であり、アイテム数や1ページあたりのアイテム数が変動する場合でも簡単に対応
できるようにするためにこの関数が使われます。

================================================================================================
3
Pagination.tsx: moleculesの理由
Paginationは、ReactPaginateコンポーネントなどから構成されており、特定の機能を果たす一つの単位として機能します。
複数のatomsを組み合わせた構造であるため、moleculesに分類するのが適切です。
*/
