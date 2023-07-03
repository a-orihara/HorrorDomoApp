# 1
class Post < ApplicationRecord
  # 2
  belongs_to :user
  # 3 { self.order(created_at: :desc) }のselfが省略されている
  default_scope -> { order(created_at: :desc) }
  # belongs_to :userで自動的にuser_idが設定され、マイグレーションでnilチェックしているが、明示的に記載
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }
  validates :title, presence: true, length: { maximum: 20 }
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g model Post content:text user:referencesで作成
user:references（references型）は、Postモデルに対してuserという関連を作成するためのオプションです。
user:referencesを指定することで、Postモデルに自動的にインデックスと外部キー参照付きの user_id カラムが
追加されます。
されます。belongs_to :userがモデルクラスに追加されます。

================================================================================================
2
belongs_to :user
Postは必ず一人のuserに属する。
------------------------------------------------------------------------------------------------
belongs_to/has_many 関連付けを使うことで下記メソッドが生成される。
post.user
Post に紐付いた User オブジェクトを返す
------------------------------------------------------------------------------------------------
user.posts
User のマイクロポストの集合をかえす
------------------------------------------------------------------------------------------------
user.posts.create(arg)
userに紐付いたマイクロポストを作成する
------------------------------------------------------------------------------------------------
user.posts.create!(arg)
userに紐付いたマイクロポストを作成する(失敗時に例外を発生)
------------------------------------------------------------------------------------------------
user.posts.build(arg)
userに紐付いた新しい Post オブジェクトを返す。
new メソッドと同様に、build メソッドはオブジェクトを返しますがデータベース には反映されません。
*@post = Post.new(content: "Lorem ipsum", user_id: @user.id)
=@post = @user.posts.build(content: "Lorem ipsum")
------------------------------------------------------------------------------------------------
user.posts.find_by(id:  1)
userに紐付いていて、id が 1 であるマイクロポストを検索する

================================================================================================
3
ラムダ式(Stabby lambda)
->{ }
RubyのProcオブジェクト。ざっくり処理の塊を変数に入れるという意味。その変数を呼び出して処理を実行できるようになる。
これは、Proc や lambda(もしくは無名関数)と呼ばれるオブジェクトを作成する文法です。 ->というラムダ式は、ブロック
を引数に取り、Proc オブジェクトを返します。
------------------------------------------------------------------------------------------------
*下記のように使う
a = -> { puts "こんにちは"}
a.call
------------------------------------------------------------------------------------------------
default_scope
ActiveRecordのメソッドで、モデルに対する全てのクエリで適用されるデフォルトのスコープ（範囲）を設定します。
引数としてブロックを取り、そのブロック内でスコープに関する処理を定義します。

デフォルトのスコープ（default scope）とは、あるモデルに対するデータベースのクエリが実行される際に、常に適用される
条件やソートの設定のことを指します。
例えば、特定のカラムでソートする、特定の条件を満たすレコードだけを取得する、といった設定がこれに該当します。

このデフォルトスコープは、そのモデルに関連する全てのデータベース操作（SELECT, UPDATE, DELETEなど）に対して適用
されます。
具体的には、そのモデルを使ってデータを取得するときや更新するときなどに、デフォルトスコープで設定した条件が自動的に適
用されます。

この特性を利用することで、特定のモデルに対する操作に一貫性を持たせることができます。しかし、常に適用されるため、デフ
ォルトスコープを設定する際は慎重になるべきです。例えば、ある特定の条件のレコードしか取得しないようなデフォルトスコー
プを設定してしまうと、その条件に合致しないレコードにアクセスできなくなるといった問題が起きる可能性があります。
------------------------------------------------------------------------------------------------
order
ActiveRecordのメソッドで、取得したレコードを特定のカラムに基づいてソート（並び替え）するためのクエリを設定します。
引数としては、ハッシュ形式でソートの基準となるカラム名とソート順を指定します。
------------------------------------------------------------------------------------------------
(created_at: :desc)はハッシュの形式で、:created_atカラムを降順（:desc）でソートすることを意味します。
これにより、新しい投稿から順にデータを取得することができます。







=end
