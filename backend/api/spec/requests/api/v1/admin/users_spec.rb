require 'rails_helper'

# api/v1/admin/usersコントローラのテスト
RSpec.describe 'Api::V1::Admin::Users', type: :request do
  # 管理者ユーザーを作成
  let(:admin) { create(:user, admin: true) }
  # 一般ユーザーを作成
  let(:user) { create(:user) }
  # headersにadminユーザーで生成したトークンを代入。adminはletで定義したadmin。
  # request_login_userはspec/support/test_macros.rbで定義。戻り値はトークンを設定したheaderハッシュ
  # このメソッドにより、テスト内で認証済みのユーザーとしてAPIリクエストを送ることができます
  let(:headers) { request_login_user(admin) }

  # DELETE /api/v1/admin/users/:id api/v1/admin/users#destroy
  describe 'DELETE /api/v1/admin/users/:id (ユーザー削除)' do
    context '管理者ユーザーとして' do
      it 'ユーザーを削除する' do
        # 一般ユーザーを削除。headersにadminユーザーで生成したトークンを代入。
        delete api_v1_admin_user_path(user), headers: headers
        # リクエストが成功し、ステータスコードが200であることを確認。
        expect(response).to have_http_status(:ok)
        # レスポンスのbodyのJSONをRubyのハッシュに変換して、変数jsonに代入。
        json = response.parsed_body
        expect(json['status']).to eq 'success'
        expect(json['message']).to eq 'ユーザーが削除されました。'
      end
    end

    context '非管理者ユーザーとして' do
      let(:headers) { request_login_user(user) }

      it 'ユーザーの削除に失敗する' do
        delete api_v1_admin_user_path(user), headers: headers
        # forbidden(403)が返ってくることを確認。
        expect(response).to have_http_status(:forbidden)
        json = response.parsed_body
        expect(json['status']).to eq 'error'
        expect(json['message']).to eq 'この操作は、管理者のみ行うことができます。'
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
=end
