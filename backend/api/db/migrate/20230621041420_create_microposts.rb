# 1
class CreateMicroposts < ActiveRecord::Migration[6.1]
  def change
    create_table :microposts do |t|
      t.text :content
      # 1.1
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    # 2
    add_index :microposts, [:user_id, :created_at]
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails g model Micropost content:text user:referencesで作成
t.references :user, null: false(デフォ), foreign_key: trueを自動作成
user:references（references型）は、Micropostモデルに対してuserという関連を作成するためのオプションです。
user:referencesを指定することで、Micropostモデルに自動的にインデックスと外部キー参照付きの user_id カラムが
追加されます。
規約に則った場合、つまり{モデル名_id}がそのまま使える場合に限り、user:referencesが使える。
されます。belongs_to :userがモデルクラスに追加されます。

================================================================================================
1.1
`t.references`は外部キーとしての関連付けを設定するために使われる。規約に則った場合、つまり{モデル名_id}がそのま
ま使える場合に限り、user:referencesが使える。

================================================================================================
2
add_index
指定したテーブルにインデックスを追加。インデックスとは、データベースの検索性能を向上させるためのデータ構造。
------------------------------------------------------------------------------------------------
:micropostsと[:user_id, :created_at]の2つの引数
:micropostsはインデックスを追加するテーブルを指定します。
[:user_id, :created_at]はインデックスを作成するフィールドを指定します。user_id と created_at の両方を1つの
配列に含めている。こうすることで Active Record は、両方のキーを同時に扱う複合キーインデックス
(Multiple Key Index)作成します。
------------------------------------------------------------------------------------------------
micropostsテーブルにuser_idとcreated_atの組み合わせのインデックスが作成されます。
これにより、user_idとcreated_atでソートした検索が高速化されます。
ユーザーごとに投稿を作成日時の順に効率よく検索するためです。
例えば、ユーザーのプロフィールページにそのユーザーの投稿を新しいものから順に表示する機能があるとします。この時、
user_idとcreated_atでソートした検索が行われます。この検索を高速化するためには、user_idとcreated_atの組み合わ
せのインデックスが有効です。
------------------------------------------------------------------------------------------------
1. 複合キーインデックスとは：
- 複合キーインデックスとは、2つ以上の列を組み合わせて作られるインデックスです。
- これにより、その組み合わせでの検索やソートが高速化されます。
- ただし、複合キーインデックスの各列に対する検索速度の向上は、そのインデックスの列の順序に依存します。

2. `add_index :microposts, [:user_id, :created_at]`でのインデックスの紐付け：
- `[:user_id, :created_at]`と指定することで、user_idとcreated_atの組み合わせをキーとするインデックスが作成
されます。
- 具体的には、user_idとcreated_atのペアの値が一意になるようなインデックスが作成されます。
- 例えば、user_idが1のユーザーが複数の投稿を行った場合、各投稿のcreated_atと組み合わせた値がインデックスのキー
となります。
- この結果、特定のユーザーの投稿を作成日時の順序で素早く検索することが可能となります。
=end