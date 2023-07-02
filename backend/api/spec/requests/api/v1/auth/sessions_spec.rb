require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  let(:user) { create(:user) }

  # api/v1/auth/sessions#create（サインイン）のテスト
  describe 'POST /api/v1/auth/sign_in' do
    context '有効なパラメータが与えられた場合' do
      before do
        # POST /api/v1/auth/sign_in: api/v1/auth/sessions#create
        post api_v1_user_session_path, params: {
          email: user.email,
          password: 'testtest'
        }
      end

      it '成功ステータスを返すこと' do
        # 1 success: 200 OKが返ってくることを確認
        expect(response).to have_http_status(:success)
      end

      it '成功メッセージを返すこと' do
        # deviseの日本語化ファイルに設定したメッセージが返ってくることを確認
        expect(response.parsed_body['message']).to eq I18n.t('devise.sessions.signed_in')
      end
    end

    context '無効なパラメータが与えられた場合' do
      before do
        post api_v1_user_session_path, params: {
          email: user.email,
          password: 'wrongpassword'
        }
      end

      it '認証失敗ステータスを返すこと' do
        # 2 unauthorized: 401 Unauthorizedが返ってくることを確認
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # api/v1/auth/sessions#destroy（サインアウト）のテスト
  describe 'DELETE /api/v1/auth/sign_out' do
    context 'ユーザーがログインしている場合' do
      before do
        # POST /api/v1/auth/sign_in: api/v1/auth/sessions#create
        post api_v1_user_session_path, params: {
          email: user.email,
          password: 'testtest'
        }
        # response.headersは、直前のpost api_v1_user_session_pathのレスポンスヘッダー。
        delete destroy_api_v1_user_session_path, headers: {
          'uid' => response.header['uid'],
          'access-token' => response.header['access-token'],
          'client' => response.header['client']
        }
      end

      it '成功ステータスを返すこと' do
        expect(response).to have_http_status(:success)
      end

      it '成功メッセージを返すこと' do
        expect(response.parsed_body['message']).to eq I18n.t('devise.sessions.signed_out')
      end
    end

    context 'ユーザーがログインしていない場合' do
      before do
        delete destroy_api_v1_user_session_path
      end

      it '認証失敗ステータスを返すこと' do
        # not_found: 404 Not Foundが返ってくることを確認
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
:success はHTTPステータスコードであり、一般的には200 OKを表します。
================================================================================================
2
:unauthorized はHTTPステータスコードであり、401 Unauthorizedを表します。
================================================================================================
=end
