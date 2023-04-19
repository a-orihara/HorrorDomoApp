# 1
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController

  # 4
  protected

    # def update_resource(resource, params)
    #   パスワードが空の場合は、パスワードの更新をスキップ
    #   if params[:password].blank?
    #     resource.update_without_password(params)
    #   else
    #     super
    #   end
    #   # resource.update_without_password(params)
    # end

  private

    # 2
    def sign_up_params
      # サインアップ時に登録できるカラムを指定
      params.permit(:email, :password, :password_confirmation, :name)
    end


    # def account_update_params
    #   params.permit(:name, :email)
    #   update_params.delete(:email) if update_params[:email].blank?
    # end
    # 3
    def account_update_params
      update_params = params.permit(:name, :email)
      update_params.delete(:email) if update_params[:email].blank?
      update_params
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

================================================================================================
3
account_update_params
DeviseとDeviseTokenAuthで提供されるユーザーアカウント情報の更新に関するメソッドで、ストロングパラメーターの一種
です。更新時に許可される属性を指定するために使用されます。
これをオーバーライドしています。

update_params
ハッシュオブジェクト。params.permit(:name, :email) によって許可されたキーと値がハッシュ形式で取得されます。

------------------------------------------------------------------------------------------------
Rubyにおいて、子クラスで親クラスのメソッドをオーバーライドした場合、子クラスのオーバーライドされたメソッドが呼び出
されます。このとき、親クラスの元のメソッドは呼び出されません。ただし、子クラスのオーバーライドされたメソッド内で
superキーワードを使用することで、親クラスの元のメソッドを呼び出すことができます。

------------------------------------------------------------------------------------------------
DeviseTokenAuth::RegistrationsControllerのデフォルトのupdateメソッドは、ユーザー情報（例：メールアドレス、
パスワード）の更新を行います。このメソッドは、認証済みのユーザーが自分の情報を更新する際に使用されます。通常、このア
クションは、ユーザーがアカウント情報を更新するフォームからリクエストが送信されたときに実行されます。

デフォルトのupdateメソッドをカスタマイズする場合、一般的に以下のようなカスタマイズが行われることが多いです。
パラメータの許可リストの変更: デフォルトのupdateメソッドでは、特定のパラメータ（メールアドレス、パスワードなど）が
許可されています。しかし、ユーザーモデルにカスタム属性が追加された場合、それらの属性も許可リストに追加する必要があり
ます。これがaccount_update_paramsメソッドのオーバーライドの目的です。
更新処理の追加: ユーザー情報の更新に伴って追加の処理（例：履歴の記録、通知の送信）が必要な場合、デフォルトのupdate
メソッドをオーバーライドして、その処理を追加できます。
バリデーションの追加: デフォルトのupdateメソッドでは、ユーザーモデルに定義されたバリデーションが適用されます。しか
し、更新時に特定の条件を満たす必要がある場合（例：パスワードの強度チェック、電話番号の形式チェック）、デフォルトの
updateメソッドをオーバーライドして、追加のバリデーションを実行できます。
DeviseTokenAuth::RegistrationsControllerのデフォルトのupdateアクションでは、account_update_paramsメソ
ッドが使用されています。
DeviseTokenAuth::RegistrationsController にはデフォルトの update メソッドが定義されており、その中で
account_update_params メソッドが使用されます。registrations_controller.rb で account_update_paramsを
オーバーライドすることで、デフォルトの update メソッドが使用するパラメータをカスタマイズできます。

================================================================================================
4
protectedはRubyにおけるアクセス修飾子の一つで、記述したそのクラス自身、またはその親クラス内で呼び出しが可能です。
親クラスでprotectedメソッドを定義すると、その子クラスでも呼び出すことができます。ただし、インスタンスメソッドを呼
び出す場合は、同じオブジェクト内である必要があります。
protectedの利用意図の一例として、サブ（子）クラスでのみ使用するメソッドを定義することが挙げられます。

=end
