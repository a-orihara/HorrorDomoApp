# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

  # 2
  def sign_up_params
    # サインアップ時に登録できるカラムを指定
    params.permit(:email, :password, :password_confirmation, :name)
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
このコードは、DeviseTokenAuthのRegistrationsControllerを継承した
Api::V1::Auth::RegistrationsControllerクラスで、サインアップ時に許可されるパラメータを指定する
sign_up_paramsメソッドを定義しています。params.permitで許可するカラムを指定しています。
このコードの利用意図は、サインアップ時に必要なカラムを指定することで、不必要なパラメータが登録されることを防止し、セ
キュリティを強化することです。
サインアップ時に必要なカラムを指定することは一般的であり、Railsのstrong parametersを使った設定も同様です。また
、Deviseの設定においても、ユーザー登録に必要なカラムを指定する設定が一般的です。

================================================================================================
2
sign_up_paramsメソッドは、サインアップ時に登録できるカラムを指定するために使用されます。具体的には、paramsオブ
ジェクトからemail、password、password_confirmation、nameの4つのパラメータのみを取得します。
sign_up_paramsメソッドの目的は、セキュリティ上の理由から、不要な情報が含まれている場合に備えて、許可されたパラメ
ータ以外は受け付けないようにすることです。
これはDeviseやDeviseTokenAuthなどの認証Gemを使用する場合によく見られます。また、Strong Parametersを使用する
Railsの標準的な方法でもあります。
sign_up_params は、Devise Token Auth の RegistrationsController に実装されているアクションです。ただし、
Devise の RegistrationsController でも、同様のアクションが存在するため、混乱が生じる場合があります。
Devise Token Auth の sign_up_params は、新規ユーザー登録に必要なパラメータを許可するストロングパラメーターを
定義するために使用されます。
=end
