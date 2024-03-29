require 'rails_helper'

# api/v1/usersコントローラのテスト
RSpec.describe "Api::V1::Users", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  # 1.1
  let(:auth_headers) { user.create_new_auth_token }

  describe 'GET /api/v1/users' do
    before do
      # 1.2 userを10個作成
      create_list(:user, 10)
      # getメソッドにヘッダー情報を追加して、indexアクションを実行
      get api_v1_users_path, headers: auth_headers
    end

    # 3
    it '200 OKを返す' do
      expect(response).to have_http_status(200)
    end

    # 2
    it '正しい数のユーザーデータがJSONで返る' do
      # json = JSON.parse(response.body)と同じ意味。JSON形式をRubyのハッシュに変換。
      json = response.parsed_body
      # json['users']には、ユーザーの配列が格納されている
      expect(json['users'].length).to eq 10
      # テストの前処理で作成した10のユーザーに加え、認証用に作成したユーザーがカウントされているので11に
      expect(json['total_users']).to eq 11
    end
  end

  # showアクションのテスト
  describe 'GET /api/v1/users/:id' do
    context '存在するユーザーのIDを指定した場合' do
      before { get api_v1_user_path(user.id) }

      it '200 OKを返す' do
        expect(response).to have_http_status(200)
      end

      it '指定したユーザーの情報が取得できる' do
        json = response.parsed_body
        expect(json['name']).to eq user.name
        expect(json['email']).to eq user.email
      end
    end

    context '存在しないユーザーのIDを指定した場合' do
      it 'エラーが発生する' do
        # 4
        expect { get api_v1_user_path(0) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  # following:フォロー中のユーザー取得のテスト
  describe 'GET /api/v1/users/:id/following' do
    before do
      user.follow(other_user)
      # getメソッドにヘッダー情報を追加して、followingアクションを実行
      get following_api_v1_user_path(user.id), headers: auth_headers
    end

    it '200 OKを返す' do
      expect(response).to have_http_status(200)
    end

    it 'フォロー中のユーザーが取得できる' do
      json = response.parsed_body
      expect(json['following'].length).to eq 1
      expect(json['following'][0]['id']).to eq other_user.id
    end
  end

  # followers:フォロワー取得のテスト
  describe 'GET /api/v1/users/:id/followers' do
    before do
      other_user.follow(user)
      # getメソッドにヘッダー情報を追加して、followersアクションを実行
      get followers_api_v1_user_path(user.id), headers: auth_headers
    end

    it '200 OKを返す' do
      expect(response).to have_http_status(200)
    end

    it 'フォロワーが取得できる' do
      json = response.parsed_body
      expect(json['followers'].length).to eq 1
      expect(json['followers'][0]['id']).to eq other_user.id
    end
  end

  # is_following:フォロー確認のテスト
  describe 'GET /api/v1/users/:id/is_following' do
    before do
      user.follow(other_user)
      # getメソッドにヘッダー情報を追加して、is_followingアクションを実行
      get is_following_api_v1_user_path(user.id), params: { other_id: other_user.id }, headers: auth_headers
    end

    it '200 OKを返す' do
      expect(response).to have_http_status(200)
    end

    it 'フォロー確認が取得できる' do
      json = response.parsed_body
      expect(json['is_following']).to be true
    end
  end

  # total_likes_countアクションのテスト
  describe 'GET /api/v1/users/:id/total_likes_count' do
    context '存在するユーザーのIDを指定した場合' do
      before do
        # いくつかのいいねを作成する
        create_list(:like, 5, user: user)
        get "/api/v1/users/#{user.id}/total_likes_count", headers: auth_headers
      end

      it '200 OKを返す' do
        expect(response).to have_http_status(200)
      end

      it '正しい総いいね数を返すこと' do
        json = response.parsed_body
        expect(json['total_liked_counts']).to eq 5
      end
    end

    context '存在しないユーザーのIDを指定した場合' do
      # idが0を指定
      before { get "/api/v1/users/0/total_likes_count", headers: auth_headers }

      it '404 Not Foundを返す' do
        expect(response).to have_http_status(404)
      end
    end
  end

  # all_likesアクションのテスト
  describe 'GET /api/v1/users/:id/all_likes' do
    let(:post1) { create(:post) }
    let(:post2) { create(:post) }

    before do
      user.likes.create(post: post1)
      user.likes.create(post: post2)
      get "/api/v1/users/#{user.id}/all_likes", headers: auth_headers
    end

    context '存在するユーザーのIDを指定した場合' do
      it '200 OKを返す' do
        expect(response).to have_http_status(200)
      end

      it 'ユーザーがいいねした投稿のリストが返されること' do
        json = response.parsed_body
        expect(json['liked_posts'].length).to eq 2
      end

      it '正しいいいねの総数が返されること' do
        json = response.parsed_body
        expect(json['total_liked_counts']).to eq 2
      end
    end

    context '存在しないユーザーのIDを指定した場合' do
      before { get "/api/v1/users/0/all_likes", headers: auth_headers }

      it '404 Not Foundを返す' do
        expect(response).to have_http_status(404)
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
auth_headers
変数。この変数は、ユーザーの認証に関する情報を格納します。後続のリクエストで使用されるヘッダー情報を提供します。
------------------------------------------------------------------------------------------------
user
変数。テスト中に使用されるユーザーオブジェクトを表します。RSpecのテストコンテキスト内で作成されます。
------------------------------------------------------------------------------------------------
create_new_auth_token
Devise Token Authのメソッド。ユーザーオブジェクトに関連する認証トークンを生成し、それを含む認証ヘッダー情報を返
します。

================================================================================================
1.2
create_list
RSpecのメソッドです。指定されたファクトリで指定された数のオブジェクトを作成します。引数:user, 10は、:userという
ファクトリを使用して10個のユーザーオブジェクトを作成することを指定しています。
------------------------------------------------------------------------------------------------
get
RSpecのリクエストスペックにおけるメソッド。RSpecでは、HTTPリクエストをシミュレートするために様々なメソッドが提供
されています。
getメソッドは、指定したエンドポイントにGETリクエストを送信するために使用されます。
このメソッドはRSpecのDSL(Domain Specific Language)によって提供され、RSpecのテストコンテキスト内でのみ使用す
ることができます。
挙動は、指定したエンドポイントに対して実際にHTTPリクエストを送信せずに、そのリクエストをシミュレートします。これに
より、コントローラーのアクションが正しく動作し、適切なレスポンスが返されるかどうかをテストすることができます。
------------------------------------------------------------------------------------------------
api_v1_users_path
Railsのルーティングヘルパーメソッドです。このメソッドはRailsのルーティングシステムによって提供され、指定したルート
名に対応するURLパスを生成するために使用されます。
api_v1_users_pathは、/api/v1/usersというパスを生成します。
------------------------------------------------------------------------------------------------
headers: auth_headers
これはRSpecのgetメソッドの引数として使用されるハッシュの一部です。headersはハッシュのキーであり、
: auth_headersはその値です。この設定により、リクエストに含まれるヘッダーにauth_headersの内容が追加されます。

================================================================================================
2
json = response.parsed_body

response
RSpecのリクエストスペックで使用される、リクエストへのレスポンスを表すオブジェクトであり、HTTPステータスコードやレ
スポンスヘッダー、レスポンスボディなどの情報を提供します。
------------------------------------------------------------------------------------------------
parsed_body
メソッド。HTTPレスポンスのボディを解析し、適切なRubyのオブジェクト（ハッシュ、配列など）のデータ形式で取得するため
に使用されます。具体的には、response オブジェクトに含まれるレスポンスのボディを自動的にパースして、Rubyのオブジェ
クトに変換します。
------------------------------------------------------------------------------------------------
*json = JSON.parse(response.body)と同じだが、こちらはrubocopが警告を出す
JSON
Rubyの標準ライブラリであり、JSONデータを操作するためのメソッドやクラスが提供されています。
parse
JSONライブラリのメソッドです。JSON.parseは、JSON形式の文字列を受け取り、その文字列を解析してRubyのハッシュや配
列などのオブジェクトに変換します。この場合、response.bodyに格納されているJSON形式の文字列を解析し、json変数に格
納します。
body
responseオブジェクト自体のプロパティです。response.bodyは、HTTPリクエストに対するレスポンスのボディ部分を表しま
す。この場合、HTTPリクエストのレスポンスボディがJSON形式のデータであることを想定しています。

================================================================================================
3
have_http_status
RSpec Railsライブラリのマッチャーの一つです。
HTTPレスポンスのステータスコードを検証するために使用されます。具体的には、指定したステータスコードと実際のレスポン
スのステータスコードが一致していることを確認します。

================================================================================================
4
このテストは、存在しないユーザーID（この場合は0）を指定してGETリクエストを送った時に、
ActiveRecord::RecordNotFound例外が発生することを期待しています。つまり、存在しないユーザーの詳細ページにアクセ
スしようとしたときに、適切なエラーが発生することを確認するテストです。
------------------------------------------------------------------------------------------------
get api_v1_user_path(0)
GETリクエストを/api/v1/users/0に対して行います。
------------------------------------------------------------------------------------------------
raise_error
RSpecのマッチャで、テスト中に特定のエラーが発生することを期待する時に使用します。引数は期待するエラークラスを指定し
ます。
------------------------------------------------------------------------------------------------
ActiveRecord::RecordNotFound
Railsがデータベースからレコードを見つけられなかったときに発生する例外です。ここでは、存在しないユーザーID（この場
合は0）を指定してGETリクエストを送った時にこの例外が発生することを期待しています。
=end
