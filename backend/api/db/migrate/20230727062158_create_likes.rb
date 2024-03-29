class CreateLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :likes do |t|
      # 1
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps

      # 2,3
      t.index [:user_id, :post_id], unique: true
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
`t.references`はActiveRecordのMigrationで使用され、2つの役割を持っています。一つ目は指定した名前のカラムを作
成すること、二つ目はそのカラムにインデックスを自動的に作成することです。
そのため、`t.references :user`と書いた場合、`user_id`というカラムが作成され、その上にインデックスが自動的に作
成されます。
`t.references :user`と`t.references :post`でそれぞれ`user_id`と`post_id`に対するインデックスが作成されて
います。
------------------------------------------------------------------------------------------------
一方、`t.integer`は単に整数型のカラムを作成します。この方法で作成したカラムにインデックスを付けるには、明示的に、
`add_index`を使用する必要があります。

================================================================================================
2
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
3
[db/migrate/20230711103017_create_relationships.rb]の2の説明を参照
=end
