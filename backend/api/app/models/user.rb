# frozen_string_literal: true

# Rails 5.0 以降を使用している場合は、User < ActiveRecord::Baseから変更。
class User < ApplicationRecord
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # deviseやincludeなどのマクロスタイルの呼び出しは先頭に配置
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  # 4
  include DeviseTokenAuth::Concerns::User

  # 3 has_one_attachedやhas_manyなどのアソシエーションはバリデーションの前に配置
  has_one_attached :avatar
  # 5 一人のuserは複数のpostを持つのでpostsと複数形にする
  has_many :posts, dependent: :destroy
  # 7 一人のuserは複数のuserをフォローをするのでactive_relationshipsと複数形にする
  has_many :active_relationships, class_name: "Relationship",
                                  foreign_key: "follower_id",
                                  dependent: :destroy,
                                  # 8
                                  inverse_of: :follower

  # 13
  has_many :passive_relationships, class_name: "Relationship",
                                   foreign_key: "followed_id",
                                   dependent: :destroy,
                                   inverse_of: :followed

  # 9 引数の値にシンボルがあれば、rubyだとそれは慣習的にメソッドのこと。そのメソッドを呼び出す。
  has_many :following, through: :active_relationships, source: :followed
  # 14
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :likes, dependent: :destroy
  # 16
  has_many :liked_posts, through: :likes, source: :post

  # 1 ↓validates(:name, { presence: true, length: { maximum: 30 } })の省略形
  validates :name,  presence: true, length: { maximum: 30 }
  # 2
  validates :email, length: { maximum: 255 }
  # presence: trueがないので、プロフィールが空でもいい
  validates :profile, length: { maximum: 160 }
  #   6
  validates :avatar, content_type: { in: %w[image/jpeg image/gif image/png],
                                     message: :invalid_image_format },
                     size: { less_than: 5.megabytes,
                             message: :size_over }

  # ここ以下のメソッドは、privateにしていないので外部（コントローラー）から呼び出せる
  # 10 ユーザーをフォローする。followingはhas_manyで定義したメソッド
  def follow(other_user)
    # self.following << other_user
    following << other_user
  end

  # 11 ユーザーをフォロー解除する
  def unfollow(other_user)
    #  self.active_relationships.find_by(followed_id: other_user.id).destroy
     active_relationships.find_by(followed_id: other_user.id).destroy
  end

  # 12 現在のユーザーがフォローしてたら true を返す
  def following?(other_user)
    # self.following.include?(other_user)
    following.include?(other_user)
  end

  # 15 Feed（自ユーザーとフォローユーザーの投稿データ）を返す。戻り値はpostの配列
  def feed
    following_ids = "SELECT followed_id FROM relationships
                     WHERE follower_id = :user_id"
    Post.where("user_id IN (#{following_ids})
                     OR user_id = :user_id", user_id: id)
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
devise_token_auth は、デフォルトでは name 属性に対して presence: true や uniqueness: true のようなバリ
デーションは設定されていません。
emailに対しては、presence: trueやuniqueness: trueのバリデーションが初めから付いている。また、デフォルトで
email 属性にはフォーマットのバリデーションも設定されており、正しいメールアドレス形式であることが求められます。
下記は不要
.VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/
.validates :email, length: { maximum: 255 },  format: { with: VALID_EMAIL_REGEX }
*formatの部分
------------------------------------------------------------------------------------------------
validatesはActive Recordのメソッドです。
1つ以上の引数を取ることができます。一般的にはバリデーション対象の属性名をシンボルで指定し、その後にオプションのハ
ッシュを渡します。このオプションのハッシュには、バリデーションの種類やオプション、エラーメッセージなどを指定するこ
とができます。

validates(:email, { length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX } })
.バリデーション対象の属性名/:email
.オプションのハッシュ/{ length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX } }
------------------------------------------------------------------------------------------------
presence: true
空白スペースのみの文字列も空文字の文字列も無効。空文字列やnilではないことが要求されます。

