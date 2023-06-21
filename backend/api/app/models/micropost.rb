# 1
class Micropost < ApplicationRecord
  belongs_to :user
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
=end
