require 'rails_helper'
require 'pp'

RSpec.describe 'Api::V1::HomePages', type: :request do
  let(:user) { create(:user) }
  let(:headers) { request_login_user(user) }
  let(:followed_user) { create(:user) }
  # ここに書かない。letは遅延評価
  # let(:post) { create(:post, user: followed_user) }
  let(:page) { 1 }
  let(:per_page) { 10 }

  describe 'GET /home' do
    context 'ユーザーが存在する場合' do
      before do
        user.follow(followed_user)
        # 1
        create(:post, user: followed_user)
        get api_v1_root_path, params: { user_id: user.id, page: page, per_page: per_page }, headers: headers
        # puts "ここresponse.body:#{response.body}"
      end

      it 'ステータスコード200を返すこと' do
        expect(response).to have_http_status(200)
      end

      it '正しいフィード情報を返すこと' do
        # レスポンスのJSON形式を8種に変換し、 json 変数に格納
        json = JSON.parse(response.body)
        # puts ":#{json['data']}"
        # json 変数内のデータの中に 'data' フィールドが存在することを確認
        # .to be_present は、データが存在することを確認するマッチャ
        expect(json['data']).to be_present
        expect(json['feed_total_count']).to eq(user.feed.count)
      end
    end

    context 'ユーザーが存在しない場合' do
      before do
        get api_v1_root_path, headers: headers
      end

      it 'ステータスコード404を返すこと' do
        expect(response).to have_http_status(404)
      end

      it 'エラーメッセージを返すこと' do
        json = JSON.parse(response.body)
        expect(json['message']).to eq('ユーザーを取得出来ません')
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
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
=end
