class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "成功：Success Health Check!" }, status: :ok
  end
end
