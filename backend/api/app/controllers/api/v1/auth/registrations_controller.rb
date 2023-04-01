class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

  def sign_up_params
    # サインアップ時に登録できるカラムを指定
    params.permit(:email, :password, :password_confirmation, :name)
  end
end
