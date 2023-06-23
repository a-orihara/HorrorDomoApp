require 'rails_helper'

RSpec.describe Micropost, type: :model do
  # 1 let(:user) { FactoryBot.create(:user) }の省略形
  let(:user) { create(:user) }
  # 2
  let(:micropost) { create(:micropost, user: user) }

  it '有効であること' do
    expect(micropost).to be_valid
  end

  it 'user_idがない場合は、無効であること' do
    micropost.user_id = nil
    expect(micropost).not_to be_valid
  end

  it "空（ブランク）なら無効であること" do
    micropost.content = "   "
    expect(micropost).not_to be_valid
  end

  it '141文字以上なら無効であること' do
    micropost.content = 'a' * 141
    expect(micropost).not_to be_valid
  end

  it '並び順は投稿の新しい順になっていること' do
    # 新たに比較用の現在時刻のmicropostレコードを作成
    most_recent_micropost = create(:micropost, user: user, created_at: Time.zone.now)
    # 3
    expect(most_recent_micropost).to eq described_class.first
  end
  # it '投稿したユーザが削除された場合、そのユーザのMicropostも削除されること' do
  #   # ユーザーを作成
  #   user = create(:user)
  #   # そのユーザーが投稿したMicropostを作成
  #   create(:micropost, user: user)
  #   # user.destroyを実行することによって、Micropostの数が1つ減ることを確認
  #   expect { user.destroy }.to change(Micropost, :count).by(-1)
  # end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
factory :micropost 内で user という記述があるため、 micropost オブジェクト生成時に user オブジェクトも自動
的に生成されます。しかし、 let(:micropost) { create(:micropost, user: user) } とすることで、既に生成され
ている特定の user (let(:user))を micropost の所有者として指定しています。これは特定の user が所有する
micropost をテストしたい場合などに使用します。
この記述がないと、毎回新たな user が生成され、その新たな user が所有する micropost が生成されます。
テストデータに一貫性を持たせるため
================================================================================================
2
{ FactoryBot.create(:micropost, user: user) }
:micropostは使用するFactoryの名前を指定。
第二引数のuser: userは作成するMicropostインスタンスのuser属性に、userを指定。
このuserはletによって定義されたuser変数が保持する User オブジェクトを設定している。
具体的には、micropost レコードが作成される際に、関連付けとして user レコードが関連づけられます。
================================================================================================
3
下記は同じ意味
expect(most_recent_micropost).to eq Micropost.first
expect(most_recent_micropost).to eq described_class.first
described_class を使用することで、現在のテスト対象のクラス（Micropost）を指定することができます。
=end
