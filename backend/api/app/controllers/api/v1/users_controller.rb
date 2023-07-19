# 1
class Api::V1::UsersController < ApplicationController
  # 2 index,showアクションはdeviseにはないので、before_actionを自分で定義する必要がある。
  before_action :authenticate_api_v1_user!, only: [:index, :following, :followers]
  before_action :set_user, only: [:show]

  # GET /api/v1/users
  # 3 全てのユーザーをページネーション付きで取得するメソッド
  def index
    puts "indexアクションが発火"
    # ページ番号
    page = params[:page] || 1
    # 1ページあたりの表示件数
    per_page = params[:per_page] || 10
    # 指定したページの指定した表示件数分のユーザーを取得
    @users = User.all.page(page).per(per_page)
    # 総ユーザー数を取得
    total_users = User.count
    # { users: @users, total_users: total_users }と同じ意味
    # res:指定したページの指定した表示件数分のユーザーと総ユーザー数
    render json: { users: @users, total_users: total_users }
  end

  # 5
  def show
    puts "showアクションが発火"
    # generate_avatar_urlの戻り値はavatarのURLかnil
    avatar_url = generate_avatar_url(@user)
    render json: @user.as_json.merge(avatar_url: avatar_url)
  end

  # POST /api/v1/users
  # def create
  # end

  # PATCH/PUT /api/v1/users/1
  # def update
  # end

  # GET /api/v1/users/:id/following（memberメソッドでrouteは作成）
  # followingはmodels/user.rbで定義
  def following
    puts "followingアクションが発火"
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    # user  = User.find(params[:id])より変更。rescue節を使わずnullを返した方がエラー処理がシンプル
    user = User.find_by(id: params[:id])
    if user
      following = user.following.page(page).per(per_page)
      following_count = user.following.count
      # following_pagination = following.page(page).per(per_page)
      render json: { status: '200', following: following, following_count: following_count}
      puts "userいます3"
    else
      puts "userいません"
      render json: { status: '404', message: 'フォローユーザーが見つかりません' }, status: :not_found
    end
  end

  # GET /api/v1/users/:id/followers（memberメソッドでrouteは作成）
  # followersはmodels/user.rbで定義
  def followers
    puts "followersアクションが発火"
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    # user  = User.find(params[:id])より変更。rescue節を使わずnullを返した方がエラー処理がシンプル
    user = User.find_by(id: params[:id])
    if user
      followers = user.followers.page(page).per(per_page)
      followers_count = user.followers.count
      # followers_pagination = followers.page(page).per(per_page)
      render json: { status: '200', followers: followers, followers_count: followers_count}
      puts "userいます3"
    else
      puts "userいません"
      render json: { status: '404', message: 'フォローユーザーが見つかりません' }, status: :not_found
    end
  end

  private

    # Userモデルからidに対応するユーザーを検索し、変数userに代入する。
    def set_user
      @user = User.find(params[:id])
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
DeviseTokenAuthのSessionsControllerやRegistrationsControllerで定義されていない、Userのアクションは別途、
UsersControllerを自作する必要があります。

================================================================================================
2
:authenticate_api_v1_user!
ユーザーがサイインしていればアクションを実行。
そうでなければエラーを返す。
{"errors":["ログインもしくはアカウント登録してください。"]}
------------------------------------------------------------------------------------------------
トークン認証を行うメソッド。パスワード認証であれば、サインインしているかどうか確認するメソッドに近い。
Railsアプリケーションの認証機能であるDeviseを使って、APIリクエストを行ったユーザーが認証されているかどうかを確認
するメソッドです。ユーザーが認証されていることを確認できます。
Railsを使ったAPI開発においては、before_actionフィルターを使用して、アクセス制御（認可）のために認証を要求するこ
とが一般的です。
------------------------------------------------------------------------------------------------
before_action :authenticate_api_v1_user!, only: [:index]
ユーザーの index ページ（ユーザー一覧ページ）は、認証（サインイン）したユーザーにしか見せないようにする。
------------------------------------------------------------------------------------------------
set_user
アクションで使用する前に、特定のユーザーをデータベースから取得して @user インスタンス変数に割り当てることを目的と
しています。つまり、@user はコントローラー内の多くのアクションで使用される可能性があるため、その値をセットすること
で、コードの重複を避け、保守性を高めることができます。

