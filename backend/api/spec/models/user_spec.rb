# テストスイート何のほぼ全てのファイルで[require 'rails_helper']が必要。
# ファイル内のテストを実行する為に、Railsアプリの読み込みが必要である事を伝えている。
require 'rails_helper'

# 6
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

    it 'メールアドレスが正しい形式であること' do
      expect(user).to allow_value('user@example.com').for(:email)
      expect(user).not_to allow_value('user@example').for(:email)
    end

    it '160文字以内のプロフィールは有効' do
      expect(user).to validate_length_of(:profile).is_at_most(160)
    end
  end

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

  describe 'Postとの関連性' do
    let(:user) { create(:user) }

    # 8
    it '投稿したユーザが削除された場合、そのユーザのpostも削除されること' do
      create(:post, user: user)
      expect { user.destroy }.to change(Post, :count).by(-1)
    end
  end

  # ユーザーのフォロー・フォロー解除（following関連のメソッドをテスト）
  describe 'ユーザーのフォローとフォロー解除（following関連のメソッドをテスト）' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    before do
      user.follow(other_user)
    end

    it 'ユーザーをフォローできること' do
      expect(user.following?(other_user)).to be_truthy
    end

    it 'ユーザーのフォローを解除できること' do
      user.unfollow(other_user)
      expect(user.following?(other_user)).to be_falsey
    end

    it '他のユーザーがユーザーをフォローしていること' do
      expect(other_user.followers.include?(user)).to be_truthy
    end

    it '他のユーザーがユーザーのフォローを解除した場合' do
      other_user.followers.delete(user)
      expect(other_user.followers.include?(user)).to be_falsey
    end
  end

  # follow, unfollow, following?のテスト
  describe 'ユーザーのフォローとフォロー解除（follow, unfollow, following?のテスト）' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    before do
      user.follow(other_user)
    end

    it '他のユーザーをフォローし、その状況を確認できること' do
      expect(user.following?(other_user)).to be_truthy
    end

    it '他のユーザーのフォローを解除し、その状況を確認できること' do
      user.unfollow(other_user)
      expect(user.following?(other_user)).to be_falsey
    end
  end

  describe 'いいねの確認（already_liked?のテスト）' do
    let(:user) { create(:user) }
    let(:post) { create(:post) }

    it 'いいねしていない場合はfalseを返すこと' do
      expect(user.already_liked?(post)).to be_falsey
    end

    it 'いいねしている場合はtrueを返すこと' do
      create(:like, user: user, post: post)
      expect(user.already_liked?(post)).to be_truthy
  end

  describe 'Feedの取得（feedのテスト）' do
    let(:user) { create(:user) }
    let(:followed_user) { create(:user) }
    let(:unfollowed_user) { create(:user) }
    let!(:followed_post) { create(:post, user: followed_user) }
    let!(:unfollowed_post) { create(:post, user: unfollowed_user) }

    before do
      user.follow(followed_user)
    end

    it 'フォローしているユーザーの投稿を含むこと' do
      expect(user.feed).to include(followed_post)
    end

    it 'フォローしていないユーザーの投稿を含まないこと' do
      expect(user.feed).not_to include(unfollowed_post)
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
------------------------------------------------------------------------------------------------
letはRSpecで使用されるメソッドであり、テストコンテキスト内で変数を定義するために使用されます。この変数はテストケー
ス内で再利用されることがあります。
具体的には、letを使用して変数を定義すると、その変数はテストケース内で遅延評価されます。つまり、変数が初めて参照され
るまで、その値が計算または評価されることはありません。
letを使用することで、テストケース内で同じデータやオブジェクトを共有しやすくなります。また、テストデータの作成やセッ
トアップに便利です。
なお、letブロックは遅延評価されるため、同じテストケース内で複数回参照されても、最初の参照時に計算された値が再利用さ
れます。これにより、効率的なテストの実行が可能となります。

================================================================================================
6
Userモデルのテストでは、そのモデルが正しく機能しているか（例えば、バリデーションが適切に機能しているか）を確認する
ことが目的です。
Userモデルのバリデーションは、ユーザーがログインしているかどうかとは関係なく、新しくユーザーが作成されたときや、既
存のユーザー情報が更新されたときに機能します。したがって、Userモデルのテストにはログイン状態は必要ないと言えます。
ログイン状態をシミュレートする必要はないので、Userモデルのバリデーションのテストとログイン状態は無関係と言えます。

shoulda-matchersはモデルテストにおけるバリデーションやリレーションのテストを容易にするためのgemです。そのため、
リクエストスペックのテストコードには直接的な適用はありません。
================================================================================================
7
destroy
Active Record モデルのインスタンスを削除するためのメソッドです。
具体的には、データベースから対象のレコードを削除し、関連するデータや関連テーブルのエントリも同時に削除します。
================================================================================================
8
Post はここではモデルクラスを表しています。Railsのアプリケーションでは、各種のモデルクラスはアプリケーション全体で
利用することができます。これにはテストファイルも含まれます。テストファイルでは、アプリケーションのコードをテストする
ために、モデルやコントローラーなどのクラスを直接使用します。
------------------------------------------------------------------------------------------------
change メソッドは、ブロック内で何らかの操作を行った際のオブジェクトの状態の変化を検証するためのRSpecのマッチャで
す。change メソッドは２つの引数を取ります。
第一引数：変化を検証する対象のオブジェクト。ここでは Post モデルです。
第二引数：変化を検証する対象のオブジェクトのメソッド。ここでは :count です。
例えば change(Post, :count) の場合、Post.count の値が変化することを検証します。
------------------------------------------------------------------------------------------------
:count は Post モデルに対して適用されるメソッドを指定しています。Railsでは、モデルクラスに対して count メソッド
を呼び出すと、そのモデルのレコード数をデータベースから取得します。したがって、ここでは Post モデルのレコード数が変
化することを検証しています。
------------------------------------------------------------------------------------------------
by(-1)はchangeメソッドと一緒に使われ、その結果が指定した量だけ変化したかどうかをテストします。by(-1)は、テスト対
象の処理を実行する前後で、指定したオブジェクト（ここではPostの数）が1減少することを期待する表現です。
------------------------------------------------------------------------------------------------
テストコードでは、通常のアプリケーションのルール（例えば「userの削除はadminユーザーしかできない」など）は適用され
ません。そのため、user.destroyで任意のユーザーを削除することが可能です。ただし、ある特定のロール（ここではadmin）
が必要な操作をテストする場合は、そのロールを持つユーザーをテスト内で作成し、そのユーザーを通じて操作を行います。
=end
