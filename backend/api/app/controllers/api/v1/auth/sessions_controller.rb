class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  protected

    # サインイン成功時に許可するパラメーターを設定
    def render_create_success
      render json: {
        status: 'success',
        message: I18n.t('devise.sessions.signed_in'),
        data: resource_data(resource_json: @resource.token_validation_response)
      }
    end
end
