# Railsのルーティングは、ルーティングファイルの「上からの記載順に」マッチします。
Rails.application.routes.draw do
  # 3
  # root 'static_pages#home'

  # /static_pages/homeというURLへのリクエストを、StaticPagesコントローラのhome アクションと結びつけ。
  # = get 'static_pages/home', to: 'static_pages#home'
  get 'static_pages/home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

=begin
@          @@          @@          @@          @@          @@          @@          @
1
namespace: <任意の名前> で名前空間を付与することができます。これはコントローラーをグルーピングし、またURLにもその
情報を付与することを意味します。

APIのURLにはバージョンに関する情報を加えるケースが時折あります。例えば、/restaurants/:restaurant_id/foodsとい
うURLにv1/をつけて、v1/restaurants/:restaurant_id/foodsとします。なぜバージョンをつけるのでしょうか？主な理由
はAPIを更新する場合にスイッチングしやすくするためです。アプリケーションの開発途中でAPIの仕様を大きく変更する必要がで
る場合に備えてURL自体にバージョン番号を持たせます。これは「必要な場合にのみ」つけることを推奨されていますが、今回は慣
れるためにもURLに付与して進めます。

*デフォルトの「Yay! You’re on Rails!」の画面はライブラリで用意されている。

=          ==          ==          ==          ==          ==          ==          ==          ==
2
@RESTアーキテクチャの習慣、つまり、データの作成、表示、更新、削除をリソース(Resources{URL})として
扱うということです。HTTP 標準には、これらに対応 する4つの基本操作(POST、GET、PATCH、DELETE)
が定義されているので、これら の基本操作を各アクションに割り当てていきます。

@resources:URL、7アクションと対応する名前付きルートを生成
resources :users という行は、ユーザー情報を表示する URL(/users/1)を追加するためだけの
ものではありません。サンプルアプリケーションにこの1行を追加すると、 ユーザーの URL を生成す
るための多数の名前付きルートと共に、RESTful な Users リソースで必要となるすべての7アクション
が利用できるようになるのです。この行に対応する生成されるURLや7アクション、名前付きルートは下記のように
なります。
HTTP    URL            アクション  名前付きルート          用途
GET     /users         index     users_path            すべてのユーザーを一覧するページ
GET     /users/1       show      user_path(user)       特定のユーザーを表示するページ
GET     /users/new     new       new_user_path         ユーザーを新規作成するページ(ユーザー登録)
POST    /users         create    users_path            ユーザーを作成するアクション
GET     /users/1/edit  edit      edit_user_path(user)  id=1のユーザーを編集するページ
PATCH   /users/1       update    user_path(user)       ユーザーを更新するアクション
DELETE  /users/1       destroy   user_path(user)       ユーザーを削除するアクション

=          ==          ==          ==          ==          ==          ==          ==          ==
# 3
rootはルートドメイン（例 https://example.com）にアクセスしたときに表示するページの指定です。
rootを指定しない場合は、railsのデフォルトページが表示されます。
rootで指定できるのはGETメソッドのみです。

rootの指定方法とgetの指定方法は違い、例えば[ root 'static_pages/home']ではエラーが発生する

下記は[root 'home#index']と同じ意味
root to: 'home#index'
get '/', to: 'home#index'
get 'home/index', action: :index, controller: 'home'
match '/', to: 'home#index', via: 'get'
#リダイレクトする場合
get '/', to: redirect('/home/index', status: 302)
get 'home/index'

rootメソッドを使ってルートURL "/" のようなルーティングを定義することの効果は、ブラウザからアクセス
しやすくすることだけではありません。それ以外にも、生のURLではなく、名前付きルートを使ってURLを参照
することができるようになります。例えばルートURLを定義すると、root_path や root_url といったメソッ
ドを通してURLを参照することができます。ちなみに前者はルートURL以下の文字列を、後者は完全なURLの文字
列を返します。
root_path -> '/'
root_url -> 'https://www.example.com/'
なお、Rails チュートリアルでは一般的な規約に従い、基本的には_path 書式を使い、リダイレクトの場合の
み_url 書式を使うようにします。これは HTTP の標準としては、リ ダイレクトのときに完全な URL が要求
されるためです。ただしほとんどのブラウザでは、どちらの方法でも動作します。

=          ==          ==          ==          ==          ==          ==          ==          ==
4
matchメソッド:任意のパスと任意のコントローラーのアクションを結びつける。
match '<パス>' => '<コントローラ名#アクション名>'
*path:全てのパス

-          --          --          --          --          --          --          --          -
via:利用可能なHTTPメソッドを指定する。
e.g.:via: :options/optionsメソッドのみに対応。
# 下記は同じ意味
match 'disp' => 'books#show', :via => :get
get 'disp' => 'books#show'

matchメソッドと:viaオプションを使うことで、複数のHTTPメソッドに同時にマッチするルーティングを作成できます。

=end