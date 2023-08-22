# backend/api/spec/requests/api/v1/likes_spec.rb
require 'rails_helper'

RSpec.describe 'Api::V1::Likes', type: :request do
  describe 'いいね機能' do
    let(:user) { create(:user) }
    let(:post) { create(:post) }

    before do
      sign_in user # TestMacrosによるサインイン
    end

    describe 'いいね作成' do
      context '有効なパラメータの場合' do
        it 'いいねが作成される' do
          expect do
            post api_v1_post_likes_path(post_id: post.id)
          end.to change(Like, :count).by(1)
          expect(response).to have_http_status(:ok)
        end
      end

      context '無効なパラメータの場合' do
        it 'いいねが作成されない' do
          expect do
            post api_v1_post_likes_path(post_id: nil)
          end.to change(Like, :count).by(0)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'いいね削除' do
      let!(:like) { create(:like, user: user, post: post) }

      it 'いいねが削除される' do
        expect do
          delete destroy_api_v1_post_likes_path(post_id: post.id)
        end.to change(Like, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
