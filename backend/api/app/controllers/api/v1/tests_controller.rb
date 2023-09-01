class Api::V1::TestsController < ApplicationController
  def index
    render json: { data: "momo" }
    # render 'api/v1/tests/index'
    puts "ハロー"
  end
end