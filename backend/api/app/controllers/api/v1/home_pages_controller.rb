class Api::V1::HomePagesController < ApplicationController
  before_action :authenticate_api_v1_user!

  def home
      page = params[:page] || 1
      per_page = params[:per_page] || 10
      if params[:user_id]
        user = User.find_by(id: params[:user_id])
        # feed_itemはmicropostインスタンスの集合
        feed_items = current_user.feed.page(page).per(per_page)
        render json: { status: '200', data: feed_items }, status: :ok
      else
        return render json: { status: '404', message: 'User not found' }, status: :not_found
      end
  end
end
