# クラスは一種のデータ型。コントローラー名は複数形。
class Api::V1::UsersController < ApplicationController
  # GET:/users
  def index
    # @users(インスタンス変数:同じオブジェクト内で共有される変数)でなくていい。
    users = User.all
    # 5
    # logger.debug("【デバック】:#{users.inspect}")
    # 3 5 Userモデルのオブジェクトの値を入れた変数usersを、json形式({users: [{値}] })に変換。
    # jsonオプションとstatusオプションを使用
    # status: :ok = status: 200
    render json: { users: }, status: :ok
    # →{"users":[{"id":1,"name":"momo.dev","email":"~","created_at":"~","updated_at":"~","password_digest":"~"}]}
  end

  def create
    # user_paramsの戻り値のparamsを引数に入れる
    user = User.new(user_params)

    if user.save
      # frontからPOSTされるユーザーデータをDBに保存し、その後JSONとして返り値をレンダリング。
      # status: :created = status: 201。user:->user: userの省略形。
      render json: { status: :created, user: }
      # {"status":"created","user":{"id":2,"name":"値","email":"値","created_at":"値","updated_at":"値","password_digest":"値"}}%
    else
      # 500 :internal_server_error
      render json: { status: 500 }
    end
  end

  # 4
  private

  # 戻り値は、許可された属性のみが含まれたparamsのハッシュ
  def user_params
    # permit(<許可するカラムを指定>)
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
