# backend/api/spec/requests/api/v1/posts_spec.rb
# require 'rails_helper'
require 'rails_helper'

# テスト名："Api::V1::Posts"
RSpec.describe "Api::V1::Posts", type: :request do
  # テストユーザーを作成
  let(:user) { create(:user) }
  # テスト投稿を作成
  # let(:post)だと、postが被っているのが原因なのか、createアクションのテストでエラーになる
  let(:test_post) { create(:post, user: user) }
  # 認証用のヘッダー情報を取得。戻り値はトークンを設定したheaderハッシュ、それをauth_headersに代入
  let(:auth_headers) { create_auth_token_headers(user) }

  #  1 indexアクションのテスト 投稿の数が正しいかを確認します。
  describe 'GET /api/v1/posts' do
    before do
      # 2.1
      create_list(:post, 10, user: user)
      get api_v1_posts_path, headers: auth_headers
    end

    it '200 OKを返す' do
      expect(response).to have_http_status(200)
    end

    # 2.2
    it '正しい数の投稿データがJSONで返る' do
      json = response.parsed_body
      expect(json).to include('status' => '200', 'total_posts' => 10)
    end
  end

  # 3 createアクションのテスト
  describe 'POST /api/v1/posts' do
    let(:post_params) { { post: { content: 'テスト投稿', title: 'テストタイトル' } } }

    context '有効なパラメータの場合' do
      it '201 Createdを返す' do
        post api_v1_posts_path, params: post_params, headers: auth_headers
        expect(response).to have_http_status(201)
      end
    end

    context '無効なパラメータの場合' do
      it '422 Unprocessable Entityを返す' do
        post api_v1_posts_path, params: { post: { content: '' } }, headers: auth_headers
        expect(response).to have_http_status(422)
      end
    end

    context 'サインインしていない場合' do
      it '401 Unauthorizedを返す' do
        # headers:なし
        post api_v1_posts_path, params: { post: { content: 'テスト投稿' } }
        expect(response).to have_http_status(401)
      end
    end
  end

  # 4 destroyアクションのテスト
  describe 'DELETE /api/v1/posts/:id' do
    context 'ユーザーが投稿者本人の場合' do
      it '200 OKを返す' do
        delete api_v1_post_path(test_post.id), headers: auth_headers
        expect(response).to have_http_status(200)
      end
    end

    context 'ユーザーが投稿者本人でない場合' do
      let(:other_user) { create(:user) }
      let(:other_auth_headers) { create_auth_token_headers(other_user) }

      it '404 Not Foundを返す' do
        delete api_v1_post_path(test_post.id), headers: other_auth_headers
        expect(response).to have_http_status(404)
      end
    end

    context 'サインインしていない場合' do
      it '401 Unauthorizedを返す' do
        delete api_v1_post_path(test_post.id)
        expect(response).to have_http_status(401)
      end
    end
  end

  # showアクションのテスト
  describe 'GET /api/v1/posts/:id' do
    context '投稿が存在する場合' do
      before { get api_v1_post_path(test_post.id), headers: auth_headers }

      it '200 OKを返す' do
        expect(response).to have_http_status(200)
      end

      it 'リクエストした投稿の情報を正しく返す' do
        # json = JSON.parse(response.body)だとRubocopの警告が出るので、response.parsed_bodyを使う
        json = response.parsed_body
        expect(json['data']).to include('id' => test_post.id, 'content' => test_post.content)
      end
    end

    context '投稿が存在しない場合' do
      it '404 NotFoundを返す' do
        get api_v1_post_path(test_post.id + 1), headers: auth_headers
        expect(response).to have_http_status(404)
      end
    end
  end

  describe 'GET /api/v1/posts/search' do
    let(:post1) { create(:post, title: 'Hello', user: user) }
    let(:post2) { create(:post, title: 'World', user: user) }
    let(:post3) { create(:post, title: 'Hello World', user: user) }

    context '検索クエリが一致する場合' do
      # 5
      before do
        post1
        post2
        post3
        get '/api/v1/posts/search', params: { query: 'Hello' }, headers: auth_headers
      end

      it '200 OKを返す' do
        expect(response).to have_http_status(200)
      end

      it '一致する投稿を返す' do
        json = response.parsed_body
        expect(json['posts'].length).to eq(2)
      end
    end

    context '検索クエリが一致しない場合' do
      before { get '/api/v1/posts/search', params: { query: 'NotPresent' }, headers: auth_headers }

      it '200 OKと空の配列を返す' do
        expect(response).to have_http_status(200)
        json = response.parsed_body
        expect(json['posts']).to be_empty
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
2.1
create_list
RSpecのメソッドです。指定されたファクトリで指定された数のオブジェクトを作成します。
:post：ファクトリーの名前を指定します。この場合は:postという名前のファクトリーを使用してレコードを作成します。
10：作成するレコードの数を指定します。この場合は10個のレコードが作成されます。
user: user：オプションのハッシュ形式の引数です。ファクトリー(:post)に渡す属性を指定します。user: userとすること
で、作成される各レコードのuser属性に指定されたuserオブジェクトが関連付けられます。
したがって、create_list(:post, 10, user: user)は、postファクトリーを使用して10個のPostレコードを作成し、各
レコードに指定されたuserオブジェクトを関連付けることを意味します。

