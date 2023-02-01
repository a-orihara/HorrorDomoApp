# テストスイート何のほぼ全てのファイルで[require 'rails_helper']が必要。
# ファイル内のテストを実行する為に、Railsアプリの読み込みが必要である事を伝えている。
require 'rails_helper'

# 3
# 有効なモデルのオブジェクトかどうかのテスト。有効なオブジェクトしかDBに保存出来ない。
# ちなみにモデルのオブジェクトは、バリデーションメソッドを通し、オブジェクトが有効な場合にのみデータベースに
# 保存出来る。
RSpec.describe User, type: :model do
  # 5
  let(:user) { build(:user) }

  # ファクトリ（テストデータ）の有効性を検証
  it '有効なファクトリを持つ事' do
    # buildはメモリに保存されるが、テストDBに保存されない。createはテストDBに保存される
    expect(build(:user)).to be_valid
  end

  # 1
  # モデルの有効性を検証するテスト
  it 'nameとemailがあれば有効である' do
    # Userクラスのインスタンスを作成し、それをマッチャに渡している
    # 2
    expect(user).to be_valid
  end

  # モデルの存在性を検証するテスト
  it 'nameがなければ無効である' do
    # Userクラスのインスタンスを作成し、それをマッチャに渡している
    # nameをnilにしてインスタンス作成
    user = build(:user, name: nil)
    # 「～ではないこと」を期待する場合は not_to
    expect(user).not_to be_valid
    # expect(user.name).to eq "test"
  end

  it 'emailがなければ無効である' do
    user = build(:user, email: nil)
    expect(user).not_to be_valid
  end

  # 重複を検証するテスト
  it 'emailが重複している場合は無効である' do
    create(:user, email: "test_1@example.com")
    user = build(:user, email: "test_1@example.com")
    expect(user).not_to be_valid
  end

  # 長さを検証するテスト
  it 'nameが30文字以上であれば無効である' do
    user.name = "a" * 31
    expect(user).not_to be_valid
  end

  it 'emaiが256文字以上であれば無効である' do
    user.email = "#{'a' * 244}@example.com"
    expect(user).not_to be_valid
  end

  # メールフォーマットのテスト
  it '有効なメールフォーマットは有効である' do
    # 4
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      user.email = valid_address
      expect(user).to be_valid
    end
  end

  it '無効なメールフォーマットは無効である' do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      user.email = invalid_address
      expect(user).not_to be_valid
    end
  end

  # 大文字小文字を無視したメールアドレスの一意性の検証
  it '重複したメールアドレスは無効である' do
    # dupメソッド:オブジェクトのコピーを作成するメソッド
    duplicate_user = user.dup
    # duplicate_user.emailのみ大文字にする
    duplicate_user.email = user.email.upcase
    # 一意性のテストのためには、メモリ上だけではなく(build)、実際にレコードをデータベースに登録する必要があります。
    user.save
    # 6
    expect(duplicate_user).not_to be_valid
  end

  it 'emailは小文字でDB登録される' do
    mixed_case_email = 'Foo@ExAMPle.CoM'
    user.email = mixed_case_email
    user.save
    # reload:変更されたDBの内容をインスタンスに反映させる
    expect(user.reload.email).to eq mixed_case_email.downcase
  end

  it 'パスワードが存在すること（空白でないこと）' do
    user.password = user.password_confirmation = " " * 6
    expect(user).not_to be_valid
  end

  it '6文字未満のpasswordは無効である' do
    user.password = user.password_confirmation = 'a' * 5
    expect(user).not_to be_valid
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
itはテストをexample（it do ... end）という単位にまとめる役割をします。
it do ... end の中のエクスペクテーション（期待値と実際の値の比較）がすべてパスすれば、そのexampleはパス
したことになります。


