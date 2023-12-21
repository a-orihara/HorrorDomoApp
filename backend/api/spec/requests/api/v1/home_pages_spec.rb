require 'rails_helper'

# 1.1
RSpec.describe 'Api::V1::HomePages', type: :request do
  let(:user) { create(:user) }
  let(:headers) { create_auth_token_headers(user) }
  let(:followed_user) { create(:user) }
  # ここに書かない。letは遅延評価
  # let(:post) { create(:post, user: followed_user) }
  let(:page) { 1 }
  let(:per_page) { 10 }

  describe 'GET /home' do
    # 1.2
    context '認証されたユーザーが存在する場合' do
      before do
        user.follow(followed_user)
        # 1.2
        create(:post, user: followed_user)
        get api_v1_root_path, params: { user_id: user.id, page: page, per_page: per_page }, headers: headers
        # puts "ここresponse.body:#{response.body}"
      end

      it 'ステータスコード200を返すこと' do
        expect(response).to have_http_status(200)
      end

      it '正しいフィード情報を返すこと' do
        # レスポンスのJSON形式をハッシュに変換し、 json 変数に格納
        json = response.parsed_body
        # 1.3
        expect(json['data']).to be_present
        expect(json['feed_total_count']).to eq(user.feed.count)
      end
    end

    # ユーザーIDがパラメータに含まれていない状況でのレスポンスをテスト
    context '認証ユーザーが存在しない場合' do
      before do
        get api_v1_root_path, headers: headers
      end

      it 'ステータスコード404を返すこと' do
        expect(response).to have_http_status(404)
      end

      it 'エラーメッセージを返すこと' do
        json = response.parsed_body
        expect(json['message']).to eq('ユーザーを取得出来ません')
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
`api/v1/home_pages_spec.rb`のテストは、`Api::V1::HomePages`コントローラの`home`アクションをテストしてい
ます。このアクションは、特定のユーザーに関連するフィード情報を取得することを目的としています。

================================================================================================
1.2
- **'ユーザーが存在する場合'**
このコンテキストでは、認証されたユーザー（`current_api_v1_user`）が存在し、そのユーザーのフィードデータを取得す
る処理をテストしています。具体的には、ユーザーがフォローしている他のユーザー（`followed_user`）による投稿がフィー
ドに表示されるかどうかを検証しています。この場合の「ユーザー」は、APIのエンドポイントにリクエストを送信する認証され
たユーザーを指します。

- テストでは、まず`user`が`followed_user`をフォローし、`followed_user`による投稿を作成しています。その後、指定されたページネーションパラメータ（`page`と`per_page`）と認証トークンを含むヘッダー（`headers`）を使用して`GET /home`にリクエストを送信し、レスポンスが期待通りのものであるかを検証しています。

- **'ユーザーが存在しない場合'** のコンテキストでは、ユーザーIDがパラメータに含まれていない状況でのレスポンスをテストしています。この場合、ステータスコード404（Not Found）とエラーメッセージ「ユーザーを取得出来ません」が返されることを検証しています。

要するに、このテストはユーザーのフィードデータの取得と、ユーザーが存在しない場合のエラーハンドリングの挙動を検証しているのです。

================================================================================================
1.3
- `before`ブロック内でフォローしたユーザー`followed_user`に対して投稿を作成しています。
- この投稿は、`get api_v1_root_path`によるリクエストの前に作成されるため、コントローラーの`home`アクションで、
`current_api_v1_user.feed`が取得するフィードに含まれます。
- 結果として、期待するフィード情報がレスポンスに含まれるため、テストは成功します。
- `let(:post) { create(:post, user: followed_user) }`の記述は`before`ブロックの外にあります。
- RSpecの`let`メソッドは、その値が初めて参照された時に評価される遅延評価を行います。この場合、テストが実行される
時点で`post`が参照されていないため、投稿は作成されません。
- そのため、コントローラーの`home`アクションで`current_api_v1_user.feed`が取得するフィードには、この投稿が含
まれず、期待するフィード情報がレスポンスに含まれないため、テストは失敗します。
したがって、`create(:post, user: followed_user)`を`before`ブロック内で実行する必要があります。

================================================================================================
1.4
puts ":#{json['data']}"
json 変数内のデータの中に 'data' フィールドが存在することを確認
.to be_present は、データが存在することを確認するマッチャ
=end
