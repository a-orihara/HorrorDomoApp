require 'net/http'
class Api::V1::MoviesController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    logger.info "MoviesControllerのindexアクションが発火"
    logger.info "◆TMDB_APIキー: #{ENV.fetch('TMDB_API_KEY')}"
    title = params[:title]
    # 1 titleをエンコードする
    url = "https://api.themoviedb.org/3/search/movie?api_key=#{ENV.fetch('TMDB_API_KEY')}&language=ja&query=" + URI.encode_www_form_component(title)
    # 2
    movie_info = JSON.parse(Net::HTTP.get(URI.parse(url)))
    # 3
    render json: { data: movie_info }
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
`URI.encode_www_form_component(title)`
. `URI` クラスについて：
- `URI` はRubyの標準ライブラリで、Uniform Resource Identifier（URI）を扱うためのクラスです。
URIは、Web上のリソースを識別するための文字列で、URLやURNの形式が含まれます。
URIクラスは、URIを操作するための様々なメソッドを提供します。
提供されたコード内では、`URI.encode_www_form_component(title)` を使用して、URIエンコードを行い、`title`
変数の内容をURL内に安全に埋め込むことが行われています。これによって、エンコードされた文字列を含んだ正しいURIが生成
され、APIリクエストが行われます。
------------------------------------------------------------------------------------------------
. `encode_www_form_component(title)` について：
- `encode_www_form_component` は、URIエンコードを行うためのメソッドで、URIクラスのメソッドす。URI内に含まれ
る特殊文字や予約文字をエンコードすることで、正しくURIとして使用できる形式に変換します。
- エンコード:情報やデータを特定の形式に変換する
- `encode_www_form_component(title)` は、与えられた文字列 `title` をURIエンコードして、URLに含めるための文
字列として整形します。
- 戻り値は、エンコードされた文字列です。このエンコードされた文字列は、URL内に含めることで、URIの構成要素として正し
く利用できるようになります。エンコードされた文字列はURLの中で使用され、URIとして安全に処理されます。
- `encode_www_form_component(title)` メソッドは、エンコードしたい文字列を引数として取ります。この引数には、
URL内に埋め込む際にエンコードして安全に扱いたい文字列を渡します。通常、クエリパラメータやURL内の特定の部分に含まれる
文字列をエンコードする際に使用されます。
これによって、`title` 変数の内容がエンコードされてURL内に安全に埋め込まれ、APIリクエストのURLが正しく構築される。
------------------------------------------------------------------------------------------------
日本語などの非ASCII文字をURLに直接埋め込む際には、特定のエンコーディングが必要になります。
エンコーディングの必要性: "用心棒"などの日本語の非ASCII文字列をURLに埋め込む際には、適切なエンコーディングが必要で
す。これらの文字はURIの予約文字や無効な文字として扱われる場合があり、エンコーディングせずにURLに埋め込むとエラーにな
ることがあります。
------------------------------------------------------------------------------------------------
rubocopの警告により、ENV['TMDB_API']からENV.fetch('TMDB_API')へ変更
------------------------------------------------------------------------------------------------
. `ENV['TMDB_API']`は、環境変数から名前が'TMDB_API'の値を取得する意味です。環境変数が存在しない場合、`nil`が
返ります。
. `ENV.fetch('TMDB_API')`も、環境変数から名前が'TMDB_API'の値を取得する意味です。しかし、このキーに対応する環
境変数が存在しない場合、`KeyError`が発生します。
. 両者の違いは、対応する環境変数が存在しない場合の挙動です。`ENV['TMDB_API']`は`nil`を返しますが、
`ENV.fetch('TMDB_API')`はエラーを投げます。
. `ENV.fetch('TMDB_API')`の使用意図は、'TMDB_API'という環境変数が必須である場合、その変数が設定されていない
場合に明確にエラーを発生させるためです。この方法によって、環境変数が設定されていない問題を早期に発見し、デバッグを容
易にすることができます。
================================================================================================
2
movie_info = JSON.parse(Net::HTTP.get(URI.parse(url)))
`Net::HTTP.get(URI.parse(url))`
. `Net::HTTP` の部分について：
- `Net::HTTP` は、HTTP通信を行うためのクラスやメソッドを提供するRubyの標準ライブラリです。このクラスを使用するこ
とで、HTTPリクエストを送信してレスポンスを受け取ることができます。`Net::HTTP` クラスはHTTPリクエストやレスポンス
を扱うためのインターフェースを提供します。
- `Net::HTTP.get(uri)` は、指定されたURI（Uniform Resource Identifier）に対してHTTP GETリクエストを送信
し、そのレスポンスを取得するメソッドです。
- 戻り値として、HTTPレスポンスのボディ部分が返されます。これは文字列として取得されます。
- 引数には、HTTPリクエストを送信する対象となるURIオブジェクトを渡します（`URI.parse(url)` でURIオブジェクトに
変換している）。
------------------------------------------------------------------------------------------------
. `URI.parse(url)` の部分について：
- `URI.parse` は、与えられたURI文字列を解析し、`URI` クラスのオブジェクトを生成するメソッドです。
- `URI` クラスのオブジェクトは、URIの各要素（スキーム、ホスト、パス、クエリ、フラグメントなど）にアクセスするため
のメソッドを提供し、URI文字列を正規化して保持します。
- `URI.parse(url)` の戻り値は、与えられたURI文字列を解析して生成された `URI` オブジェクトです。
- 引数には、解析したいURI文字列を渡します。通常、プロトコル（スキーム）やホスト、パス、クエリパラメータなどの情報を
これによって、構築されたURL文字列が解析され、その結果として `URI` オブジェクトが生成されます。生成された `URI` オ
ブジェクトは、`Net::HTTP.get` メソッドの引数として使用され、HTTPリクエストが送信されます。
------------------------------------------------------------------------------------------------
`JSON.parse` の部分について：
- `JSON.parse` は、JSON形式の文字列を解析してRubyのハッシュや配列などのオブジェクトに変換するためのメソッド。
- `JSON` モジュールが提供するメソッドであり、Ruby標準ライブラリとして含まれています。
- `JSON.parse(json_string)` の戻り値は、与えられたJSON文字列を解析して生成されたRubyオブジェクトです。通常は
ハッシュや配列などのデータ構造が戻ります。
- 引数には、JSON形式の文字列を渡します。この文字列はJSONデータを表現しています。
- `JSON.parse` の意図は、JSON形式の文字列をRubyオブジェクトに変換することで、プログラム内でJSONデータを利用でき
るようにすることです。
- `Net::HTTP.get(URI.parse(url))` によって取得されたHTTPレスポンスのボディ部分（JSON形式の文字列）が
`JSON.parse` を使用して解析され、Rubyのデータ構造であるハッシュや配列に変換されます。この変換されたデータは
`@movies` インスタンス変数に格納され、APIから受け取った映画情報をRubyオブジェクトとしてアプリケーション内で利用
できるようになります。

================================================================================================
3
.`render json: { data: @movies }` は、`@movies` のハッシュをJSON形式に変換してレスポンスとして返しています。
. `@movies = JSON.parse(Net::HTTP.get(URI.parse(url)))` の部分で外部APIから取得したJSONデータをハッシュ
に変換し、その後`render json: { data: @movies }` で再びJSON形式に変換しています。
. この意図は、外部APIからのレスポンスをRailsアプリケーション内で適切に処理し、クライアント（フロントエンド）に送信
する形式に整形するためです。JSONデータを一度ハッシュに変換することで、データの操作やバリデーションを行いやすくしてい
ます。最後に、クライアントに送信するためjson形式に再変換しています。
=end
