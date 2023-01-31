class AddPasswordDigestToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :password_digest, :string
  end
end

=begin
=        ==        ==        ==        ==        ==        ==        ==        =
has_secure_password 機能を使えるようにするには、モデル内に password_digest という属性が含
まれている必要がある

マイグレーションファイルを作成し、カラムを追加するコマンド
rails generate migration クラス名 <追加するカラムの情報>

rails generate migration add_password_digest_to_users password_digest:string
*クラス名は[AddPasswordDigestToUsers]でmigrationファイルが作成
*マイグレーション名は任意だが、上記のように、末尾を to_users にしておくと、users テーブル
にカラムを追加するマイグレーションがRails によって自動的に作成される。
*password_digest:string という引数を与えて、今回必要になる属性名（カラム名）と型情報を渡し
ています。
=end