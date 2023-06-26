class Api::V1::PostsController < ApplicationController
  # 1
  before_action :authenticate_api_v1_user!

  # 4
  def index
    # 2
    @posts = current_api_v1_user.posts
    # 3
    render json: { status: '200', data: @posts }
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
================================================================================================
3
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
4
エラー処理を書かない理由
authenticate_api_v1_user!で認証済み確認。
current_api_v1_userで、現在の認証済みユーザーに関する情報を取得。
この二つにより、ユーザが自分の投稿にしかアクセスできない状態を実現している。
このチェックは、authenticate_api_v1_user!とcurrent_api_v1_userにより自動的に行われる。
そして、認証関連のエラー処理は、authenticate_api_v1_user!とcurrent_api_v1_userで自動的に行われるため。
=end
