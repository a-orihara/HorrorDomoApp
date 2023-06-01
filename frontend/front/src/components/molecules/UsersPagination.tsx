import ReactPaginate from 'react-paginate';

type UsersPaginationProps = {
  totalUsersCount: number;
  itemsPerPage: number;
  handlePageChange: (data: { selected: number }) => void;
};

const UsersPagination = ({ totalUsersCount, itemsPerPage, handlePageChange }: UsersPaginationProps) => {
  return (
    // 1
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageCount={Math.ceil(totalUsersCount / itemsPerPage)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      onPageChange={handlePageChange}
      containerClassName={'pagination justify-around flex space-x-3 h-12 md:text-2xl text-xl'}
      activeClassName={'active bg-basic-pink'}
    />
  );
};

export default UsersPagination;
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
<li> タグがReactPaginate内で使用されている
ReactPaginateコンポーネントは、その内部でHTMLの一部（<ul>や<li>など）を生成しています。
ReactPaginateは、ページネーションの各ページ番号をリスト形式で表示するために、内部的に<li>タグを使用しています。
つまり内部で<li>タグが生成され、それがブラウザに表示されます。
これらのHTML要素は、ブラウザのデフォルトのスタイルが適用されます。たとえば、<li>タグはデフォルトでブロックレベル要
素として扱われ、縦に並ぶようになっています。これを変更するには、CSSを用いてスタイルを上書きする必要があります。

------------------------------------------------------------------------------------------------
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

------------------------------------------------------------------------------------------------
ReactPaginateのプロパティの解説

pageCount:
ページの総数を表す数値。itemsPerPageで割った商をMath.ceilで切り上げたものを渡すことで、ページ数を算出しています
pageRangeDisplayed:
ページネーションで表示するページ数を表す数値。例えば、この値が2の場合、現在のページを含めて前後2ページが表示されます
marginPagesDisplayed:
ページネーションの左右の余白に表示するページ数を表す数値。例えば、この値が1の場合、現在のページの前後1ページずつが余
白として表示されます。
onPageChange:
ページが変更された際に呼び出されるコールバック関数。この関数には、新しいページ番号が引数として渡されます。
containerClassName:
ページネーションを含む要素に付与されるクラス名を表す文字列。CSSでこのクラス名を指定することで、ページネーションのス
タイリングを行えます。
activeClassName:
現在のページに付与されるクラス名を表す文字列。CSSでこのクラス名を指定することで、現在のページのスタイリングを行えま
す。
*/
