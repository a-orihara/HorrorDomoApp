# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
# [このファイルには、データベースをデフォルト値でシードするために必要なすべてのレコード作成が含まれているはずです。
# その後、bin/rails db:seedコマンドでデータをロードすることができます（または、db:setupでデータベースと一緒に作成することができます）。]

# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#1
load(Rails.root.join("db", "seeds", "#{Rails.env.downcase}.rb"))

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
環境別にseedファイルを読み込む
load(Rails.root.join("親ディレクトリ", "子ディレクトリ", "#{開発環境名.downcase}.rb))

-          --          --          --          --          --          --          --          -
# development 環境の初期データ削除
$ rails db:migrate:reset

# development 環境の初期データ追加
$ rails db:seed

# test 環境の初期データ削除
$ rails db:migrate:reset RAILS_ENV=test

# test 環境の初期データ追加
$ rails db:seed RAILS_ENV=test


=end
