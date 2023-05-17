require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  # POST /api/v1/auth api/v1/auth/registrations#create サインアップ（新規ユーザー登録）のテスト
  describe 'POST /api/v1/auth' do
    context '有効なパラメータが与えられた場合' do
      # letメソッドで定義した変数は、it内でのみ有効。valid_attributesという変数を定義している。
      let(:valid_attributes) do
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password'
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

    context 'ユーザーがログインしている場合' do
      before do
        # POST  /api/v1/auth/sign_in  api/v1/auth/sessions#create サインイン
        post api_v1_user_session_path, params: { email: user.email, password: 'testtest' }
      end

      context '有効なパラメータが与えられた場合' do
        it '成功ステータスを返すこと' do
          # 4
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
          expect(response).to have_http_status(:success)
        end

        it '成功メッセージを返すこと' do
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
          expect(response.body).to include(I18n.t('devise.registrations.updated'))
        end

        it 'ユーザー情報が更新されること' do
          put '/api/v1/auth', params: valid_attributes, headers: headers.merge(response.headers)
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
1
ステータスコード 422 は、HTTP のレスポンスステータスコードの一つです。"422 Unprocessable Entity" とも呼ばれ
ます。このステータスコードは、クライアントが送信したリクエストは有効であり、サーバーがリクエストの処理を行うことが
できるものの、サーバーがリクエストの内容を理解できない場合に使用されます。

具体的には、ステータスコード 422 は以下のような状況で利用されることがあります：
リクエストのパラメータが正しい形式でない場合
リクエストが必要なフィールドや条件を満たしていない場合
リクエストに対してバリデーションエラーが発生した場合

ステータスコード 422 は、クライアントにエラーメッセージやエラーの詳細情報を含めることができます。これにより、クライ
アントがエラーを理解し、必要な修正を行うことができます。
例えば、ユーザーの登録時に必要なフィールドが不足している場合や、パスワードの確認が一致しない場合には、ステータスコー
ド 422 が返されることがあります。
なお、ステータスコード 422 はクライアントエラーを示すステータスコードの一つであり、サーバー側の問題ではなくクライア
ント側の問題を示すものです。

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
4
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

================================================================================================
5
to
expectメソッドのチェーンメソッドとして使われ、期待値と実際の値を比較するために使用されます。
toの後には期待する結果を表現するマッチャーが続きます。
------------------------------------------------------------------------------------------------
user.reload
Active Recordライブラリのメソッド。DBからオブジェクトの最新の情報を再読み込みするために使用。
データベースからユーザーオブジェクトを再度読み込む操作です。これにより、最新のデータベースの状態を取得できます。
テスト中にput '/api/v1/auth'でユーザー情報を更新した後、user.reloadを使用することで、更新されたユーザーオブジ
ェクトの最新の情報を取得し、その情報が期待どおりに変更されているかを確認します。
------------------------------------------------------------------------------------------------
change
RSpecのマッチャ（matcher）で、オブジェクトの特定の属性の変更を検証するために使用されます。引数としてオブジェクト
と属性を指定します。change(user, :name)となっており、userはオブジェクトを表し、:nameは属性を指定しています。
------------------------------------------------------------------------------------------------
from
RSpecのマッチャの一部であり、変更前の値を指定します。この場合、user.name の現在の値を指定しています。from はメソ
ッドではなく、RSpecの構文要素です。
------------------------------------------------------------------------------------------------
to
RSpecのマッチャの一部であり、変更後の値を指定します。この場合、valid_attributes を JSON 形式にパースしたデータ
の name プロパティの値を指定しています。to はメソッドではなく、RSpecの構文要素です。

「userオブジェクトのname属性が変更されることを期待し、変更前の値がuser.nameであり、変更後の値が
JSON.parse(valid_attributes)['name']である」という意味になります。
=end
