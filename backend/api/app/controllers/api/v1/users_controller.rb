# 1
class Api::V1::UsersController < ApplicationController
  # 2
  before_action :authenticate_api_v1_user!, only: [:index]


  before_action :set_user, only: [:show, :update, :destroy]

  # GET /api/v1/users
  # 3 全てのユーザーをページネーション付きで取得するメソッド
  def index
    # @users = User.all
    # render json: { users: @users }
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    @users = User.all.page(page).per(per_page)
    total_users = User.count # 総ユーザー数を取得
    render json: { users: @users, total_users: total_users } # 総ユーザー数もレスポンスに含める
    # render json: { users: @users }
  end

  # GET /api/v1/users/1
  def show
    puts "Welcome to the show action!"
    render json: @user
    # render json: @user.as_json.merge(
    #   avatar_url: @user.avatar.attached? ? url_for(@user.avatar) : nil
    # )
  end

  # POST /api/v1/users
  # def create
  #   @user = User.new(user_params)

  #   if @user.save
  #     render json: @user, status: :created, location: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_entity
  #   end
  # end

  # PATCH/PUT /api/v1/users/1
  # def update
  #   if @user.update(user_params)
  #     render json: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /api/v1/users/1
  # def destroy
  #   @user.destroy
  # end

  private
    # Userモデルからidに対応するユーザーを検索し、変数userに代入する。
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    # def user_params
    #   params.require(:user).permit(:name, :email, :password, :password_confirmation)
    # end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
DeviseTokenAuthのSessionsControllerやRegistrationsControllerで定義されていない、Userのアクションは別途、
UsersControllerを自作する必要があります。

================================================================================================
2
:authenticate_api_v1_user!
トークン認証を行うメソッド。パスワード認証であれば、サインインしているかどうか確認するメソッドに近い。
Railsアプリケーションの認証機能であるDeviseを使って、APIリクエストを行ったユーザーが認証されているかどうかを確認
するメソッドです。ユーザーが認証されていることを確認できます。
このメソッドは、このコントローラー内の各アクションが実行される前に実行され、認証されていない場合は
401 Unauthorizedのステータスコードを返します。
Railsを使ったAPI開発においては、before_actionフィルターを使用して、アクセス制御のために認証を要求することが一般
的です。

------------------------------------------------------------------------------------------------
before_action :authenticate_api_v1_user!, only: [:index]
ユーザーの index ページ（ユーザー一覧ページ）は、認証（サインイン）したユーザーにしか見せないようにする。

------------------------------------------------------------------------------------------------
set_user
アクションで使用する前に、特定のユーザーをデータベースから取得して @user インスタンス変数に割り当てることを目的と
しています。つまり、@user はコントローラー内の多くのアクションで使用される可能性があるため、その値をセットすること
で、コードの重複を避け、保守性を高めることができます。
:show, :update, :destroy アクションに適用されることを指定しています。

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

=end
