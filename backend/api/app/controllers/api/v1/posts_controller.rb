class Api::V1::PostsController < ApplicationController
  # 1
  before_action :authenticate_api_v1_user!

  # 2
  def index
    # 3
    page = params[:page] || 1
    per_page = params[:per_page] || 10

    if params[:user_id]
      # 6
      user = User.find_by(id: params[:user_id])
      if user
        # @posts = user.posts
        @posts = user.posts.page(page).per(per_page)
        total_posts = user.posts.count
      else
        return render json: { status: '404', message: 'User not found' }, status: :not_found
      end
    else
      # 4
      # @posts = current_api_v1_user.posts
      @posts = current_api_v1_user.posts.page(page).per(per_page)
      total_posts = current_api_v1_user.posts.count
    end
    # 5
    render json: { status: '200', data: @posts, total_posts: total_posts }, status: :ok
  end


  # def show
  #   user = User.find_by(id: params[:id])
  #   if user
  #     @posts = user.posts
  #     render json: { status: '200', data: @posts }
  #   else
  #     render json: { status: '404', message: 'User not found' }
  #   end
  # end

  # 7
  def create
    puts "Postのcreateアクションが発火"
    # 7
    @post = current_api_v1_user.posts.build(post_params)
    if @post.save
      # 8
      render json: { status: '201', message: '投稿しました', data: @post }, status: :created
    else
      # 9
      render json: { status: '422', message: '投稿に失敗しました', errors: @post.errors }, status: :unprocessable_entity
    end
  end

  private

  # 10 post_params で Strong Parameters を使っていることにより、content 属性だけWeb 経由で変更可能
    def post_params
      params.require(:post).permit(:content)
    end

end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
authenticate_api_v1_user!
Devise Token Authによって提供されるメソッドで、APIリクエストが認証済みのユーザーから来ているかどうかを確認しま
す。それ以外の確認は行いません。
認証を確認すると、それはリクエストが認証済みのユーザーから来ていることを意味しますが、そのユーザーが自分のpostを操
作しようとしているユーザー自身であることを直接確認するわけではありません。ただし、authenticate_api_v1_user!に
より認証が確認された後に、そのユーザーの情報に基づいて特定の操作を制限したり制御したりすることが可能です。
しかし、このメソッドが行うのは「認証」であり、「認可」ではありません。つまり、ユーザーがログインしていることは確認で
きますが、そのユーザーが特定のリソース（ここではpost）に対して何を行って良いのか、というアクセス権限の管理はこれら
のメソッドの範囲外です。

================================================================================================
2
/posts?user_id=${userId}で、rails側のpostコントローラーのindexアクション内の、if params[:user_id]が反応
する仕組みは、HTTPリクエストが送られるときに、URLに含まれるクエリパラメータがRailsのparamsハッシュに自動的に追加
されるためです。
つまり、user_id=${userId}というクエリパラメータがURLに含まれていると、params[:user_id]でその値を取得すること
ができます。
------------------------------------------------------------------------------------------------
paramsの仕組みは以下の通りです：
paramsは、コントローラへ送られたリクエスト情報を含むハッシュのようなオブジェクトです。
paramsには、URLのパスパラメータ、クエリパラメータ、POSTリクエストの本文など、リクエストに関連するさまざまな情報が
含まれます。
例えば、/users?name=Johnというリクエストがあった場合、params[:name]は"John"という値を返します。
また、/users/1というリクエストがあった場合、params[:id]は"1"という値を返します。
------------------------------------------------------------------------------------------------
1. URLのパスパラメータとクエリパラメータの違いは次の通りです:

- パスパラメータ:
パスパラメータは、URLのパスの一部として渡されるパラメータです。
例えば、`/users/:id`のようなURLパターンでは、`:id`がパスパラメータです。
パスパラメータは、特定のリソース（ここではユーザー）を識別するために使用されます。
パスパラメータは、Railsのルーティングで定義され、コントローラー内で`params[:id]`のようにアクセスされます。

