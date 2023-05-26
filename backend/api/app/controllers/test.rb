# frozen_string_literal: true

module DeviseTokenAuth
  class RegistrationsController < DeviseTokenAuth::ApplicationController
    # 1
    before_action :set_user_by_token, only: [:destroy, :update]
    before_action :validate_sign_up_params, only: :create
    before_action :validate_account_update_params, only: :update
    skip_after_action :update_auth_header, only: [:create, :destroy]

    # 1
    def create
      # 新しいユーザー（リソース）を作成し、そのインスタンスを@resourceインスタンス変数に割り当て
      build_resource

      # @resourceが存在しない場合、エラーを発生させます。
      unless @resource.present?
        raise DeviseTokenAuth::Errors::NoResourceDefinedError,
              "#{self.class.name} #build_resource does not define @resource,"\
              ' execution stopped.'
      end

      # ダイレクトURLを設定しています。このURLは、ユーザーが登録後にリダイレクトされる場所です。
      @redirect_url = params.fetch(
        # ユーザーが登録後にリダイレクトされるURLを設定するパラメーター
        :confirm_success_url,
        # confirm_success_urlの値がない場合、DeviseTokenAuthのデフォルトのリダイレクトURLを使用
        DeviseTokenAuth.default_confirm_success_url
      )

      # メールによる確認が有効になっており、かつリダイレクトURLが設定されていない場合に、エラーレスポンスを生成
      if confirmable_enabled? && !@redirect_url
        # メール確認が必要であり、リダイレクトURLが提供されていない場合、エラー
        return render_create_error_missing_confirm_success_url
      end

      # @redirect_urlがブラックリスト（許可されないリダイレクトURLのリスト）に含まれている場合にエラーレスポンスを生成
      return render_create_error_redirect_url_not_allowed if blacklisted_redirect_url?(@redirect_url)

      # override email confirmation, must be sent manually from ctrl
      callback_name = defined?(ActiveRecord) && resource_class < ActiveRecord::Base ? :commit : :create
      resource_class.set_callback(callback_name, :after, :send_on_create_confirmation_instructions)
      resource_class.skip_callback(callback_name, :after, :send_on_create_confirmation_instructions)

      if @resource.respond_to? :skip_confirmation_notification!
        # Fix duplicate e-mails by disabling Devise confirmation e-mail
        @resource.skip_confirmation_notification!
      end

      if @resource.save
        yield @resource if block_given?

        unless @resource.confirmed?
          # user will require email authentication
          @resource.send_confirmation_instructions({
            client_config: params[:config_name],
            redirect_url: @redirect_url
          })
        end

        if active_for_authentication?
          # email auth has been bypassed, authenticate user
          @token = @resource.create_token
          @resource.save!
          update_auth_header
        end

        render_create_success
      else
        clean_up_passwords @resource
        render_create_error
      end
    end

    def update
      if @resource
        if @resource.send(resource_update_method, account_update_params)
          yield @resource if block_given?
          render_update_success
        else
          render_update_error
        end
      else
        render_update_error_user_not_found
      end
    end

    def destroy
      if @resource
        @resource.destroy
        yield @resource if block_given?
        render_destroy_success
      else
        render_destroy_error
      end
    end

    def sign_up_params
      params.permit(*params_for_resource(:sign_up))
    end

    def account_update_params
      params.permit(*params_for_resource(:account_update))
    end

    protected

    def build_resource
      @resource            = resource_class.new(sign_up_params)
      @resource.provider   = provider

      # honor devise configuration for case_insensitive_keys
      if resource_class.case_insensitive_keys.include?(:email)
        @resource.email = sign_up_params[:email].try(:downcase)
      else
        @resource.email = sign_up_params[:email]
      end
    end

    def render_create_error_missing_confirm_success_url
      response = {
        status: 'error',
        data:   resource_data
      }
      message = I18n.t('devise_token_auth.registrations.missing_confirm_success_url')
      render_error(422, message, response)
    end

    def render_create_error_redirect_url_not_allowed
      response = {
        status: 'error',
        data:   resource_data
      }
      message = I18n.t('devise_token_auth.registrations.redirect_url_not_allowed', redirect_url: @redirect_url)
      render_error(422, message, response)
    end

    def render_create_success
      render json: {
        status: 'success',
        data:   resource_data
      }
    end

    def render_create_error
      render json: {
        status: 'error',
        data:   resource_data,
        errors: resource_errors
      }, status: 422
    end

    def render_update_success
      render json: {
        status: 'success',
        data:   resource_data
      }
    end

    def render_update_error
      render json: {
        status: 'error',
        errors: resource_errors
      }, status: 422
    end

    def render_update_error_user_not_found
      render_error(404, I18n.t('devise_token_auth.registrations.user_not_found'), status: 'error')
    end

    def render_destroy_success
      render json: {
        status: 'success',
        message: I18n.t('devise_token_auth.registrations.account_with_uid_destroyed', uid: @resource.uid)
      }
    end

    def render_destroy_error
      render_error(404, I18n.t('devise_token_auth.registrations.account_to_destroy_not_found'), status: 'error')
    end

    private

    def resource_update_method
      if DeviseTokenAuth.check_current_password_before_update == :attributes
        'update_with_password'
      elsif DeviseTokenAuth.check_current_password_before_update == :password && account_update_params.key?(:password)
        'update_with_password'
      elsif account_update_params.key?(:current_password)
        'update_with_password'
      else
        'update'
      end
    end

    def validate_sign_up_params
      validate_post_data sign_up_params, I18n.t('errors.messages.validate_sign_up_params')
    end

    def validate_account_update_params
      validate_post_data account_update_params, I18n.t('errors.messages.validate_account_update_params')
    end

    def validate_post_data which, message
      render_error(:unprocessable_entity, message, status: 'error') if which.empty?
    end

    def active_for_authentication?
      !@resource.respond_to?(:active_for_authentication?) || @resource.active_for_authentication?
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
before_action :set_user_by_token, only: [:destroy, :update]
トークンからユーザーを特定してインスタンス変数@resourceにセット。アクション内で@resourceとしてユーザーを参照でき
るようになる。
before_action :validate_sign_up_params, only: :create
新規登録に必要なパラメータが適切にセットされていることを確認します。もし必要なパラメータが欠けていたり不適切であった
場合、エラーレスポンスが返されます。
before_action :validate_account_update_params, only: :update
アカウント更新に必要なパラメータが適切にセットされていることを確認します。もし必要なパラメータが欠けていたり不適切で
あった場合、エラーレスポンスが返されます。
skip_after_action :update_auth_header, only: [:create, :destroy]
新規登録(create)やアカウント削除(destroy)アクションが行われた後に、update_auth_headerメソッドの実行をスキップ
通常、アクションの後にはこのメソッドが実行され、レスポンスヘッダに認証トークンが設定されますが、新規登録やアカウント
削除の場合にはこのメソッドの実行をスキップするようになっています。
================================================================================================
2
create

