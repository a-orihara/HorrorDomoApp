# backend/api/spec/requests/api/v1/health_check_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::HealthCheck", type: :request do
  describe "GET api/v1/health_check" do
    it "正常にレスポンスが返る" do
      get(api_v1_health_check_path)
      # res = JSON.parse(response.body) *rubocopの警告が出る
      res = response.parsed_body
      expect(res["message"]).to eq "成功:Success Health Check!"
      expect(response).to have_http_status(:success)
    end
  end
end