================================================================================================
2
format
フォーマットの制約を指定するオプションであり、この場合はemailが正規表現VALID_EMAIL_REGEXに一致することを指定し
ています。
指定できるのは正規表現（Regexpオブジェクト）のみです。
formatオプションの引数はハッシュであり、メソッドではありません。

with
正規表現のパターンを指定するオプションであり、この場合はemailが正しいフォーマットであることを確認するために使用さ
れます。

# 以前の内容。メールアドレスが小文字で統一されれば、大文字小文字を区別するマッチが問題なく動作できるから不要に。
# :case_sensitive:大文字小文字の違いを区別する。
uniqueness: { case_sensitive: false },
=大文字小文字の違いを区別しない。つまり小文字のメアドと同じ文字の大文字のメアドは、区別しないので、同じ文字と判断
され、登録されない。

================================================================================================
3
RailsのActive Storageは、アプリケーション内でファイルアップロードを簡単にするためのフレームワークです。
Active Storageを使うことで、簡単にファイルをアップロードし、クラウドストレージに保存することができます。また、
Active Storageは、画像リサイズやサムネイル生成などの機能も提供しています。
どのモデル（例えばUser）に紐付けられた画像もこの2つのテーブルを利用します。
------------------------------------------------------------------------------------------------
Userモデルでhas_one_attached :avatarと設定すると、実際には

has_one :avatar_attachment
has_one :avatar_blob, through: :avatar_attachment
のようなhas_one :through関連付けが行われます。
has_one_attachedに渡したavatarはAttachmentオブジェクトのname属性の値となります。
ActiveRecordによってUserオブジェクトがデータベース上のデータにマッピングされているように、Blobオブジェクトがロー
カルまたはクラウドストレージ上のファイルにマッピングされます。
------------------------------------------------------------------------------------------------
has_one_attached
Active Storageを使って、アップロードされたファイルをモデル（この場合User）に1対1の関連付けを添付するためのメソッ
ドです。
つまり、has_one_attachedは、DBに activeStorage_blobとして保存されている実際のファイルデータにリンクする、
activeStorage_attachmentを作成することによって、User モデルとアップロードされたファイルとの間の接続を確立する。
これにより、Userモデルはアップロードされたファイルと1対1の関係を持つことができる。
activeStorage_attachment
Userモデルと実際のファイルデータとの間の接続を表し、それは`blob`としてデータベースに格納される。
activeStorage_blob
アップロードされたファイルに関連するファイルコンテンツ、メタデータ、その他の情報など、実際のファイルデータそのものを
指します。

なお、レコードとファイルが1対1の場合は has_one_attached ですが、1対多の場合は has_many_attached になります。
Userモデルにavatar（この名前は何でもいい）という名前の1つの添付ファイルを添付することができます。これにより、画像
ファイルをUserレコードに関連付けることができます。
has_one_attachedメソッドは、Userモデルにアバターを添付するためのメソッドです。これにより、user.avatarというメ
ソッドを使って、Userモデルのインスタンスにアバターを添付できます。
アバター画像をアップロードするためには、フロント側でフォームを作成する必要があります。

------------------------------------------------------------------------------------------------
has_one_attachedによって生成されるメソッド

avatar
添付されたファイルを取得する。
user.avatar.attach
ユーザーオブジェクトにavatarを添付するためのメソッドです。ファイルをアップロードすることができます。。
user.avatar.attached?
特定のユーザーがavatrを持っているかどうか検証し、真偽値を返すメソッドです

================================================================================================
4
include DeviseTokenAuth::Concerns::User
`include` はRubyのモジュールをクラスに取り込むためのメソッドです。これにより、モジュール内のメソッドや定数をクラ
スで使用できるようになります。
`DeviseTokenAuth::Concerns::User` は、Devise Token Auth gemが提供するモジュールで、トークンベースの認証
機能を追加するためのものです。
`include DeviseTokenAuth::Concerns::User` によって、Userモデルにトークン認証に必要なメソッドやバリデーシ
ョンが追加されます。これにより、APIモードでの認証が容易になります。