まず初めに、このコントローラはDevise Token Auth gemの一部で、ユーザーの登録（新規作成）、アップデート、そして削
除を担当します。今回特に詳細に説明するのは `create` メソッドです。このメソッドは新規ユーザーを作成し、条件によっては確認メールを送信します。

`create`メソッドは以下の手順で実行されます：

1. `build_resource`: メソッドで新規ユーザー（リソース）のインスタンスを作成します。この時、リクエストパラメータ
から取得したデータ（メールアドレスなど）が設定されます。

2. 次に、`@resource`が存在するかどうかを確認します。もし`@resource`が存在しない場合、エラーがスローされます。
これは`build_resource`メソッドが`@resource`を適切に定義していない場合のエラーハンドリングです。

3. その後、確認メールの送信に利用するリダイレクトURL（`@redirect_url`）を設定します。リクエストパラメータから
取得できない場合、デフォルトのリダイレクトURLが使用されます。

4. ユーザーがメールアドレスの確認を必要とする場合（`confirmable_enabled?`が`true`）、リダイレクトURLが必要
です。もし`@redirect_url`が存在しない場合、エラーレスポンスが生成されます。

5. 次に、`@redirect_url`がブラックリストに含まれているか確認します。含まれている場合、エラーレスポンスが生成
されます。

