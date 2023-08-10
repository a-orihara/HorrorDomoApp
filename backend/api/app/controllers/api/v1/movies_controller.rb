class Api::V1::MoviesController < ApplicationController
  # 1
  require 'open-uri'
  def index
    title = params[:title]
    url = "https://api.themoviedb.org/3/search/movie?api_key=#{ENV['TMDB_API']}&query=#{title}&language=ja&region=JP"
    # 2
    response = open(url).read
    # 3
    @movies = JSON.parse(response)["results"]
    render json: { data: @movies }
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
require 'open-uri' は、'open-uri'ライブラリをロードするために必要です。
'open-uri'はRubyの標準ライブラリなので、特別なインストールは不要ですが、ロードする必要があります。ロードされると、
その後のコードで'open-uri'の機能を使用することができます。
------------------------------------------------------------------------------------------------
. 'open-uri'はRubyの標準ライブラリで、URLを開いてデータを読み取るためのライブラリです。
通常のファイルオープンメソッド`open`と同じように、HTTPやFTPなどのプロトコルを使用してリモートのデータにアクセスす
ることができます。これにより、ファイルを開いて読み取るのと同じ感覚でURLからのデータ取得が可能になります。ヘッダーやリダイレクトの処理なども行うことができ、柔軟に外部リソースとのやり取りが可能です。
------------------------------------------------------------------------------------------------
. 'open-uri'は以下のような場合に使用されることが多いです。
- 外部のAPIからデータを取得する際
- ウェブページのHTMLをスクレイピングする際
- FTPサーバーからファイルをダウンロードする際
- 他のサーバーとデータのやり取りを行いたい際
例えば、映画の情報を外部APIから取得するために'open-uri'を使用しています。指定したURLからデータを取得し、JSON形式
に変換して結果をクライアントに返す処理が実装されています。

================================================================================================
2
open
open-uriライブラリに含まれるメソッドです。open-uriは、URLを介して外部のリソースにアクセスするための機能を提供しま
す。
open メソッドは外部のリソース（URLなど）を開いてその内容を取得するためのメソッドで、ファイルを開く際のように扱うこ
とができます。URLを指定して開かれる場合、HTTPリクエストを送信してリモートのコンテンツを取得します。
open(url) のようにURLを引数として与えることで、指定したURLにHTTPリクエストを送信してコンテンツを取得します。
------------------------------------------------------------------------------------------------
read
ファイルやストリームからデータを読み取るためのメソッドです。ここでの open メソッドの戻り値（リモートのコンテンツ）
に対して使用されています。openメソッドが指定したURLを開き、.readメソッドでその内容を読み取っています。
read メソッドの戻り値は、読み取ったデータを含む文字列です。ファイルの場合、ファイルの内容全体が文字列として返されま
す。これにより、APIから取得したデータを文字列として取得しています。

================================================================================================
3
JSON.parse
JSON形式の文字列を解析してRubyのハッシュやオブジェクトに変換するためのメソッドです。
response 変数には、open(url).read で取得したAPIからのレスポンスのコンテンツが文字列として格納されています。これ
がJSON形式のデータです。JSON.parse(response) は、そのJSON文字列を解析して、Rubyのハッシュやオブジェクトに変換
します。
------------------------------------------------------------------------------------------------
["results"] の部分について
JSON.parse(response)["results"] の部分では、response の中身をJSONとして解析し、その中の "results" キーに
対応する値を取得しています。
------------------------------------------------------------------------------------------------
解析されたJSONデータは、Rubyのハッシュとして扱えるようになります。ハッシュのキーである "results" を指定することで
、そのキーに対応する値を取得します。
"results" キーは、APIからのレスポンス内に、検索結果として得られた映画情報を含む部分を指し示しています。
したがって、JSON.parse(response)["results"] は、APIから取得したJSONデータを解析し、その中の "results" キー
に対応する値（映画の結果）を取得する操作を行っています。これによって、映画の結果が配列の形で取得されます。
------------------------------------------------------------------------------------------------
仮に、APIからのレスポンスが以下のようなJSONデータであるとします。
{
  "results": [
    {
      "id": 123,
      "title": "Movie 1",
      "release_date": "2023-08-01"
    },
    {
      "id": 456,
      "title": "Movie 2",
      "release_date": "2023-07-15"
    }
  ]
}
1. `response = open(url).read` の行で、仮想的なURLを使用してAPIにリクエストを送信し、レスポンスの内容を文字列
として `response` 変数に格納しています。
2. `JSON.parse(response)["results"]` の部分では、`response` の中身をJSONとして解析し、その中の、
`"results"` キーに対応する値を取得しています。この場合、取得されるのは映画の結果の配列です。上記の例では、2つの映画
情報が含まれています。
------------------------------------------------------------------------------------------------
render json: { results: @movies }
. `@movies = JSON.parse(response)["results"]` で `@movies` はハッシュになります。最後の
`render json: { results: @movies }` で、そのハッシュをJSON形式に変換してクライアントへレスポンスとして送り返
しています。
. JSONで取得し、ハッシュに変換し、最後に再びJSONにする理由は、途中でRubyが処理するためです。JSON形式の文字列を、
Rubyのハッシュに変換することで、Rubyのコード内でそのデータを容易に操作・処理することができます。最終的にクライアン
トに返す際には、クライアントが理解できる形式であるJSONに戻す必要があるため、再びJSON形式に変換しています。
=end