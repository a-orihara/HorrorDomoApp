# backend/api/spec/requests/api/v1/authenticated_users_spec.rb

require 'rails_helper'

RSpec.describe "Api::V1::AuthenticatedUsers", type: :request do
  let(:user) { create(:user) }

  # api/v1/authenticated_usersコントローラのテスト
  describe "GET /index" do
    context 'ユーザーが認証されている場合' do
      before do
        # 1
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

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
*user.create_new_auth_tokenがここで使える理由
create_new_auth_tokenメソッドは、devise_token_auth gemによって提供されます。
UserモデルにはDeviseTokenAuth::Concerns::Userが含まれており、Userモデルにトークン認証機能を追加しています。
このConcernsを含めることで、create_new_auth_tokenメソッドがUserインスタンスで利用可能になり、ユーザー用の新し
い認証トークンを生成できるようになります。

*create_new_auth_token
ユーザーの新しい認証トークン（access-token、client、uid）セットを生成します。
これらのトークンは、その後のAPIリクエストでユーザーを認証するために使用されます。
このメソッドは、ユーザーのトークン関連属性を更新し、ユーザーレコードを保存して、新しく生成されたトークンを保存します。
これを使用して、APIリクエストに適切なヘッダーを設定することができます。
=end
