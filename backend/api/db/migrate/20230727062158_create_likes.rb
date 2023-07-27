class CreateLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :likes do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps

      # 1
      t.index :user_id
      t.index :micropost_id
      # 2
      t.index [:user_id, :micropost_id], unique: true
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
`add_index`と`t.index`は、どちらもRailsのマイグレーションにおけるメソッドで、データベースのテーブルにインデック
スを追加するために使われます。
違いは以下の通りです：
- `add_index`は`change`または`up`メソッドの中で使われます。これは既存のテーブルに対してインデックスを追加したり
、削除したりする場合に使用します。
- `t.index`は`create_table`ブロックの中で使われます。新しいテーブルを作成する際に、その作成プロセスの中で直接イ
ンデックスを追加する場合に使用します。

両者の挙動は基本的に同じです。どちらもデータベースにインデックスを追加し、データの読み出し速度を向上させるために使用
します。適用するタイミングや文脈が違うだけです。

================================================================================================
2
[db/migrate/20230711103017_create_relationships.rb]の2の説明を参照
=end
