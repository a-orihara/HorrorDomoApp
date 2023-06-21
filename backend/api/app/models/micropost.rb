# 1
class Micropost < ApplicationRecord
  # 2
  belongs_to :user
  # マイグレーションでnilチェックしているが、明示的に記載
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g model Micropost content:text user:referencesで作成
user:references（references型）は、Micropostモデルに対してuserという関連を作成するためのオプションです。
user:referencesを指定することで、Micropostモデルに自動的にインデックスと外部キー参照付きの user_id カラムが
追加されます。
されます。belongs_to :userがモデルクラスに追加されます。
================================================================================================
2
belongs_to :user
Micropostは必ず一人のuserに属する。
------------------------------------------------------------------------------------------------
belongs_to/has_many 関連付けを使うことで下記メソッドが生成される。
micropost.user
Micropost に紐付いた User オブジェクトを返す
------------------------------------------------------------------------------------------------
user.microposts
User のマイクロポストの集合をかえす
------------------------------------------------------------------------------------------------
user.microposts.create(arg)
userに紐付いたマイクロポストを作成する
------------------------------------------------------------------------------------------------
user.microposts.create!(arg)
userに紐付いたマイクロポストを作成する(失敗時に例外を発生)
------------------------------------------------------------------------------------------------
user.microposts.build(arg)
userに紐付いた新しい Micropost オブジェクトを返す。
new メソッドと同様に、build メソッドはオブジェクトを返しますがデータベース には反映されません。
*@micropost = Micropost.new(content: "Lorem ipsum", user_id: @user.id)
=@micropost = @user.microposts.build(content: "Lorem ipsum")
------------------------------------------------------------------------------------------------
user.microposts.find_by(id:  1)
userに紐付いていて、id が 1 であるマイクロポストを検索する






=end
