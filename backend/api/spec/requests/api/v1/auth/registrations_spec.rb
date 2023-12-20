require 'rails_helper'

# a
RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  # POST /api/v1/auth api/v1/auth/registrations#create サインアップ（新規ユーザー登録）のテスト
  describe 'POST /api/v1/auth' do
    context '有効なパラメータが与えられた場合' do
      # letメソッドで定義した変数は、このcontext内のit内でのみ有効。valid_attributesという変数を定義している。
      let(:valid_attributes) do
        {
          name: 'Test User',
          # 6.3
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password',
          # 6.1, 6.2
          confirm_success_url: "http://localhost:3001/signin"
        }
      end

      it '200 ステータスコードを返すこと' do
        post '/api/v1/auth', params: valid_attributes
        # :success は 200 を表す
        expect(response).to have_http_status(:success)
      end

      it '成功メッセージを返すこと' do
        post '/api/v1/auth', params: valid_attributes
        expect(response.body).to include(I18n.t('devise.registrations.signed_up'))
      end

      it '新しいユーザーが作成されること' do
        expect {
          post '/api/v1/auth', params: valid_attributes
        }.to change(User, :count).by(1)
      end
    end

    context '無効なパラメータが与えられた場合' do
      # invalid_attributesという変数を定義している。
      let(:invalid_attributes) do
        {
          name: '',
          email: 'test',
          password: 'pass',
          password_confirmation: 'word'
        }
      end

      # 1
      it '422 ステータスコードを返すこと' do
        post '/api/v1/auth', params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラーメッセージを返すこと' do
        post '/api/v1/auth', params: invalid_attributes
        expect(response.body).to include('errors')
      end

      it '新しいユーザーが作成されないこと' do
        expect {
          post '/api/v1/auth', params: invalid_attributes
        }.not_to change(User, :count)
      end
    end
  end

# ================================================================================================
  # PUT /api/v1/auth api/v1/auth/registrations#update ユーザー情報の更新のテスト
  describe 'PUT /api/v1/auth' do
    let(:user) { create(:user) }
    # 2
    let(:valid_attributes) { { name: 'Updated User' }.to_json }
    let(:invalid_attributes) { { name: '' }.to_json }
    # 3 リクエストヘッダーに Content-Type を設定
    let(:headers) { { 'CONTENT_TYPE' => 'application/json' } }

    # サインイン状態でのupdateのテスト
    context 'ユーザーがログインしている場合' do
      # beforeブロックは定義されたcontext 'ユーザーがログインしている場合'内でのみ有効
      before do
        # 4.1 POST  /api/v1/auth/sign_in  api/v1/auth/sessions#create サインイン
        post api_v1_user_session_path, params: { email: user.email, password: 'testtest' }
      end

      context '有効なパラメータが与えられた場合' do
        it '成功ステータスを返すこと' do
          # 4.2 有効なnameでupdate response.headersは、直前のpost api_v1_user_session_pathに対するレスポンスヘッダー。
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
          # 4.3 ステータスコードが200（成功）であることを期待
          expect(response).to have_http_status(:success)
        end

        it '成功メッセージを返すこと' do
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
          expect(response.body).to include(I18n.t('devise.registrations.updated'))
        end

        it 'ユーザー情報が更新されること' do
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
          puts "テスト後のResponse: #{JSON.parse(valid_attributes)['name']}"
          # 5
          expect { user.reload }.to change(user, :name).from(user.name).to(JSON.parse(valid_attributes)['name'])
        end
      end

      context '無効なパラメータが与えられた場合' do
        it 'ステータス422を返すこと' do
          put '/api/v1/auth', params: invalid_attributes, headers: headers.merge(response.headers)
          # :unprocessable_entity はステータスコード 422
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'エラーメッセージを返すこと' do
          put '/api/v1/auth', params: invalid_attributes, headers: headers.merge(response.headers)
          expect(response.body).to include('errors')
        end

        it 'ユーザー情報が更新されないこと' do
          put '/api/v1/auth', params: invalid_attributes, headers: headers.merge(response.headers)
          user.reload
          expect(user.name).not_to eq(JSON.parse(invalid_attributes)[:name])
        end
      end
    end
# ------------------------------------------------------------------------------------------------
    # あとで修正予定
    # context 'ユーザーがログインしていない場合' do
    #   it 'ステータス401を返すこと' do
    #     put '/api/v1/auth', params: valid_attributes, headers: headers
    #     expect(response).to have_http_status(:unauthorized)
    #   end
    # end
  end
