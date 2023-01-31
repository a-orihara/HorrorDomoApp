# 1
class User < ApplicationRecord
  # 2 ↓validates(:name, presence: true)と同じ意味
  validates :name,  presence: true, length: { maximum: 30 }
  # 3
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email,
            presence: true,
            length: { maximum: 255 },
            # 6
            uniqueness: true,
            format: { with: VALID_EMAIL_REGEX }
end

=begin
=        ==        ==        ==        ==        ==        ==        ==        ==        =
1
class User < ApplicationRecord という構文で、User クラスは ApplicationRecord を継承するので、User
モデルは自 動的に ActiveRecord::Base クラスのすべての機能を持つことになります。

Railsではバリデーションを簡単に利用できるよう、Active Recordには一般に利用可能なビルトインヘルパーが用意さ
れており、独自のバリデーションメソッドも作成できるようになっています。これらのヘルパーは、共通のバリデーション
ルールを提供します。

-        --        --        --        --        --        --        --        --        -
2
以下のメソッドではバリデーションメソッドがトリガされ、オブジェクトが有効な場合にのみデータベースに保存されます。
create,create!
save,save!
update,update!
*!が末尾に付く破壊的メソッド（save!など）では、レコードが無効な場合に例外が発生します。 非破壊的なメソッドは、
無効な場合に例外を発生しません。saveとupdateは無効な場合にfalseを返し、createは無効な場合に単にそのオブジ
ェクトを返します。

以下のメソッドはバリデーションを行わずにスキップします。オブジェクトの保存は、有効無効にかかわらず行われます。
これらのメソッドの利用には注意が必要です。
decrement!,decrement_counter
increment!
increment_counter
insert,insert!
insert_all,insert_all!
toggle!
touch
touch_all
update_all
update_attribute
update_column
update_columns
update_counters
upsert
upsert_all

-        --        --        --        --        --        --        --        --        -
3
定数です。大文字で始まる名前は Ruby では定数を意味します。

-        --        --        --        --        --        --        --        --        -
4
formatオプション
このヘルパーメソッドは、引数にwithオプションで与えられた正規表現(Regular Expression)(regexとも呼ばれます)
を取り、と属性の値がマッチするかどうかを検証します。

-        --        --        --        --        --        --        --        --        -
5
before_save:Active Recordのコールバック(callback)メソッド。オブジェクトがDBに保存される前に処理を実行。

メールアドレスの一意性を保証するためには、データベースのアダプタが、常に大文字小文字を区別するインデックスを使
っているとは限らない問題への対処が必要。例えば、Foo@ExAMPle.Com と foo@example.com が別々の文字列だと解
釈してしまうデータベースがありますが、私達のアプリケーションではこれらの文字列 は同一であると解釈されるべきで
す。この問題を避けるために、今回は「データベース に保存される直前にすべての文字列を小文字に変換する」という対
策を採ります。これを実装するために Active Record のコールバック(callback) メソッドを利用します。

次のように書くこともできましたが、
self.email = self.email.downcase
User モデルの中では右式の self を省略できるので、今回は次のように書きました

-        --        --        --        --        --        --        --        --        -
6
# 以前の内容。メールアドレスが小文字で統一されれば、大文字小文字を区別するマッチが問題なく動作できるから不要に。
# :case_sensitive:大文字小文字の違いを区別する。
uniqueness: { case_sensitive: false },

-        --        --        --        --        --        --        --        --        -
7
has_secure_password
.セキュアにハッシュ化したパスワードを、データベース内の password_digest という属性に保存できるようになる。
.2つのペアの仮想的な属性(password と password_confirmation)が使える ようになる。また、存在性と値が一致
するかどうかのバリデーションもバリデーションをする機能も (強制的に)追加されている。
.authenticateメソッドが使えるようになる(引数の文字列がパスワードと一致すると User オブジェクトを、間違っ
ていると false を返すメソッド)。
authenticate:引数に渡された文字列(パスワード)をハッシュ化した値と、データベース内にある password_digest
カラムの値を比較します。trueだとそのユーザーオブジェクトを返す。

セキュアパスワードという 手法では、各ユーザーにパスワードとパスワードの確認を入力させ、それを(そのままではなく)
ハッシュ化したものをデータベースに保存します。生のパスワードではなく、ハッシュ化されたパスワード同士を比較します。

has_secure_password機能を使えるようにするには、モデル内に password_digestという属性(カラム)が含まれている必要が
ある。暗号化されたパスワードはpassword_digestというカラムに保存される為。またhas_secure_passwordを使って
パスワードをハッシュ化する為に、ハッシュ関数であるbcryptを使う為のgemが必要。

has_secure_passwordを記述することにより、新規登録時passwordとpassword_confirmationの2つを入力するこ
とで、password_digestとして値が変換されDBに保存されるので、ユーザーデータがセキュアな物になります。

ちなみにhas_secure_passwordメソッドは存在性のバリデーションをデフォでしてくれるのですが、 これは新しくレコ
ードが追加されたときだけに適用される性質を持っています。したがって、例えばユーザーが’ ’(6文字分の空白スペース)
といった文字列をパスワード欄に入力して[更新]しようとすると、バリデーションが適用されずに更新されてしまう問題が
発生してしまうのです。これに対処する為、[presence: true]を追加
=end