- クエリパラメータ:
クエリパラメータは、URLの末尾に`?`を付けてキーと値のペアで指定されるパラメータです。
例えば、`/users?name=John`のようなURLでは、`name=John`がクエリパラメータです。
クエリパラメータは、特定のリクエストに関連する追加の情報を提供するために使用されます。
クエリパラメータは、Railsのコントローラー内で`params[:name]`のようにアクセスされます。

================================================================================================
3
if params[:user_id]
この条件は、リクエストのパラメーターにuser_idが含まれているかどうかをチェックしています。
もしuser_idが含まれていれば、指定されたuser_idに紐づくユーザーの投稿一覧を取得します。
もしuser_idが含まれていない場合は、次のelse節の処理に進み、エラーになります。

================================================================================================
4
current_api_v1_user
Devise Token Auth gem が提供するヘルパーメソッドです。このメソッドは現在の認証済みユーザーを返します。
そのため、そのユーザーの属性や関連するオブジェクト（例えば、そのユーザーが持つpostsなど）にアクセスすることができま
す。それ以外の情報は直接確認できません。
current_api_v1_userメソッドは認証済みのユーザーを返すため、そのユーザーが操作しようとしているpostが自分自身のも
のかどうかを確認するために使用することができます。
しかし、このメソッドが行うのは「認証」であり、「認可」ではありません。つまり、ユーザーがログインしていることは確認で
きますが、そのユーザーが特定のリソース（ここではpost）に対して何を行って良いのか、というアクセス権限の管理はこれら
のメソッドの範囲外です。
------------------------------------------------------------------------------------------------
これはDevise Token Auth gem で定義されています。ApplicationController` は `current_api_v1_user` メソッ
ドを提供する `DeviseTokenAuth::Concerns::SetUserByToken` モジュールを含んでいるので、コントローラで使用する
ことができます。
これを使う意図は、リクエストのコンテキストで現在認証されているユーザーにアクセスすることです。このメソッドを使用して
、認証済みユーザーに関連するアクションを実行したり、データにアクセスしたりすることができる。
------------------------------------------------------------------------------------------------
posts` は `User` モデルの `has_many :posts` 関連付けで `current_api_v1_user` に追加されます。
この関連付けにより、ユーザインスタンスで `posts` を呼び出して、そのユーザに関連付けられたすべてのマイクロポ
ストにアクセスすることができます。
参考：user.posts
User のマイクロポストの集合をかえす。
------------------------------------------------------------------------------------------------
エラー処理を書かない理由
authenticate_api_v1_user!で認証済み確認。
current_api_v1_userで、現在の認証済みユーザーに関する情報を取得。
この二つにより、ユーザが自分の投稿にしかアクセスできない状態を実現している。
このチェックは、authenticate_api_v1_user!とcurrent_api_v1_userにより自動的に行われる。
そして、認証関連のエラー処理は、authenticate_api_v1_user!とcurrent_api_v1_userで自動的に行われるため。

================================================================================================
5
render json: @postsから、render json: { data: @posts }へ変更
------------------------------------------------------------------------------------------------
1.
`render json: @posts`とすると、フロントエンド側で取得したデータが直接配列やオブジェクトとして扱われます。これは一
見シンプルに見えますが、APIから返されるデータ形式が変わると、全てのフロントエンドのコードが影響を受ける可能性があり
ます。
2.
`render json: { data: @posts }`とすると、`data`というキーで実際のデータを包む形式になります。このようにするこ
とで、他のメタ情報（全件数、ページング情報など）を一緒に送る場合や、エラーメッセージを返す場合にも対応が容易になりま
す。
Next.jsや他のフロントエンドフレームワークを利用する場合、APIのレスポンス形式が一貫していると、データの取り扱いが容
易になります。また、必要に応じてメタ情報を追加したり、エラー処理を統一的に行うことができます。したがって、ここでは、
`render json: { data: @posts }`の方が適切と言えます。
------------------------------------------------------------------------------------------------
render json: @posts
戻り値はdataをキーに持つオブジェクトが返る。
そのオブジェクトの値は、配列で、その配列の値はオブジェクト。
# { date:[{},{},{}] }
------------------------------------------------------------------------------------------------
render json: { data: @posts }
最外部のdataキーの値はdataをキーに持つオブジェクト。
その内側のdataキーの値は投稿データを表現するオブジェクトの配列。
各オブジェクトはそれぞれの投稿が持つ属性（id, content等）を表現しています。
# { date:{ data:[{},{},{}] } } /（dataキーの値は、オブジェクトの配列というオブジェクトが返る。

