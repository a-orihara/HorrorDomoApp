# frozen_string_literal: true

# Rails 5.0 以降を使用している場合は、User < ActiveRecord::Baseから変更。
class User < ApplicationRecord
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  # 4
  include DeviseTokenAuth::Concerns::User
  # 1 ↓validates(:name, { presence: true, length: { maximum: 30 } })の省略形
  validates :name,  presence: true, length: { maximum: 30 }
  # 2
  validates :email, length: { maximum: 255 }
  # presence: trueがないので、プロフィールが空でもいい
  validates :profile, length: { maximum: 160 }
  # 3
  has_one_attached :avatar
  # 5
  has_many :posts, dependent: :destroy
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
dependent: :destroy
ユーザーが削除されたときに、そ のユーザーに紐付いた(そのユーザーが投稿した)マイクロポストも一緒に削除されるようにな
ります。
これは、管理者がシステムからユーザーを削除したとき、持ち主の存在しないマイクロポストがデータベースに取り残されてしま
う問題を防ぎます。
=end
