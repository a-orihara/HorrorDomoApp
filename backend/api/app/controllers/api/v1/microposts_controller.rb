class Api::V1::MicropostsController < ApplicationController
  # 1
  before_action :authenticate_api_v1_user!

  def index
    # 2
    @microposts = current_api_v1_user.microposts
    render json: @microposts
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
authenticate_api_v1_user!
ユーザが認証されているかどうかがチェックされます。
================================================================================================
2
current_api_v1_user
Devise Token Auth gem が提供するヘルパーメソッドです。このメソッドは現在の認証済みユーザーを返します。
これはDevise Token Auth gem で定義されています。ApplicationController` は `current_api_v1_user` メソッ
ドを提供する `DeviseTokenAuth::Concerns::SetUserByToken` モジュールを含んでいるので、コントローラで使用する
ことができます。
これを使う意図は、リクエストのコンテキストで現在認証されているユーザーにアクセスすることです。このメソッドを使用して
、認証済みユーザーに関連するアクションを実行したり、データにアクセスしたりすることができる。
------------------------------------------------------------------------------------------------
microposts` は `User` モデルの `has_many :microposts` 関連付けで `current_api_v1_user` に追加されます。
この関連付けにより、ユーザインスタンスで `microposts` を呼び出して、そのユーザに関連付けられたすべてのマイクロポ
ストにアクセスすることができます。
参考：user.microposts
User のマイクロポストの集合をかえす。
=end