================================================================================================
2.2
下記だとエラー。
it '正しい数の投稿データがJSONとして返ること' do
  json = response.parsed_body
  expect(json['data'].length).to eq 10
end
JSONレスポンスに 'data' キーが存在することを期待していた。しかし、実際のレスポンスには 'data' キーがなく、代わり
に 'status' と 'total_posts' が含まれていた。この不一致がエラーの原因だった。

================================================================================================
3
createアクションによって新しい投稿が作成されることをテストしています。
POST /api/v1/postsでは、有効なパラメータ（ここではcontentが空でないこと）を送った場合と無効なパラメータ（ここ
ではcontentが空であること）を送った場合でレスポンスのステータスコードが正しいか確認します。

================================================================================================
4
DELETE /api/v1/posts/:idでは、ログインユーザーが投稿者本人である場合と他のユーザーである場合でレスポンスのステ
ータスコードが正しいか確認します。

================================================================================================
5
. **なぜ `post1`, `post2`, `post3` は `before` ブロックの中にあるのですか？遅延評価と関係がある？
- 遅延評価**： はい、遅延評価に関係しています。RSpecでは、`let`は遅延評価されます。つまり、参照するまでオブジェク
トは実際に生成されません。明示的に `let` 変数を呼び出さないと、オブジェクトは生成されません。
- 強制作成**： post1`、`post2`、`post3` を `before` ブロックに追加することで、テストを実行する前にこれらの投
稿が作成されるようにします。
- テストコンテキスト**： 投稿が作成されていることを確認することで、テストの適切なコンテキストが設定されます。これら
の投稿がなければ、検索クエリは当然ゼロマッチを返し、テストの失敗につながります。
------------------------------------------------------------------------------------------------
. **before`ブロックの動作は？
- 各例の前に実行されます： before`ブロックは、それが定義されているコンテキスト内で、それぞれの例の前に実行されます
。これにより、指定したセットアップがテストごとに新しくなります。
- 実行順序**： before`ブロック内の処理は、記述された順番に実行されます。あなたの場合、まず `post1`、`post2`、
`post3` を作成し、次に `GET` リクエストを実行します。
- テスト環境のセットアップ テスト環境を設定し、テストを実行するための前提条件がすべて満たされていることを確認します。
------------------------------------------------------------------------------------------------
#### 理由
- 遅延評価は、結果が実際に必要になるまでコードの実行を延期する概念です。RSpec のテストのコンテキストでは、`post1`
, `post2`, `post3` に対して `let` を使用すると、コード内で呼び出されるまでは `post1`, `post2`, `post3` が
作成されないことになります。そのため、それらを `before` ブロックに追加することで、テストに必要な状態を確保しながら
強制的に作成することができます。
=end