================================================================================================
6
find_byはfindでも可能ですが、違いがあります。findメソッドは主キー（通常はid）を基にレコードを検索し、該当するレ
コードがない場合はActiveRecord::RecordNotFoundエラーを発生させます。一方、find_byメソッドは指定した条件にマッ
チする最初のレコードを返し、該当するレコードがない場合はnilを返します。つまり、find_byを使用すると、該当するレコー
ドがない場合にアプリケーションがエラーで止まらずに、その後の処理を進めることができます。

================================================================================================
7
current_api_v1_user
DeviseTokenAuthが提供しており、ヘッダー情報に含まれる認証トークンを使用して、認証済みのユーザーを検索します。
そして現在の認証済みのユーザーを取得します。
------------------------------------------------------------------------------------------------
posts
現在のユーザーが持っている投稿を取得するためのメソッドです。
has_many :postsのアソシエーションによってUserモデルはpostsメソッドを使えるようになります。これにより、特定のユ
ーザーに関連する投稿を簡単に取得できます。
post.ではダメです。なぜなら、has_many :postsのアソシエーションによりUserモデルは複数の投稿を持つことができ、
postsメソッドを通じてこれらの投稿にアクセスすることができるからです。postではなくpostsを使用することで、ユーザー
に関連するすべての投稿にアクセスできます。
------------------------------------------------------------------------------------------------
build(post_params)関数は、新しいPostオブジェクトをメモリ上に作成しますが、まだデータベースに保存はしません。
引数post_paramsは、新しいPostオブジェクトを作成するためのパラメータです。post_paramsメソッドによって、パラメー
タから必要な属性(:content)だけを抽出しています。
buildはcreateでも可能ですが、違いがあります。buildは新しいオブジェクトをメモリ上に作成しますが、データベースには
保存しません。一方、createは新しいオブジェクトを作成し、それをデータベースにすぐに保存します。なので、作成後に何ら
かの処理を行いたい場合や、保存前にバリデーションを行いたい場合などはbuildを使用します。

# -backend/api/app/controllers/api/v1/posts_controller.rb
def create
  @post = current_api_v1_user.posts.build(post_params)
  if @post.save
    render json: { status: '201', message: 'Post created', data: @post }, status: :created
  else
    render json: { status: '422', message: 'Post not created', errors: @post.errors }, status: :unprocessable_entity
  end
end

================================================================================================
8
'201'はHTTPステータスコードで、「リソースが正常に作成された」という意味です。'200'は「リクエストが成功した」とい
う一般的な成功を示すコードで、リソースが新規作成された場合には'201'を使用するのが一般的です。
------------------------------------------------------------------------------------------------
:createdはRailsで使用されるシンボルで、HTTPステータスコードの'201'を表します。このステータスコードは、リクエス
トが成功し、新たにリソースが作成されたことを意味します。
------------------------------------------------------------------------------------------------
render json: { status: '201', message: 'Post created', data: @post }, status: :createdというコード
におけるstatusの重複は、異なる目的のために存在します。
内側のstatus: '201'はJSONレスポンスボディの一部で、フロントエンドがこのステータスを見てリクエストの結果を理解し
ます。一方、外側のstatus: :createdはHTTPステータスコードを設定し、これはHTTPレスポンスヘッダーの一部として送信
されます。
フロントエンドはこのステータスコードを見てリクエストが成功したかどうかを瞬時に判断します。
------------------------------------------------------------------------------------------------
JSON レスポンス内の `status` キー (`{ status: '200', message: 'Post created', data: @post }`) は、
フロントエンドアプリケーションのためのものです。このステータスは、JavaScript/TypeScript コードで直接使用するこ
とができ、次に何をすべきかを決定することができます (例えば、エラー処理、リダイレクトなど)。

