class Api::V1::UsersController < ApplicationController
  # 1

  before_action :set_user, only: [:show, :update, :destroy]

  # GET /api/v1/users
  # def index
  #   @users = User.all
  #   render json: @users
  # end

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
:authenticate_api_v1_user!
Railsアプリケーションの認証機能であるDeviseを使って、APIリクエストを行ったユーザーが認証されているかどうかを確認
するメソッドです。ユーザーが認証されていることを確認できます。
このメソッドは、このコントローラー内の各アクションが実行される前に実行され、認証されていない場合は
401 Unauthorizedのステータスコードを返します。
Railsを使ったAPI開発においては、before_actionフィルターを使用して、アクセス制御のために認証を要求することが一般
的です。
------------------------------------------------------------------------------------------------
set_user
アクションで使用する前に、特定のユーザーをデータベースから取得して @user インスタンス変数に割り当てることを目的と
しています。つまり、@user はコントローラー内の多くのアクションで使用される可能性があるため、その値をセットすること
で、コードの重複を避け、保守性を高めることができます。
:show, :update, :destroy アクションに適用されることを指定しています。
=end