================================================================================================
5
has_many :posts
一対多のテーブルを作成した時，テーブル user を参照先，テーブル post を参照元と呼びます。
参照元には外部キーが必要です。
------------------------------------------------------------------------------------------------
has_many  <Model（クラス）名>で、そのクラス名を使ったメソッドが複数生成されます。
そのメソッドはUserモデルを通して関連するPostモデルを取得するためのものです。
つまり、Userモデルを通じて関連するPostモデルを取得することができます。これは、Userモデルが複数のPostモデルと関連
付けられていることを意味します。
具体的には、Userインスタンスから関連するすべてのPostインスタンスを取得することができます。
------------------------------------------------------------------------------------------------
has_many :postsで、自動で外部キーが設定される。
外部キー（2つのテーブルを繋ぐ）はuser_idです。この外部キーはPostモデルに付与されます。Userモデルではない。
------------------------------------------------------------------------------------------------
dependent: :destroy
ユーザーが削除されたときに、そ のユーザーに紐付いた(そのユーザーが投稿した)マイクロポストも一緒に削除されるようにな
ります。
これは、管理者がシステムからユーザーを削除したとき、持ち主の存在しないマイクロポストがデータベースに取り残されてしま
う問題を防ぎます。

================================================================================================
6
message: :invalid_image_format
config/locales/ja.ymlの日本語化ファイルからエラーメッセージを取得。

================================================================================================
7
has_many <Model（クラス）名>
一対多のテーブルを作成した時，テーブル user を参照先，テーブル active_relationships を参照元と呼びます。
参照元には外部キーが必要です。
------------------------------------------------------------------------------------------------
has_many :active_relationships
userモデルのインスタンスに、active_relationshipsというメソッドを作成する。
------------------------------------------------------------------------------------------------
has_many :active_relationshipsだと、railsはactive_relationshipクラスを探しに行く。
しかしそれは存在しないので、class_name:  "Relationship"で、Relationshipクラスを探しに行くように指定している。
:active_relationshipsは任意の名前を設定している。railsの規約にない設定の為、こういう記述になる。
------------------------------------------------------------------------------------------------
has_manyは、Userモデルを通して関連するRelationshipモデルを取得するためのものです。
つまり、Userモデルを通じて関連するRelationshipモデルを取得することができます。これは、Userモデルが複数の
Relationshipモデルと関連付けられていることを意味します。
具体的には、Userインスタンスから関連するすべてのRelationshipインスタンスを取得することができます。
------------------------------------------------------------------------------------------------
has_many :postsで、自動で外部キーが設定される。
外部キーはuser_idです。この外部キーはRelationshipモデルに付与されます。
------------------------------------------------------------------------------------------------
自動で設定される外部キーを、foreign_key: "follower_id"によって、名称をfollower_idに変更している。
Relationshipクラスに、"follower_id"という外部キーが設定される。
こののケースでは自分がフォローし ているユーザーを follower_id という外部キーを使って特定します。
------------------------------------------------------------------------------------------------
foreign_keyとは、参照先を参照するための外部キーの名前を指定するもの。
つまり、belongs_toで参照する相手（参照先）の外部キーを指定するために、belongs_toを行う側に記述しなければならない
もの

has_many :active_relationships の関連性を示す際に、foreign_key: "follower_id" を指定することで、
active_relationships テーブルの follower_id カラムが User モデルの外部キーとなることを明示しています。
foreign_key の指定はデフォルト値とは異なるカラム名を使用する場合に使用されます。この場合、Relationship モデルの
テーブルには follower_id カラムが存在する必要があるので、マイグレーションに記載されています。
------------------------------------------------------------------------------------------------
双方向関連付けをセットアップするには、belongs_to関連付けを使うときに相手側のモデルにhas_oneまたはhas_many関連付
けを指定します。
一般的には、belongs_to を記述しているモデル側（Relationship）に外部キーの指定を行います。
has_many :active_relationships の関連性を示す際に、foreign_key: "follower_id" をuser側（has_many側）で
指定することで、active_relationships テーブルの follower_id カラムが User モデルの外部キーとなることを明示し
ています。これにより、関連するレコードを正しく紐付けることができます。
------------------------------------------------------------------------------------------------
has_many :active_relationships によって生成されるメソッド
active_relationships
1. `active_relationships` の使用例は以下の通りです：
- `user.active_relationships`：`user` オブジェクトに関連する `active_relationships` を取得します。
- `user.active_relationships.count`：`user` オブジェクトに関連する `active_relationships` の数を取得し
ます。
- `user.active_relationships.create(followed_id: other_user.id)`：`user` オブジェクトに関連する
`active_relationships` を作成します。user と紐付けて能動的関係を作成/登録する。
user.active_relationships.create(followed_id: 4)のように使う。
- `user.active_relationships.create!(followed_id: other_user.id)`：`user` オブジェクトに関連する
`active_relationships` を作成します。userを紐付けて能動的関係を作成/登録する(失敗時にエラーを出力)。

