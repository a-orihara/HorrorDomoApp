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
          # factorybotのuserのpasswordは'testtest'で作成されている
          password: 'testtest'
        }
      end

      it '成功ステータスを返すこと' do
        # 1.1 success: 200 OKが返ってくることを確認
        expect(response).to have_http_status(:success)
      end

      it '成功メッセージを返すこと' do
        # 1.2 deviseの日本語化ファイルに設定したメッセージが返ってくることを確認
        expect(response.parsed_body['message']).to eq I18n.t('devise.sessions.signed_in')
      end
    end

    context '無効なパラメータが与えられた場合' do
      before do
        post api_v1_user_session_path, params: {
          email: user.email,
          # factorybotのuserのpasswordは'testtest'で作成されている
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
1.1
:success はHTTPステータスコードであり、一般的には200 OKを表します。
================================================================================================

================================================================================================
1.2
`response.parsed_body`の`parsed_body`は、Railsのテスト環境で使用されるメソッドで、レスポンスボディ（通常はJ
SON形式の文字列）をRubyのハッシュにパースする機能を持っている。
- `response`オブジェクトは、HTTPリクエスト（この場合はPOSTやDELETEなど）の後に得られるレスポンスを表す。
- このレスポンスにはヘッダーやステータスコードの他に、ボディ（body）が含まれている。ボディは通常、JSON形式の文字
列でサーバーから返される。
- `parsed_body`メソッドは、このJSON形式のレスポンスボディをRubyのハッシュに変換する。これにより、テストコード
内でレスポンスの内容を簡単にアクセスしやすく解析できるようになる。
- `response.parsed_body['message']`は、レスポンスボディのJSONオブジェクトから`message`キーに関連する値を
取り出す。
------------------------------------------------------------------------------------------------
`response.parsed_body['message']`でレスポンスボディをハッシュに変換してテストする理由
. **Rubyでの操作の容易さ**：Rubyはハッシュを処理するのに非常に適している。JSON形式の文字列よりもハッシュを操作す
る方が、Rubyでのテストコード記述が簡単で直感的になる。
. **一貫性のあるアプローチ**：APIのレスポンスをハッシュに統一して扱うことで、異なるテストケース間で一貫性を保つこ
とができる。これにより、テストスイート全体の保守性が向上する。

================================================================================================
2
:unauthorized はHTTPステータスコードであり、401 Unauthorizedを表します。

=end