=          ==          ==          ==          ==          ==          ==          ==          =
2
expect(X).to <マッチャ> で記述するのがエクスペクテーションです。
expect には「期待する」という意味があるので、 例えばexpect(X).to eq Y は「XがYに等しくなることを期待する」
と読めます。よって、 expect(1 + 1).to eq 2 は「1 + 1 が 2 になることを期待する」テストになります。
原則として「1つの example につき1つのエクスペクテーション」で書いた方がテストの保守性が良くなります。

be_xxx (predicateマッチャ)
RSpecで特徴的なのが、 valid? のようにメソッド名が「?」で終わり、戻り値が true / false になるメソッドを
be_valid のような形式で検証できることです。
e.g
# user.valid? が true になればパスする
expect(user).to be_valid

be_valid:あることを期待してその通りの結果になるのかをテストする

=          ==          ==          ==          ==          ==          ==          =
3
# describe （RSpec.describe）メソッドはテストのグループ化を宣言します。
e.g.
RSpec.describe '四則演算'
ここでは「四則演算に関するテストを書くよー」と宣言しています。

-          --          --          --          --          --          --          --          -
# type: :modelがUserのモデルをテスト
# この中ではUserモデルで定義したメソッドを使える

=          ==          ==          ==          ==          ==          ==          =
4
%w記法とは、文字列からなる配列を作成したいときに「[ ]」(ブラケット)や「" "」(ダブルクォーテーション)を省略
して記述するためのRubyの構文です。

=          ==          ==          ==          ==          ==          ==          =
5
let の基本的な使い方
let(:foo) { ... } のように書くと、 { ... } の中の値が foo として参照できる
buildはメモリに保存されるが、テストDBに保存されない。createはテストDBに保存される

-          --          --          --          --          --          --          --          -
let変数の代わりに、beforeとインスタン変数を使っても同じ事が可能。
letで定義されたメソッドを使うと、初期化処理が実行されるのはそのメソッドが呼ばれたときだけ。

before(:each)フックは各exampleの前に実行されます。
before do
  # beforeブロックとitブロックの中では変数のスコープが異なるため、インスタンス変数を使用。
  @user = build(:user)
end

-          --          --          --          --          --          --          --          -
User.new:メモリ上にオブジェクトを作成
現行のrailsでは、newメソッドとbuildメソッドはほとんど同じ働きをする。
valid?メソッド:オブジェクトが有効かどうか確認（DBに保存されたかは関係ない）
user.save:オブジェクトを保存

=          ==          ==          ==          ==          ==          ==          =
6
@userの保存後は、duplicate_userのメールアドレスが既にDB内に存在するため、ユーザの作成は無効になる。

let(:user)が呼ばれたタイミングでは、インスタンスが生成されるだけで、まだデータベースに保存はされていない状態
です。この状態でuserを複製しておき、user.saveを実行すると、元のuserはデータベースに保存され、複製したユーザ
は保存されていないインスタンス、という状態ができます。
そして、複製したユーザをレシーバとしてbe_validすると、すでにデータベースに保存済みの元のuserとemailが重複し
ているため、バリデーションに引っかかる(valid?がfalseになる)、ということを検証しています。

大文字と小文字を区別しない設定
# duplicate_user.emailのみ大文字にする
duplicate_user.email = user.email.upcase
本来なら、大文字と小文字を区別する設定であれば、duplicate_user.email（大文字）とuser.email（小文字）は、
別のメアドと認識され、登録が有効になる。区別しない設定なので、大文字でも同じメアドと認識され、無効になる。
*uniqueness: { case_sensitive: false }
*通常、メールアドレスでは大文字小文字が区別されません。すなわち、foo@bar.com は FOO@BAR.COMと書いても扱い
は同じです。したがって、メールアドレスの検証ではこのような場合も考慮する必要があります。

before_save { self.email = email.downcase }
save前に小文字にする。
大文字のメアドも保存前にこのbefore_saveにかかるから、小文字判定されて、重複と見做され無効になる。
=end
