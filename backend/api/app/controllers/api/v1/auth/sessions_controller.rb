class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController

  def destroy
    puts "destroyが発火:DeviseTokenAuth::SessionsController"
    super
  end
  protected

    # サインイン成功時に許可するパラメーターを設定
    def render_create_success
      render json: {
        status: 'success',
        message: I18n.t('devise.sessions.signed_in'),
        data: resource_data(resource_json: @resource.token_validation_response)
      }
    end

    def render_destroy_success
      render json: {
        success: true,
        message: I18n.t('devise.sessions.signed_out')
      }, status: 200
    end

end
