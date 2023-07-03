# 1
class AddTitleToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :title, :string
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g migration AddTitleToPosts title:string で作成
=end