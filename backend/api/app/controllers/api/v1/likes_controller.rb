class Api::V1::LikesController < ApplicationController
  before_action :authenticate_api_v1_user!
  def create
    like = current_api_v1_user.likes.create(post_id: params[:post_id])
    if like.save
      render json: { status: '201', data: like }, status: :ok
    else
      render json: { status: '422', message: like.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    like = Like.find_by(post_id: params[:post_id], user_id: current_api_v1_user.id)
    if like.destroy
      render json: { status: '200', message: 'Like was successfully destroyed.' }, status: :ok
    else
      render json: { status: '422', message: 'Failed to destroy the like.' }, status: :unprocessable_entity
    end
  end
end
