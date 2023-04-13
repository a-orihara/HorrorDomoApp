# テストスイート何のほぼ全てのファイルで[require 'rails_helper']が必要。
# ファイル内のテストを実行する為に、Railsアプリの読み込みが必要である事を伝えている。
require 'rails_helper'

# Userモデルのテスト
RSpec.describe User, type: :model do
  describe 'バリデーション' do
    # 5
    let(:user) { build(:user) }

    # まずファクトリ（テストデータ）の有効性を検証
    it '有効なファクトリである' do
      expect(user).to be_valid
    end

    # 1
    it '30文字以内の名前は有効' do
      expect(user).to validate_length_of(:name).is_at_most(30)
    end

    # 2
    it '名前は必須である' do
      expect(user).to validate_presence_of(:name)
    end

    it '255文字以内のメールは有効' do
      expect(user).to validate_length_of(:email).is_at_most(255)
    end
  end

  # describe 'Associations' do
  #   # You can add any association tests for your User model here
  # end

  # 3
  describe 'サインアップの流れ' do
    context 'ユーザが有効な場合' do
      it '新規にユーザーを作成' do
        # user = FactoryBot.build(:user) FactoryBotを省略
        user = build(:user)
        expect {
          user.save
        }.to change(described_class, :count).by(1)
      end
    end

    # 4
    context 'ユーザが無効の場合' do
      it '新規ユーザーを作成しない' do
        # user = FactoryBot.build(:user, email: nil) FactoryBotを省略
        user = build(:user, email: nil)
        expect {
          user.save
        }.not_to change(described_class, :count)
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
validate_length_of
Shoulda Matchers が提供する検証用のメソッド。モデルで定義された属性の長さを検証するメソッド。
name属性が30文字以内で有効であることを検証
name属性が31文字以上の場合にエラーになることを検証

:name
検証する属性を指定します。
is_at_most(30)
属性の値が最大で30文字であることを検証するためのメソッドです。

================================================================================================
2
validate_presence_of(:name)
Shoulda Matchers が提供する検証用のメソッド。モデルの属性に値が必須かどうかを検証。
nameが存在すると有効であること、nameが存在しない場合は無効であることを検証する
:nameがnilまたは空である場合にエラーになることを検証する

================================================================================================
3
user.save
このsave メソッドは Rails の ActiveRecord モデルによって提供されるメソッドで、新しいレコードを作成し、または既
存のレコードを更新するために使用されます。

------------------------------------------------------------------------------------------------
change(マッチャ)
change +  (from) / to / by
検証対象のオブジェクトの値が、指定した増分に変化することを期待するときに使用します。
changeは2つの引数をとります。1つ目は変化を検証するオブジェクトやブロックを指定し、2つ目は変化の方向性と変化の量を
指定するためのオプション（:countや:name）です。
注意してほしいのは、ここのexpectは、expect{ x.pop }.to のように、丸括弧ではなく中括弧を使っている点です。これは
Rubyの文法的にはブロックを expect に渡しています。同様に、 change{ x.size } の部分でも中括弧を使っているので、
ここもブロックを渡しています。

by
by メソッドは増分を指定するために使用されます。by(1) やby(-1)など。
change.byはメソッドチェインで、byの後に指定された値だけ変化することを期待するために使用されます。

User
検証対象のモデルであり、:count は User モデルのレコード数を表すシンボルです。
Userモデルの件数が1増えることを期待しています。

by(1)
レコード数が1増えることを検証するために使用されます。by メソッドは増分を指定するために使用されます。

------------------------------------------------------------------------------------------------
3
described_class
RSpec.describeの直後に書かれているモデル
RSpec.describe User do # Userがdescribed_class
end
described_classは、describeメソッドに渡されたクラスを参照するために使用されます。
described_classを使用すると、テストの保守性が高まります。クラス名が変更された場合でも、テストを修正する必要がな
くなります。
================================================================================================
4
.to_not change(User, :count)
to_notなので、user.save を呼び出した後で User モデルの数が変わる事を期待しない＝変わらない事を期待する」という
意味です。
一方、 expect { user.save }.to change(User, :count) は、「user.save を呼び出した後で User モデルの数が
変わることを期待する」という意味です。
つまり、 to_not の有無によって期待される結果が逆転しています。

「～であること」を期待する場合は to、
反対に「～ではないこと」を期待する場合は not_to もしくは to_not を使います。

================================================================================================
5
下記の省略形
let(:user) do
  FactoryBot.build(:user)
end
=end