================================================================================================
8
inverse_of:
これもclass_name:やforeign_key:と同じ、has_manyのオプション。
:inverse_ofオプションは、その関連付けの逆関連付けとなるhas_many関連付けまたはhas_one関連付けの名前を指定します

------------------------------------------------------------------------------------------------
通常は、関連付けを双方向に機能させるために、2つのモデルの両方に関連付けを定義する必要があります。
class Author < ApplicationRecord
  has_many :books
end

class Book < ApplicationRecord
  belongs_to :author
end
Active Recordは、これらの関連付けの設定から、2つのモデルが双方向の関連を共有していることを自動的に認識しようとし
ます。
ただしActive Recordは、:throughや:foreign_keyオプションを含む双方向関連付けを自動認識しません。
Active Recordが提供している:inverse_ofオプションを使うと、双方向関連付けを明示的に宣言できます。
foreign_key等を指定して関連付けされている場合、inverse_ofが自動で適用されないため明示する必要がある。
------------------------------------------------------------------------------------------------
1. 双方向関連付け（bidirectional association）とは、2つのモデル間の関連性を、両方向に機能するように設定するこ
とです。通常、関連付けを双方向にするためには、2つのモデルの両方に関連付けを定義する必要があります。一方のモデルに対
して関連付けを定義すると、もう一方のモデルからも関連するモデルにアクセスできるようになります。

2. 双方向関連付けでない場合、一方向の関連付けしか定義されていないため、片方向の関連性しか利用できません。例えば、
`Author`モデルが`has_many :books`と関連付けられているが、`Book`モデルには対応する`belongs_to :author`の関
連付けがない場合、次のような問題が発生します:
- `Author`モデルからは関連するすべての`Book`インスタンスにアクセスできますが、`Book`モデルからは関連する`Author`インスタンスにアクセスできません。
- `Book`モデルに新しい本を追加する場合、それがどの作者に属しているかを指定する方法がありません。
- `Book`モデルから`Author`モデルに関連付けられたメソッド（例: `book.author`）を利用できません。

このように、片方向の関連付けしかない場合、関連するモデルの間で情報や操作を共有するための便利なメソッドやアクセスが
制限されることになります。双方向関連付けを使用することで、より柔軟で便利な関連性を実現することができます。

================================================================================================
9
has_many :following, through: :active_relationships, source: :followed
userインスタンスにfollowingメソッドを作成する。
このfollowingメソッドは、userインスタンスのactive_relationshipsメソッドを通して、followed_idを取得する。

has_many :through関連付けは、他方のモデルと「多対多」のつながりを設定する場合によく使われます。
この関連付けでは、2つのモデル（この場合UserとUser）の間に「第3のモデル」（joinモデル:この場合Relationshipモデ
ル）が介在し、それを経由（through）して相手のモデル（Userモデル）の「0個以上」のインスタンスとマッチします。
------------------------------------------------------------------------------------------------
userインスタンスに対して、active_relationshipsメソッドを実行し、それで得られたそれぞれのRelationshipのインス
タンスデータ（自分がフォローしているデータの集合）の一つ一つに対して、followedメソッド（active_relationships.
followed）を実行する。
------------------------------------------------------------------------------------------------
through オプション
関連する別のモデル（Relationshipモデル）を介して関連を設定するためのオプションです。
through: :active_relationships と指定することで、active_relationships テーブル（Relationshipモデル）を
経由して関連を設定します。
through オプションは、引数に、関連を設定するために使用する中間テーブル（アソシエーションテーブル:この場合
Relationshipモデル）を指定するためのもの、中間テーブルを表すメソッドや直接中間テーブル名などを指定します。

