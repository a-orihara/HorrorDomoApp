require 'rails_helper'

RSpec.describe Micropost, type: :model do
  # let(:user) { FactoryBot.create(:user) }の省略形
  let(:user) { create(:user) }
  # 1
  # ↓他の書き方:let(:micropost) { FactoryBot.create(:micropost, user: user) }
  let(:micropost) { user.microposts.build(content: 'MyText') }

  it '有効であること' do
    expect(micropost).to be_valid
  end

  it 'user_idがない場合は、無効であること' do
    micropost.user_id = nil
    expect(micropost).not_to be_valid
  end

  describe "content" do
    it "空（ブランク）なら無効であること" do
      micropost.content = "   "
      expect(micropost).not_to be_valid
    end

    it '141文字以上なら無効であること' do
      micropost.content = 'a' * 141
      expect(micropost).not_to be_valid
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
{ FactoryBot.create(:micropost, user: user) }
:micropostは使用するFactoryの名前を指定。
第二引数のuser: userは作成するMicropostインスタンスのuser属性に、userを指定。
このuserはletによって定義されたuser変数が保持する User オブジェクトを設定している。
=end
