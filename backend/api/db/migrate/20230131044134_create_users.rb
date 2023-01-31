# 1
class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @
1
マイグレーションファイル名の先頭には、それが生成された時間のタイムスタンプが追加されます。
マイグレーション自体は、データベースに与える変更を定義した change メソッド の集まりです。

-          --          --          --          --          --          --          -
change メソッドは create_table という Rails の メソッドを呼び、ユーザーを保存するためのテー
ブルをデータベースに作成します。

-          --          --          --          --          --          --          -
create_table メソッドはブロック変数を1つ持つブロックを受け取ります。 ここでは(“table”の頭文字を取って)
tです。そのブロックの中で create_table メソッドは tオブジェクトを使って、nameとemailカラムをデータベー
スに作ります。t オブジェクトが具体的に何をしているのかを正確に知る必要はありません。

-          --          --          --          --          --          --          -
t.timestamps は特別なコマンドで、created_at と updated_at と いう2つの「マジックカラム(Magic Columns)
」を作成します。これらは、あるユーザー が作成または更新されたときに、その時刻を自動的に記録するタイムスタンプで
す。
=end