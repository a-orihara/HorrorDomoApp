require 'rails_helper'

RSpec.describe Post, type: :model do
  # 1 let(:user) { FactoryBot.create(:user) }の省略形
  let(:user) { create(:user) }
  # 2
  let(:post) { create(:post, user: user) }

  it '有効であること' do
    expect(post).to be_valid
  end

  it 'user_idがない場合は、無効であること' do
    post.user_id = nil
    expect(post).not_to be_valid
  end

  it "空（ブランク）なら無効であること" do
    post.content = "   "
    expect(post).not_to be_valid
  end

  it '141文字以上なら無効であること' do
    post.content = 'a' * 141
    expect(post).not_to be_valid
  end

  it '並び順は投稿の新しい順になっていること' do
    # 新たに比較用の現在時刻のpostレコードを作成
    most_recent_post = create(:post, user: user, created_at: Time.zone.now)
    # 3
    expect(most_recent_post).to eq described_class.first
  end

  it "タイトルが空（ブランク）なら無効であること" do
    post.title = "   "
    expect(post).not_to be_valid
  end

  it 'タイトルが21文字以上なら無効であること' do
    post.title = 'a' * 21
    expect(post).not_to be_valid
  end

end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
factory :post 内で user という記述があるため、 post オブジェクト生成時に user オブジェクトも自動
的に生成されます。しかし、 let(:post) { create(:post, user: user) } とすることで、既に生成され
ている特定の user (let(:user))を post の所有者として指定しています。これは特定の user が所有する
post をテストしたい場合などに使用します。
この記述がないと、毎回新たな user が生成され、その新たな user が所有する post が生成されます。
テストデータに一貫性を持たせるため
================================================================================================
2
{ FactoryBot.create(:post, user: user) }
:postは使用するFactoryの名前を指定。
第二引数のuser: userは作成するpostインスタンスのuser属性に、userを指定。
このuserはletによって定義されたuser変数が保持する User オブジェクトを設定している。
具体的には、post レコードが作成される際に、関連付けとして user レコードが関連づけられます。
================================================================================================
3
下記は同じ意味
expect(most_recent_post).to eq post.first
expect(most_recent_post).to eq described_class.first
described_class を使用することで、現在のテスト対象のクラス（post）を指定することができます。
=end
