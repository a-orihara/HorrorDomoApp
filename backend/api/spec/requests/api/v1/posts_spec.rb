# backend/api/spec/requests/api/v1/posts_spec.rb
require 'rails_helper'

# テスト名："Api::V1::Posts"
RSpec.describe "Api::V1::Posts", type: :request do
  # テストユーザーを作成
  let(:user) { create(:user) }
  # テスト投稿を作成
  # let(:post)だと、postが被っているのが原因なのか、createアクションのテストでエラーになる
  let(:test_post) { create(:post, user: user) }
  # 認証用のヘッダー情報を取得。request_login_userはspec/support/test_macros.rbで定義
  # 戻り値はトークンを設定したheaderハッシュ、それをauth_headersに代入
  let(:auth_headers) { request_login_user(user) }

  #  1 indexアクションのテスト 投稿の数が正しいかを確認します。
  describe 'GET /api/v1/posts' do
    # 2
    before do
      create_list(:post, 10, user: user)
      get api_v1_posts_path, headers: auth_headers
    end

    it '200 OKを返すこと' do
      expect(response).to have_http_status(200)
    end

    it '正しい数の投稿データがJSONとして返ること' do
      json = response.parsed_body
      expect(json['data'].length).to eq 10
    end
  end

  # 3 createアクションのテスト
  describe 'POST /api/v1/posts' do
    context '有効なパラメータの場合' do
      it 'タイトルと内容が正しく設定されている場合、201 Createdを返すこと' do
        post api_v1_posts_path, params: { post: { content: 'テスト投稿', title: 'テストタイトル' } }, headers: auth_headers
        expect(response).to have_http_status(201)
      end

      it 'タイトルが20文字以下であること' do
        post api_v1_posts_path, params: { post: { content: 'テスト投稿', title: 'a' * 20 } }, headers: auth_headers
        expect(response).to have_http_status(201)
      end
    end

    context '無効なパラメータの場合' do
      it '422 Unprocessable Entityを返すこと' do
        post api_v1_posts_path, params: { post: { content: '' } }, headers: auth_headers
        expect(response).to have_http_status(422)
      end

      it 'タイトルが空の場合、422 Unprocessable Entityを返すこと' do
        post api_v1_posts_path, params: { post: { content: 'テスト投稿', title: '' } }, headers: auth_headers
        expect(response).to have_http_status(422)
      end

      it 'タイトルが21文字以上の場合、422 Unprocessable Entityを返すこと' do
        post api_v1_posts_path, params: { post: { content: 'テスト投稿', title: 'a' * 21 } }, headers: auth_headers
        expect(response).to have_http_status(422)
      end
    end

    context 'サインインしていないユーザーの場合' do
      it '401 Unauthorizedを返すこと' do
        # headers:なし
        post api_v1_posts_path, params: { post: { content: 'テスト投稿' } }
        expect(response).to have_http_status(401)
      end
    end
  end

  # 4 destroyアクションのテスト
  describe 'DELETE /api/v1/posts/:id' do
    context 'ユーザーが投稿者の場合' do
      it '200 OKを返すこと' do
        # delete api_v1_post_path(post.id), headers: auth_headers
        delete api_v1_post_path(test_post.id), headers: auth_headers
        expect(response).to have_http_status(200)
      end
    end

    context 'ユーザーが投稿者でない場合' do
      let(:other_user) { create(:user) }
      let(:other_auth_headers) { request_login_user(other_user) }

      it '404 Not Foundを返すこと' do
        # delete api_v1_post_path(post.id), headers: other_auth_headers
        delete api_v1_post_path(test_post.id), headers: other_auth_headers
        expect(response).to have_http_status(404)
      end
    end

    context 'サインインしていないユーザーの場合' do
      it '401 Unauthorizedを返すこと' do
        delete api_v1_post_path(test_post.id)
        expect(response).to have_http_status(401)
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
GET /api/v1/postsでは、テスト投稿を10件作成した上でリクエストを送り、正常にレスポンスが返ってきているか、投稿の
数が正しいかを確認します。
================================================================================================
2
create_list
RSpecのメソッドです。指定されたファクトリで指定された数のオブジェクトを作成します。
:post：ファクトリーの名前を指定します。この場合は:postという名前のファクトリーを使用してレコードを作成します。
10：作成するレコードの数を指定します。この場合は10個のレコードが作成されます。
user: user：オプションのハッシュ形式の引数です。ファクトリー(:post)に渡す属性を指定します。user: userとすること
で、作成される各レコードのuser属性に指定されたuserオブジェクトが関連付けられます。
したがって、create_list(:post, 10, user: user)は、postファクトリーを使用して10個のPostレコードを作成し、各
レコードに指定されたuserオブジェクトを関連付けることを意味します。
================================================================================================
3
createアクションによって新しい投稿が作成されることをテストしています。
POST /api/v1/postsでは、有効なパラメータ（ここではcontentが空でないこと）を送った場合と無効なパラメータ（ここ
ではcontentが空であること）を送った場合でレスポンスのステータスコードが正しいか確認します。
================================================================================================
4
DELETE /api/v1/posts/:idでは、ログインユーザーが投稿者である場合と他のユーザーである場合でレスポンスのステータ
スコードが正しいか確認します。
=end
