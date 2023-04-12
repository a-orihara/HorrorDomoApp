# テストスイート何のほぼ全てのファイルで[require 'rails_helper']が必要。
# ファイル内のテストを実行する為に、Railsアプリの読み込みが必要である事を伝えている。
require 'rails_helper'

RSpec.describe User, type: :model do
  # 1
  # モデルの有効性を検証するテスト
  it 'nameとemailがあれば有効である' do
    # Userクラスのインスタンスを作成し、それをマッチャに渡している
    # 2
    # expect(user).to be_valid
    # 1
    user = User.new(name: 'test', email: 'test@test.com')
    expect(user).to be_valid
  end

end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @

=end