:active_relationships, class_name: "Relationship",より、
through: :active_relationshipsは、Relationshipモデルのこと。
------------------------------------------------------------------------------------------------
source: :followed
source オプションは、through オプションと組み合わせて使用され、中間テーブルで参照する関連を指定します。
through オプションで指定した中間テーブルに、さらにその中間テーブルにおいて、followedを通して、関連するモデルの名
前（User、フォローしているユーザー）を指定します。
------------------------------------------------------------------------------------------------
`through: :active_relationships` を指定している場合、`source: :followed` を追加することで、`User` モデル
が `:following` という関連を通じて直接的に `:followed` の関連を持つことを示しています。

`through: :active_relationships` と指定している場合、`has_many :following` によって返される関連オブジェク
トは、`User` モデルが `active_relationships` テーブルを介して関連付けられた `Relationship` モデルのコレクシ
ョンです。
しかし、`Relationship` モデルそのものではなく、`User` モデルがフォローしているユーザーを取得したい場合に
`source: :followed` を使用します。
`source: :followed` は、`Relationship` モデルの中で関連するユーザーモデルの名前を指定しています。
具体的には、`followed` という関連モデルを通じて `User` モデルと関連付けることで、`User` モデルがフォローしてい
るユーザーを取得します。
`followed` は `Relationship` モデルの中で `belongs_to :followed, class_name: "User"` のように定義されて
いる関連です。
したがって、`has_many :following, through: :active_relationships, source: :followed` は、「`User` モ
デルが `active_relationships` テーブルを介して関連付けられた `Relationship` モデルを通じて、`followed` モ
デル（つまり、`User` モデルがフォローしているユーザー）を取得する」という意味になります。
------------------------------------------------------------------------------------------------
has_many :followeds, through: :active_relationshipsだと、
Rails は「followeds」というシンボル名を見て、これを「followed」という単数形に変え、 relationships テーブル（
モデル）のfollowed_id を使って対象のユーザーを取得してきます。
つまり、デフォルトのhas_many throughという関連付けでは、Rails はモデル名(relationship:単数形)に対応する外部キ
ー(followed_id)を探します。
しかし、user.followeds という名前は英語として不適切です。代わりに、user.following という名前を使うために、
Rails のデフォルトを上書きする必要があります。ここでは:source パラメーターを使って、「following 配列の元は、
followed id の集合である」ということを明示的に Rails に伝えます。
------------------------------------------------------------------------------------------------
followingメソッドの戻り値は、そのユーザーがフォローしているユーザーのリスト
（ActiveRecord::Associations::CollectionProxyオブジェクト）です。

================================================================================================
10
followメソッドの戻り値は、other_userをfollowing配列に追加した結果となります。これは、
ActiveRecord::Associations::CollectionProxyオブジェクト（つまりフォロー中のユーザーのコレクション）です。
------------------------------------------------------------------------------------------------
<<
<<はRubyのArrayのメソッドで、要素を配列の最後に追加します。following << other_userはother_userをfollowing
配列の末尾に追加することを意味します。

================================================================================================
11
unfollowメソッドの戻り値は、find_byメソッドにより見つけたactive_relationships（つまりフォロー関係）の、
destroyメソッドの結果となります。成功した場合、削除されたRelationshipオブジェクトが返ります。
find_byで該当するRelationshipが見つからない場合はnilが返ります。
Railsのモデルのインスタンスのdestroyメソッドは、削除対象が存在しない場合：destroyメソッドはnilを返します。

