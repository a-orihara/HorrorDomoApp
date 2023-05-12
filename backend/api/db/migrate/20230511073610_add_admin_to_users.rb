# 1
class AddAdminToUsers < ActiveRecord::Migration[6.1]
  def change
    # 2
    add_column :users, :admin, :boolean, default: false
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g migration AddAdminToUsers admin:booleanコマンドで作成

================================================================================================
2
default: false 引数を与えない場合、 admin の値はデフォルトで nil になります が、これは false と同じ意味です
ので、必ずしもこの引数を与える必要はありません。 ただし、このように明示的に引数を与えておけば、コードの意図を Rails
と開発者に明確に示すことができます

admin 属性が追加されて論理値をとり、さらに疑問符の付いた admin?メソッドも利用できるようになリます。
=end