================================================================================================
3
params[:page] || 1
「params[:page]が存在する場合はparams[:page]を使い、そうでない場合は1を使う

User.all
データベース内の全てのUserレコードを取得するActive Recordのメソッド

page(page)
Kaminariというページネーション用のgemで提供されているメソッドで、指定されたページのレコードを取得するためのメソッ
ドです。

per(per_page)
Kaminariで提供されているメソッドで、1ページあたりに表示するレコード数を指定するためのメソッドです。

@users = User.all.page(page).per(per_page)の@usersの中身
現在のページに表示するために必要なUserレコードが格納された配列です。Kaminariのpageとperメソッドによって、現在の
ページに表示するための必要なUserレコードの数だけを取得し、@usersに格納しています。
------------------------------------------------------------------------------------------------
1. @users = User.all
- 全てのユーザー情報がデータベースから取得され、@users変数に格納される。ここでは、1ページあたり10件の場合、80件の
ユーザー情報が取得される。
2. @users = User.all.page(page)
- ページネーションが適用され、指定された「page」のページに含まれる情報のみが取得され、@users変数に格納される。た
とえば、2ページ目の場合、11~20件目のユーザー情報が取得される。
3. @users = User.all.page(page).per(per_page)
- ページネーションが適用され、指定された「page」のページに含まれる情報のうち、「per_page」で指定された数に制限
され、@users変数に格納される。たとえば、2ページ目で1ページあたり10件の場合、11~20件目のユーザー情報が取得される。
------------------------------------------------------------------------------------------------
意図
現在のページに必要なUserレコード数を取得し、その配列を@usersに格納することで、APIからフロントへ返却されるデータを
ページネーションに対応した形式に変換することが目的です。
具体的には、Kaminariの`page`と`per`メソッドを使用して、現在のページ番号と1ページあたりに表示するアイテム数を指定
し、`User.all`で全てのユーザー情報を取得した結果から、必要な範囲のデータを取得しています。
取得されたデータは、`@users`という配列に格納され、最終的にJSON形式で返却されます。

================================================================================================
4
admin?
current_api_v1_user オブジェクトの admin? メソッドを呼び出している。このメソッドは、current_api_v1_user オ
ブジェクトが管理者であるかどうかを判定するために使用される。
admin 属性を User モデルに 追加すると、自動的に admin?メソッド(論理値を返す)も使えるようになる。
------------------------------------------------------------------------------------------------
current_api_v1_user
Devise Token Auth のヘルパーメソッド。現在のユーザーオブジェクトを返す。
------------------------------------------------------------------------------------------------
&.（ぼっち演算子）
Rubyの演算子の一つ、セーフナビゲーション演算子。オブジェクトの「メソッド呼び出し」を安全に行うためのものです。
オブジェクト&.メソッドの形式で使用します。
オブジェクトが nil の場合、メソッド呼び出しの結果は 、エラーにならず、nil になります。エラーになりません。オブジェ
クトが nil でない場合は、通常のメソッド呼び出しと同じ結果が得られます。
オブジェクトが存在しない可能性がある場合や、メソッド呼び出し時にエラーを回避したい場合に便利な演算子です。特にオブ
ジェクトのチェーンやネストしたメソッド呼び出しで使用すると、より安全なコードを記述することができます。
current_api_v1_user&.admin?
------------------------------------------------------------------------------------------------
unless current_api_v1_user&.admin?
current_api_v1_user が存在し、かつ admin? メソッドが呼び出せる場合に条件を満たす。
つまり、現在のユーザーが存在し、かつ管理者でない場合に条件が成立します。エラーレスポンスを返します。
管理者以外のユーザーが特定のアクションを実行しようとした場合にエラーメッセージを返すための制御フローです。
------------------------------------------------------------------------------------------------
もし、unless current_api_v1_user.admin?だと、admin属性を正しくチェックしているように見えますが、
current_api_v1_userがnil（ログインしていない状態）の場合にエラーが発生します。そのため、
current_api_v1_user&.admin?として安全な参照を行います。
=end
