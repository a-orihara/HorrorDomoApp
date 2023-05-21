class AddProfileToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :profile, :string
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g migration AddProfileToUsers profile:stringで、
<番号>_add_profile_to_users.rbというファイルが作成
class名は、class AddProfileToUsers < ActiveRecord::Migration[6.1]
=end