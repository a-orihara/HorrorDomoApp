# backend/api/spec/requests/api/v1/movies_spec.rb
require 'rails_helper'

RSpec.describe "Api::V1::Movies", type: :request do
  let(:user) { create(:user) }
  let(:headers) { request_login_user(user) }
  let(:title) { "ジョーズ" }

  describe "GET /index" do
    context 'ユーザーが認証されている場合' do
      before do
        get api_v1_movies_path, params: { title: title }, headers: headers
      end

      it 'ステータスコード200を返すこと' do
        expect(response).to have_http_status(200)
      end

      it '映画情報を返すこと' do
        json = JSON.parse(response.body)
        puts "ここjson:#{json['data']}"
        expect(json['data']).to be_present
      end
    end

    context 'ユーザーが認証されていない場合' do
      before do
        get api_v1_movies_path, params: { title: title }
      end

      it 'ステータスコード401を返すこと' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
