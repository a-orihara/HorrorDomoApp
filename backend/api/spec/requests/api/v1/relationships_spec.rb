# backend/api/spec/requests/api/v1/relationships_spec.rb
require 'rails_helper'

RSpec.describe "Api::V1::Relationships", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  # 1
  let(:headers) { request_login_user(user) }

  # POST api/v1/relationships #create
  describe "POST /create" do
    it 'ユーザーをフォローできること' do
      # api/v1/relationshipsへPOSTリクエスト
      post api_v1_relationships_path, params: { other_id: other_user.id }, headers: headers
      expect(response).to have_http_status(200)
      # 書き換え：json = JSON.parse(response.body)
      json = response.parsed_body
      expect(json["message"]).to eq 'フォローしました'
      expect(user.following?(other_user)).to be_truthy
    end
  end

  describe "DELETE /destroy" do
    before do
      user.follow(other_user)
    end

    it 'ユーザーのフォローを解除できること' do
      # api/v1/relationshipsへDELETEリクエスト。リクエストのパラメータとしてother_idを送信
      delete api_v1_relationship_path(other_user.id), params: { other_id: other_user.id }, headers: headers
      expect(response).to have_http_status(200)
      # 書き換え：json = JSON.parse(response.body)
      json = response.parsed_body
      expect(json["message"]).to eq 'フォロー解除しました'
      expect(user.following?(other_user)).to be_falsey
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
request_login_user(user)
認証用のヘッダー情報を取得。request_login_userはspec/support/test_macros.rbで定義
=end