end
=begin
@          @@          @@          @@          @@          @@          @@          @@          @
a
RSpec.describe
RSpecのテストスイートを定義するためのメソッドです。引数にはテストスイートの名前を指定します。
通常、テスト対象のクラスやモジュールの名前を使用します。
------------------------------------------------------------------------------------------------
Api::V1::Auth::Registrations'：テストスイートの名前です。
------------------------------------------------------------------------------------------------
type: :request
テストスイートのタイプを指定しています。このテストスイートはリクエスト（HTTPリクエスト）に関連するテストを実行する
ためのものです。
各タイプは、異なるテストコンテキストやヘルパーメソッドを提供します。
------------------------------------------------------------------------------------------------
`api/v1/auth/registrations_spec.rb`ファイルは新規ユーザー登録（サインアップ）をテストしており、既存ユーザー
のログイン処理（`login_user`や`create_auth_token_headers`メソッド）を使う必要はありません。そのため、このテストファ
イルに`login_user`や`create_auth_token_headers`を使用する箇所はありません。

================================================================================================
1
ステータスコード 422（"Unprocessable Entity"）は、クライアントからの有効なリクエストがサーバーによって理解でき
ない場合に使用されるHTTPレスポンスステータスコード。これは、リクエストの形式が不正、必要なフィールドが欠けている、
バリデーションエラーが発生したといった状況で利用される。
クライアントエラーを示し、エラーメッセージや詳細情報を含めることでクライアントがエラーを理解し修正を行うのに役立つ。
例えば、ユーザー登録時のフィールド不足やパスワード不一致などで返されることがある。

================================================================================================
2
to_json
Ruby の標準ライブラリである JSON ライブラリのメソッドです。to_json メソッドは、オブジェクトを JSON 形式の文字
列に変換するためのメソッドです。
{ name: 'Updated User' }.to_json の戻り値は、{ "name": "Updated User" } という JSON 形式の文字列です。
to_json メソッドは、オブジェクトを JSON 形式に変換し、その結果として JSON 形式の文字列を返します。

================================================================================================
3
{ 'CONTENT_TYPE' => 'application/json' }
意図は、リクエストのヘッダーに Content-Type を設定することです。
CONTENT_TYPE' => 'application/json' というヘッダーは、リクエストが JSON 形式のデータを含んでいることを示しま
す。Rails のリクエスト処理では、Content-Type ヘッダーを使用してリクエストのデータ形式を判断します。この場合、
application/json という値を指定することで、リクエストの本文が JSON 形式のデータであることを示しています。
この設定により、リクエストのヘッダーが正しく設定され、サーバー側で正しくデータの解釈が行われるようになります。

