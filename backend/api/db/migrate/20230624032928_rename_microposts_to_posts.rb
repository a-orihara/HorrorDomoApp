class RenameMicropostsToPosts < ActiveRecord::Migration[6.1]
  def change
    rename_table :microposts, :posts
  end
end
