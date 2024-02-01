require 'rails_helper'

RSpec.describe "Api::V1::Likes", type: :request do
  let(:user) { create(:user) }
  let(:post) { create(:post) }
  # 作成したuserとpostに対する[いいね]
  let(:like) { create(:like, user: user, post: post) }
  let(:headers) { create_auth_token_headers(user) }

  # POST api/v1/posts/:post_id/likes #create
  # describe "POST /create" do
  #   it '投稿に対していいねを作成できること' do
  #     post api_v1_post_likes_path(post_id: post.id), { post_id: post.id }, headers: headers
  #     # post api_v1_post_likes_path(post_id: post.id), params: { post_id: post.id }, headers: headers
  #     expect(response).to have_http_status(200)
  #     json = response.parsed_body
  #     expect(json["status"]).to eq '201'
  #     expect(user.already_liked?(post)).to be_truthy
  #   end
  # end

  # DELETE api/v1/posts/:post_id/likes/destroy #destroy
  describe "DELETE /destroy" do
    before do
      user.likes.create!(post_id: post.id)
    end

    it '投稿のいいねを解除できること' do
      delete api_v1_post_likes_path(post_id: post.id), headers: headers
      expect(response).to have_http_status(200)
      json = response.parsed_body
      expect(json["status"]).to eq '200'
      expect(user.already_liked?(post)).to be_falsy
    end
  end
end
