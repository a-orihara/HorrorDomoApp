class Api::V1::TestsController < ApplicationController
  def index
    render json: { data: "momo" }
  end
end