#環境別にseed ファイルを読み込む
load(Rails.root.join("db", "seeds", "#{Rails.env.downcase}.rb"))

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
seed ファイルの読み込みディレクトリを指定しています。
#seeds.rb の読み込み処理の詳細
load(Rails.root.join("親ディレクトリ", "子ディレクトリ", "#{開発環境名.downcase}.rb))
------------------------------------------------------------------------------------------------
# development 環境の初期データ削除
$ rails db:migrate:reset

# development 環境の初期データ追加
$ rails db:seed

# test 環境の初期データ削除
$ rails db:migrate:reset RAILS_ENV=test

# test 環境の初期データ追加
$ rails db:seed RAILS_ENV=test
------------------------------------------------------------------------------------------------
環境別にコンソールを立ち上げて初期データの件数を確認します。
-e オプションをつける事で環境別にコンソールを立ち上げます。

#development 環境で初期データ件数の確認
$ rails console

#test 環境で初期データ件数の確認
$ rails console -e test
------------------------------------------------------------------------------------------------
1. **`Rails.root`**:
- `Rails.root`はRailsアプリケーションのルートディレクトリへのパスを返します。
2. **`Rails.env.downcase`**:
- `Rails.env`は現在の実行環境（development、test、productionなど）を返します。
- `downcase`メソッドによって、この文字列を小文字に変換します。
3. **`Rails.root.join("db", "seeds", "#{Rails.env.downcase}.rb")`**:
- `join`メソッドによって、上記のパスに`"db", "seeds", "#{Rails.env.downcase}.rb"`を連結しています。
- 例: development環境でアプリケーションのルートが`/path/to/app`であれば、この部分は
`/path/to/app/db/seeds/development.rb`を返します。
4. **`load`メソッド**:
- `load`メソッドは指定されたRubyファイルを読み込み、実行します。
- このコードの場合、現在の環境に対応するseedファイルを読み込み、実行します。
このコードは環境別にseedファイルを読み込むことを可能にしています。

=end