================================================================================================
12
include?は、配列が特定の要素を含むかどうかを確認します。
following.include?(other_user)はfollowing配列がother_userを含むかどうかを確認します。
------------------------------------------------------------------------------------------------
following?と対照的な followed_by?メソッドを定義してもよかったのですが、サン プルアプリケーションで実際に使う場
面がなかったのでこのメソッドは省略

================================================================================================
13
詳細な説明は、7のhas_many :active_relationshipsを参考

================================================================================================
14
9のhas_many :followingを参考
------------------------------------------------------------------------------------------------
これは:followers 属性の場合、Rails が「followers」を単数形にして自動的に外部キーfollower_id を探してくれるか
ら、参照先(followers)を指定するための:source キーを省略してもよい。
必要のない:source キー をそのまま残しているのは、has_many :followingとの類似性を強調させるためです。

================================================================================================
15
すべてのユーザーがフィードを持つので、feed メソッドは User モデルで作るのが自然です。
つまり、
- このコードでは「フィード」とは、あるユーザーがフォローしている他のユーザーの投稿（このコードではPostとして表現さ
れている）の集合を指しています。
- すべてのユーザーが自分自身のフィードを持つというのは、そのユーザーがフォローしているユーザーの投稿が存在することを
意味しています。それぞれのユーザーのフィードは、そのユーザーがフォローしているユーザーによって異なります。
- `feed`メソッドは、あるユーザー（メソッドを呼び出すUserインスタンス）がフォローしているユーザーの投稿を取得する
機能を提供します。
- フィードはユーザー固有の情報であり、そのユーザーがフォローしているユーザーからの投稿を取得するためのメソッドです。
したがって、このメソッドはUserモデルに定義するのが最も適切で自然と言えます。なぜなら、Userモデルはユーザーに関する
情報とそのユーザーが行う動作を管理する責任を持つからです。
- また、`feed`メソッドがUserモデルに定義されていることにより、Userインスタンスから直接フィードを取得することがで
きます。例えば`@user.feed`のように呼び出すことができます。これは直感的に理解しやすく、使用しやすいと言えます。
------------------------------------------------------------------------------------------------
第一段階

def feed
    Micropost.where("user_id IN (?) OR user_id = ?", following_ids, id)
end
------------------------------------------------------------------------------------------------
following_ids

User.first.following.map(&:id)
各要素の id を呼び出し、フォローして いるユーザーの id を配列として扱うことができます。例えばデータベースの最初の
ユーザーに対して実行すると、次のような結果に。
[3, 4, 5, 6, 7, ...]

map(&:id)
よく使われ、アンパサンド(Ampersand)& と、メソッドに対応するシンボルを使った短縮表記が使えます。
この短縮表記であれば、変数 i を使 わずに済みます。
[1, 2, 3, 4].map { |i| i.to_s }
=> ["1", "2", "3", "4"]
>> [1, 2, 3, 4].map(&:to_s)
=> ["1", "2", "3", "4"]

following_ids メソッドは、has_many :following の関連付けをしたときに Active Record が自動生成したものです。
これにより、user.following コレクションに対応する id を得るためには、関連付けの名前の末尾に_ids を付け足すだけ
で済みます。
User.first.following_ids
[3, 4, 5, 6, 7, ...]
関連付けの名前の末尾に_ids を付け足すだ けで済みます。結果として、フォローしているユーザー id の文字列は、次のよう
にして取 得することができます。
User.first.following_ids.join(', ')
=> "3, 4, 5, 6, 7, ..."
------------------------------------------------------------------------------------------------
?に、following_ids, idがそれぞれ入る。

^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^
第二段階

def feed
    Micropost.where("user_id IN (:following_ids) OR user_id = :user_id",
    following_ids: following_ids, user_id: (self.)id)
end

?の部分をシンボル値で置き換えられる

^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^
第三段階

SQLは一つの文で表すのが最善。その為には、SQL のサブセレクト(subselect)を使う。
まずfollowing_idsは、このような SQL に置き換えることができます。

following_ids = "SELECT followed_id FROM relationships
                 WHERE  follower_id = :user_id"

このコードを SQL のサブセレクトとして使います。つまり、「ユーザー 1 がフォローして いるユーザーすべてを選択する」とい
うSQLを既存のSQLに内包させる形になり、結果 として SQL は次のようになります。