6. メールの確認通知が送信されるコールバックを設定し、すぐにそれをスキップします。これにより、デフォルトの
Deviseの確認メールの送信が無効になります。

7. `@resource`がメールの確認通知をスキップするメソッドを持つ場合（`skip_confirmation_notification!`）、
それを呼び出します。これは、ユーザーが手動で確認メールを送信するまで、Deviseの確認メールの送信を無効にします。

8. 次に、`@resource.save`を試みます。この操作が成功すれば、ユーザーはデータベースに保存されます。

9. 保存が成功した場合、次にユーザーが確認済みかどうかを確認します。もし未確認であれば、確認メールを送信します。
この時、リダイレクトURLやクライアントの設定などが指定されます。

10. 次に、ユーザーが認証可能かどうかを確認します。もし認証可能であれば、トークンを生成し、ユーザーを保存しま
す。そして認証ヘッダーを更新します。

11. 最後に、成功のレスポンスを返します。

12. 一方、`@resource.save`が失敗した場合は、ユーザーのパスワードをクリアし、エラーレスポンスを返します。

以上が、`create`メソッドの詳細な説明となります。基本的には新規ユーザーを作成し、条件によっては確認メールを送
信するという処理を行っています。これらの処理は一般的なユーザー登録の流れと同じですが、確認メールの送信を制御す
る部分や、リダイレクトURLの設定など、特定の要件を満たすための処理が含まれています。

================================================================================================
3
`update`メソッドは、ユーザー情報（リソース）の更新を担当します。具体的な手順は以下の通りです：

1. まず、`before_action`で設定された`set_user_by_token`により、`@resource`（更新対象のユーザー）が設定され
ます。これにより、認証トークンに紐づくユーザーが特定されます。

2. 次に、更新対象のユーザー（`@resource`）が存在するか確認します。存在しない場合はエラーレスポンス（ユーザーが見
つからない）を返します。

3. ユーザーが存在した場合、`@resource.send(resource_update_method, account_update_params)`を呼び出し
ます。これにより、特定のパラメータでユーザー情報を更新します。更新メソッドは`resource_update_method`で決定さ
れ、更新パラメータは`account_update_params`で取得します。

4. 更新が成功した場合（`@resource.send(resource_update_method, account_update_params)`が`true`を返
した場合）、成功のレスポンスを返します。

5. 更新が失敗した場合（`@resource.send(resource_update_method, account_update_params)`が`false`を
返した場合）、エラーレスポンスを返します。

なお、`resource_update_method`は、パスワード更新の設定に応じて、どのメソッドを使用するかを決定します。具体
的には以下の通りです：

- `DeviseTokenAuth.check_current_password_before_update`が`:attributes`の場合、またはパスワード更
新をリクエストした場合（`:password`が存在する場合）、現在のパスワードを確認してから更新します
（`update_with_password`）。

- `DeviseTokenAuth.check_current_password_before_update`が`:password`の場合で、新パスワードがリク
エストに存在しない場合、パスワード確認なしに更新します（`update`）。

- 現在のパスワードがリクエストに存在する場合も、現在のパスワードを確認してから更新します
（`update_with_password`）。

- それ以外の場合（つまり、パスワード更新がリクエストされていない場合）は、パスワード確認なしに更新します
（`update`）。

このように、`update`メソッドは、リクエストパラメータや設定に応じて、適切な方法でユーザー情報を更新します。
また、適切なエラーハンドリングも行われており、更新の可否に応じて適切なレスポンスが返されます。
=end