レスポンスの HTTP ステータスコードを設定するために、Rails は `render json: {...}, status: :created` のよ
うに JSON レスポンスの外側に `status: :created` を指定します。これはHTTPレスポンスヘッダの一部として送信され
るステータスコードです。

HTTPステータスコードは、リクエストの成功、失敗、その他の状態に関する情報を提供する標準化されたコードです。これらの
ステータスコードは、ウェブブラウザを含むすべてのHTTPクライアントによって理解され、リクエストの低レベル処理に使用さ
れます。冗長に見えますが、これらはそれぞれ異なる役割を担っています。
------------------------------------------------------------------------------------------------
1.HTTPステータスコードとJSONレスポンスボディ内のステータスコードの2つを設定する利点について詳しく説明します：

**HTTPステータスコード**
HTTPレスポンスのステータスラインに表示されるステータスコードです。これにより、フロントエンドはリクエストが成功した
か、それとも何かエラーが発生したかを瞬時に知ることができます。これは一般的なプロトコルレベルの通信であり、ブラウザ
や他のHTTPクライアントがリクエストの成功または失敗を自動的に判断できるようになっています。
**JSONレスポンスボディ内のステータス**
これはアプリケーションレベルの通信で、フロントエンドが具体的なアクション（例えば、新規作成、更新、削除など）が成功
したかどうか、または特定のビジネスロジックが満たされたかどうかを理解するために使用します。これにより、フロントエン
ドは更に詳細なエラーメッセージをユーザーに表示したり、特定のアクションをトリガーすることが可能になります。
リクエストが成功したかどうかをフロントエンドが瞬時に判断できる利点は、ユーザーエクスペリエンスの向上につながります。
具体的には、HTTPステータスコードを用いることで、フロントエンドはリクエストの結果を迅速に判断し、必要ならエラーメッ
セージを即座に表示したり、成功した操作に基づいてUIを更新したりすることができます。その結果、アプリケーションのレス
ポンスが速くなり、ユーザーにとって使いやすいアプリケーションとなります。

================================================================================================
9
'422'はHTTPステータスコードで、「リクエストは適切に形成されているが、意味上のエラーや無効な操作のために処理できな
い」を意味します。例えば、必要なパラメータが欠けている、またはパラメータの形式が無効であるといった場合に使われます。
------------------------------------------------------------------------------------------------
:unprocessable_entity（処理不能な実体）はRailsで使用されるシンボルで、HTTPステータスコードの'422'を表します。

================================================================================================
10
コントローラは post キーの下に content キーが存在することを期待しているため、{ post: params },つまり、
{ post: {content: "内容" } },になる。

1. 通常、Railsのコントローラはリクエストパラメータとして、特定のリソース（この場合は 'post'）の名前のキーの下に、
そのリソースの属性を表すキー（この場合は 'content'）を持つハッシュを期待します。これはストロングパラメータという
機能の一部であり、意図しないデータがデータベースに保存されることを防ぐためのものです。

2. Railsのコントローラは、'params' メソッドを通じてクライアントから送られてきたデータにアクセスします。コントロ
ーラのアクション内で 'params[:post]' というコードを書いた場合、その値はクライアントが送信したデータ内の 'post'
キーに対応する値になります。

3. ストロングパラメータは、createやupdateなどのアクションで使用する属性をホワイトリストに追加することで、意図し
ない属性が更新されることを防ぎます。例えば、'params.require(:post).permit(:content)' のように記述すること
で、'post' リソースの 'content' 属性のみが許可され、それ以外のパラメータは拒否されます。

4. したがって、フロントエンドから送信するリクエストデータは、Railsのストロングパラメータの要件を満たす形にする必
要があります。上記のコードでは、クライアントが送信するデータの形式を 'post' キーの下に 'content' キーが存在す
る形に修正することで、Railsのコントローラが期待するデータ形式を満たし、リクエストが成功するようになりました。
=end
