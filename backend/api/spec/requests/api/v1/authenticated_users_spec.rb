# backend/api/spec/requests/api/v1/authenticated_users_spec.rb

require 'rails_helper'

RSpec.describe "Api::V1::AuthenticatedUsers", type: :request do
  let(:user) { create(:user) }

  # api/v1/authenticated_usersコントローラのテスト
  describe "GET /index" do
    context 'ユーザーが認証されている場合' do
      before do
        auth_headers = user.create_new_auth_token
        get api_v1_authenticated_users_path, headers: auth_headers
      end

      it 'is_loginがtrueであり、ユーザーデータが返されること' do
        json = response.parsed_body
        expect(json['is_login']).to be true
        expect(json['data']['id']).to eq user.id
        expect(json['data']['email']).to eq user.email
        expect(json['data']['name']).to eq user.name
      end
    end

    context 'ユーザーが認証されていない場合' do
      before do
        get api_v1_authenticated_users_path
      end

      it 'is_loginがfalseであり、メッセージが返されること' do
        json = response.parsed_body
        expect(json['is_login']).to be false
        expect(json['message']).to eq 'ユーザーが存在しません'
      end
    end
  end
end