SELECT * FROM microposts
WHERE user_id IN (SELECT followed_id FROM relationships
                  WHERE  follower_id = 1)
      OR user_id = 1

このサブセレクトは集合のロジックを(Rails ではなく)データベース内に保存するので、 より効率的にデータを取得することが
できます。
------------------------------------------------------------------------------------------------
改めての解説

1. `where`はActiveRecordのメソッドであり、データベースから特定の条件を満たすレコードを探すために使用されます。

2. `where`の引数は文字列にすることも可能ですが、ハッシュ、配列、範囲オブジェクトなども使用できます。文字列を引数と
して使用する場合は、SQLの構文を直接書くことが可能です。

3. `where`メソッドについて詳しく説明すると：
  - `where`は条件を指定してデータを取得するためのメソッドで、検索条件を引数として渡すことでデータベースから特定の
  レコードを探します。
  - 引数にはハッシュ、文字列、配列、範囲オブジェクトなどが使用できます。例えば、`User.where(age: 20)`とすると
  、ageカラムが20のユーザーのレコードを取得します。
  - 引数として文字列を使用すると、その文字列がそのままSQLクエリの一部として使われます。この場合、プレースホルダー
  を合わせて用いて値を埋め込むこともできます。例えば、あなたが示した
  `"user_id IN (#{following_ids}) OR user_id = :user_id"`という文字列では、`following_ids`の部分が
  直接文字列として展開され、`:user_id`の部分はプレースホルダーとして使われています。
  - `where`メソッドは、結果としてActiveRecord::Relationオブジェクトを返します。このオブジェクトは配列のよう
  に扱うことができ、また他のクエリメソッドをチェインしてさらに詳細なクエリを構築することも可能です。

あなたが示した`feed`メソッドについて詳しく解説すると：
  - `following_ids = "SELECT followed_id FROM relationships WHERE follower_id = :user_id"`で、
  `relationships`テーブルから`follower_id`が`:user_id`（ここでは自分自身のid）に一致するレコードの
  `followed_id`をすべて取得するSQL文を生成しています。
  - 次に、`Micropost.where("user_id IN (#{following_ids}) OR user_id = :user_id", user_id: id)`
  で、生成したSQL文を用いて`microposts`テーブルから特定のレコードを取得しています。取得するレコードは`user_id`
  が自分がフォローしているユーザー（つまり、`following_ids`に含まれる）か、または自分自身
  （`user_id = :user_id`）であるレコードです。
  - この`feed`メソッドを用いることで、自分自身と自分がフォローしているユーザーが投稿したマイクロポストを取得する
  ことができます。

================================================================================================
16
1. `liked_posts`メソッドは、ユーザがいいねした投稿（posts）を返します。これは中間テーブル`likes`を通して行われ
ます。したがって、`user.liked_posts`とすると、そのユーザがいいねした全ての投稿を取得することができます。

2. `liked_posts`を定義する意図は、直接的にユーザと投稿の間に関連付けがない場合でも、`likes`という中間テーブルを
通してユーザがいいねした投稿を簡単に取得できるようにするためです。このようにすることで、どの投稿をユーザがいいねした
のか、という情報を簡単に取り出すことができます。

3. `through: :likes`は`likes`テーブル（中間テーブル）を経由して関連付けを行うことを指定しています。つまり、
`likes`テーブルを通じて`liked_posts`を取得します。
`source: :post`は、中間テーブル`likes`のどの関連付けを`liked_posts`の元にするのかを指定しています。つまり、
`likes`テーブルの`post`関連付けを`liked_posts`の元とします。この記述があることで、Railsは`likes`テーブルの
`post_id`を使って投稿を取得します。この`source`オプションがないと、Railsは`liked_posts`という名前から投稿を
取得しようとしますが、そのような関連付けは`likes`テーブルに存在しないため、エラーになります。

4. liked_postsという命名は、liked_postsという名前から、これが「ユーザーがいいねした投稿」を表していることが直
感的にわかります。
=end