================================================================================================
4.1
post api_v1_user_session_path, params: { email: user.email, password: 'testtest' }
このリクエストに対するレスポンスは、以降context 'ユーザーがログインしている場合' do以下のテストでアクセス可能。
------------------------------------------------------------------------------------------------
RSpecのリクエスト仕様では、HTTPリクエスト（ここでの`post`リクエストのような）を行うと、RSpecはそのリクエストか
らのレスポンスを`response`オブジェクトに取り込みます。この `response` オブジェクトは、リクエストが行われた `it`
ブロック全体を通してアクセス可能です。
------------------------------------------------------------------------------------------------
そのため、テストが有効な属性を持つ `post` リクエストを実行すると、サーバはこのリクエストを処理してレスポンスを返し
ます。このレスポンスにはステータスコード、ヘッダー、ボディが含まれます。response` オブジェクトはこの情報を取得し、
後でテストブロックの中でその情報を調べることができます。

================================================================================================
4.2
response.headersは、直前のpost api_v1_user_session_pathに対するレスポンスヘッダー。
------------------------------------------------------------------------------------------------
merge
ハッシュ（Hash）オブジェクトのメソッド。引数として渡された別のハッシュを自身に統合し、新しいハッシュを作成します。
具体的には、headers.merge(response.headers) は、headers ハッシュと response.headers ハッシュを統合して、
新しい一つのハッシュを作成します。結果として得られるハッシュには、両方のハッシュのキーと値が含まれます。
{
  'CONTENT_TYPE' => 'application/json',
  'uid' => response.header['uid'],
  'access-token' => response.header['access-token'],
  'client' => response.header['client']
}
例
hash1 = { 'key1' => 'value1', 'key2' => 'value2' }
hash2 = { 'key2' => 'updated_value2', 'key3' => 'value3' }
merged_hash = hash1.merge(hash2)
puts merged_hash
# 出力: {"key1"=>"value1", "key2"=>"updated_value2", "key3"=>"value3"}
------------------------------------------------------------------------------------------------
`response.headers`は、Railsのテスト環境において、リクエストに対するレスポンスのヘッダー情報を表します。
. `response`オブジェクトは、RSpecにおける最後に発行されたリクエストのレスポンス情報を持っています。これには、レ
スポンスのステータスコードやボディの内容、ヘッダー情報などが含まれます。
. `response.headers`とすることで、そのレスポンスのヘッダー情報を取得できます。ヘッダーには、リダイレクト先URL
やセットされたクッキー、レスポンスのコンテンツタイプなどの情報が含まれます。
.レスポンスヘッダーの中身に、このuserの認証情報（access-token, client, uid）が含まれています。
. ここでのテストでは、ユーザーがログインした際のレスポンスヘッダーから、認証情報（access-token, client, uid）
を取得し、それを以降のリクエストのヘッダー情報に含めることで、認証済みのリクエストを模擬しています。
. なので、`response.headers`は、直前の`post api_v1_user_session_path`でのレスポンスヘッダー（つまりログ
イン後のヘッダー情報）を表しています。

================================================================================================
4.3
have_http_status(:success)で表される'success'は、HTTPステータスコード200を意味している。
テスト後のresponseオブジェクトにおいて、このステータスコードは`@status`属性に格納されている。
`@status=200`でリクエストが成功。

================================================================================================
5
expect { user.reload }.to change(user, :name).from(user.name).to(JSON.parse(valid_attributes)['name'])
------------------------------------------------------------------------------------------------
to
expectメソッドのチェーンメソッドとして使われ、期待値と実際の値を比較するために使用されます。
toの後には期待する結果を表現するマッチャーが続きます。
------------------------------------------------------------------------------------------------
user.reload
Active Recordライブラリのメソッド。テストDBからオブジェクトの最新の情報を再読み込みするために使用。
データベースからユーザーオブジェクトを再度読み込む操作です。これにより、最新のデータベースの状態を取得できます。
テスト中にput '/api/v1/auth'でユーザー情報を更新した後、user.reloadを使用することで、更新されたユーザーオブジ
ェクトの最新の情報を改めて取得し直し、その情報が期待どおりに変更されているかを確認します。
------------------------------------------------------------------------------------------------
change
- RSpecのマッチャ（matcher）で、オブジェクトの特定の属性の変更を検証するために使用されます。引数としてオブジェク
トと属性の二つを指定します。change(user, :name)となっており、userはオブジェクトを表し、:nameは属性を指定。
- テスト対象の変更を指定する。この場合、userオブジェクトのnameプロパティが変更されることをチェックしている。
------------------------------------------------------------------------------------------------
from
RSpecのマッチャの一部であり、変更前の値を指定します。この場合、user.name の現在の値（更新前の値）を指定しています。
from はメソッドではなく、RSpecの構文要素です。
------------------------------------------------------------------------------------------------
to
- RSpecのマッチャの一部であり、変更後の値を指定します。この場合、valid_attributes を JSONからハッシュに変換し
たータの name プロパティの値を指定しています。to はメソッドではなく、RSpecの構文要素です。
- 「userオブジェクトのname属性が変更されることを期待し、変更前の値がuser.nameであり、変更後の値が
`JSON.parse(valid_attributes)['name']`である」という意味になります。
------------------------------------------------------------------------------------------------
JSON.parse(valid_attributes)['name']
. `[JSON.parse(valid_attributes)['name']]`の部分は、`valid_attributes`というJSON形式の文字列をRubyのハ
ッシュに変換し、そのハッシュから`name`キーに対応する値を取得するという意味である。
- `JSON.parse`はJSON形式の文字列をハッシュに変換するメソッドである。逆に、ハッシュをJSON形式に変換するのは、
`to_json`メソッドである。
- [JSON.parse(valid_attributes)['name']]の中身は`Updated User`
- `valid_attributes`はJSON形式の文字列で、例えば`'{"name": "Updated User"}'`のような形式を取る。
- `JSON.parse(valid_attributes)`はこの文字列をRubyのハッシュに変換する。例えば、
`{"name" => "Updated User"}`のようなハッシュが生成される。
- このハッシュから`['name']`を使用して`name`キーに対応する値、この場合は`"Updated User"`を取得する。
`JSON.parse(valid_attributes)['name']`は、`valid_attributes`というJSON文字列から`name`キーの値を取り出
す処理である。

================================================================================================
6.1
RSpecテストが成功する仕組みに関して、特にDeviseの`confirmable`モジュールとメール確認のテストの場合は、実際にメ
ールを送信するわけではありません。代わりに、DeviseとRSpecはテスト環境でメールの送信をシミュレートします。これによ
り、実際のメールサーバーや外部サービスへの依存なしに、メール送信のロジックをテストできます。
### テスト環境でのメール送信のシミュレーション
. **ActionMailerの設定**:
- Railsのテスト環境では、`ActionMailer::Base.delivery_method`は通常`:test`に設定されます。これにより、メ
ールは実際には送信されず、送信されたメールの情報が`ActionMailer::Base.deliveries`配列に格納されます。
------------------------------------------------------------------------------------------------
. **Deviseの確認メール**:
- ユーザーが登録されると、Deviseは`confirmable`モジュールを介して確認メールを送信します。しかし、テスト環境では
このメールは実際には送信されず、代わりに`ActionMailer::Base.deliveries`配列に追加されます。
------------------------------------------------------------------------------------------------
. **テストでの確認**:
- テストでは、`ActionMailer::Base.deliveries`配列を確認することで、メールが「送信」されたかどうかを検証できま
す。また、メールの内容（例えば確認トークンなど）を抽出して、さらなるテストステップ（例えばユーザー確認のプロセスなど
）に使用することもできます。
------------------------------------------------------------------------------------------------
. **テスト中のメール内容の検証**:
- メールの内容（例えば、リンクやメッセージなど）をテストすることで、アプリケーションが期待通りの動作をしていること
を確認できます。

================================================================================================
6.2
. **ActionMailer::Base.delivery_methodとは？**
- `ActionMailer::Base.delivery_method`は、RailsのActionMailerでメールをどのように送信するかを指定する設
定です。Railsのテスト環境では、通常この設定は`:test`に設定されています。この設定により、実際にメールを送信する代
わりに、送信されるメールの情報が`ActionMailer::Base.deliveries`配列に格納されます。これにより、テスト中に実際
にメールを送信することなく、メール送信のプロセスをシミュレートすることができます。
------------------------------------------------------------------------------------------------
. **メール内のリンクをクリックしたことになるのか？**
- テスト環境では、実際にメールを送信したり、メール内のリンクをクリックしたりすることはありません。代わりに、メール
送信のプロセスがシミュレートされ、送信されたメールの内容は`ActionMailer::Base.deliveries`配列に格納されます。
テスト中にこの配列を確認し、メールの内容（例えば、確認トークンやリンクなど）を検証することができます。
------------------------------------------------------------------------------------------------
. **confirm_success_urlに実際にアクセスしているのか？**
- `confirm_success_url`は、ユーザーがメール内の確認リンクをクリックした後にリダイレクトされるURLを指定するため
に使用されます。テスト環境では、このURLに実際にアクセスすることはありませんが、URLを指定することは重要です。なぜな
ら、DeviseがこのURLを使用してメール内の確認リンクを生成するためです。テストでは、このリンクが正しく生成されている
かを確認することが目的です。
------------------------------------------------------------------------------------------------
要するに、RSpecテストでのメール送信は実際のメール送信プロセスをシミュレートするためのものであり、実際のメールサーバ
ーにメールを送信したり、リンクをクリックしたりすることはありません。これにより、実際のメール送信を伴わずに、メール関
連のロジックを効率的にテストすることができます。
------------------------------------------------------------------------------------------------
とりあえず実際でも、mail認証前でもsign upすれば200 ステータスコードや成功メッセージを返すし（認証前の）userも登
録される。

================================================================================================
6.3
ローカル環境でのRSpec実行とメール設定について
- ローカル環境でRSpecを実行する際、config/environments/test.rb においてメールの配送方法が :test に設定され
ています。これは、実際にメールを送信するのではなく、送信したメールをテスト用の配列に格納することを意味します。このた
め、実際のSMTPサーバー設定は使用されません。
ここに設定されている：  config.action_mailer.delivery_method = :test
------------------------------------------------------------------------------------------------
- ローカル環境でのRSpec実行が成功する理由は、実際にメールが送信されるわけではなく、メール送信のシミュレーションが行
われるためです。このシミュレーションでは、config/environments/test.rb の設定に従ってメールが「送信された」と見
なされ、実際のSMTPサーバーへの接続は発生しません。
=end
