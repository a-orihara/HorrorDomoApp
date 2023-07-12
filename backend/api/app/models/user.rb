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
  # 5
  has_many :posts, dependent: :destroy
  # 7
  has_many :active_relationships, class_name: "Relationship",
                                  foreign_key: "follower_id",
                                  dependent: :destroy,
                                  # 8
                                  inverse_of: :follower
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
has_many  <Model（クラス）名>で、そのクラス名を使ったメソッドが複数生成されます。
そのメソッドはUserモデルを通して関連するPostモデルを取得するためのものです。
つまり、Userモデルを通じて関連するPostモデルを取得することができます。これは、Userモデルが複数のPostモデルと関連
付けられていることを意味します。
具体的には、Userインスタンスから関連するすべてのPostインスタンスを取得することができます。
------------------------------------------------------------------------------------------------
has_many :postsで、自動で外部キーが設定される。
外部キー（2つのテーブルを繋ぐ）はuser_idです。この外部キーはPostモデルに付与されます。
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
。
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
=end
