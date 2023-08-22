require 'rails_helper'
require 'pp'

RSpec.describe 'Api::V1::HomePages', type: :request do
  let(:user) { create(:user) }
  let(:headers) { request_login_user(user) }
  let(:page) { 1 }
  let(:per_page) { 10 }

  describe 'GET /home' do
    context 'ユーザーが存在する場合' do
      before do
        # pp user
        # puts "ここpage:#{page}"
        # puts "ここper_page:#{per_page}"
        # pp user.feed
        binding.pry
        get api_v1_root_path, params: { user_id: user.id, page: page, per_page: per_page }, headers: headers
        puts "ここresponse.body:#{response.body}"
      end

      it 'ステータスコード200を返すこと' do
        expect(response).to have_http_status(200)
      end

      it '正しいフィード情報を返すこと' do
        # レスポンスのJSON形式を8種に変換し、 json 変数に格納
        json = JSON.parse(response.body)
        # puts "ここ#{json}"
        # json 変数内のデータの中に 'data' フィールドが存在することを確認
        # .to be_present は、データが存在することを確認するマッチャ
        expect(json['data']).to be_present
        expect(json['feed_total_count']).to eq(user.feed.count)
      end
    end

    context 'ユーザーが存在しない場合' do
      before do
        get api_v1_home_path, headers: headers
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
