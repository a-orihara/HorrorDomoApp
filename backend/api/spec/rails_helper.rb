# 1
# This file is copied to spec/ when you run 'rails generate rspec:install'
# [このファイルは、「rails generate rspec:install」を実行すると、spec/にコピーされる。]
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!
# [この行の下に追加のrequireを追加します。この時点までRailsはロードされていません！]
# 2
require 'devise'
# requireFile.expand_path("spec/support/controller_macros.rb")
require 'support/test_macros'
# require 'support/request_macros'

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
# [spec/support/ およびそのサブディレクトリにある、カスタムマッチャーやマクロなどを含むサポート用のrubyファイルが
#   必要です。
# spec/**/*_spec.rb`にマッチするファイルは、デフォルトでspecファイルとして実行されます。
# つまり、spec/supportにある_spec.rbで終わるファイルは、specとして必要かつ実行されるため、specが2度実行されるこ
# とになります。
# このグロブにマッチするファイル名を_spec.rbで終わらせないことをお勧めします。
# このパターンは、コマンドラインまたは ~/.rspec、.rspec、`.rspec-local` の --pattern オプションで設定すること
# ができます。]

# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
# [次の行は、便宜上提供されています。サポートディレクトリのすべてのファイルを自動要求するため、
#   起動時間が長くなるという欠点がある。
# 代わりに、個々の `*_spec.rb` ファイルで、必要なサポートファイルのみを手動で要求します。]
# 4 spec/support/のファイルを読み込む設定
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

# config.include RequestMacros, type: :request

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end
RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, type: :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  # 3
  config.include FactoryBot::Syntax::Methods

  # 5
  # config.include Devise::Test::ControllerHelpers, type: :request
  # config.include Devise::Test::IntegrationHelpers, type: :request
  # config.extend TestMacros, type: :request
  config.include TestMacros, type: :request
end
# Shoulda Matchersを使う際に必要な設定を行っている
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    # test_frameworkをRSpecに指定
    with.test_framework :rspec
    # libraryをRailsに指定
    with.library :rails
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
rails_helper.rbはRSpecの設定ファイルです。このファイルはRSpecテストスイートを実行する際に使用されます。

1.必要なライブラリの読み込み: rails_helper.rbファイルでは、RSpecフレームワークやRailsの必要なライブラリを読み
込みます。これにより、テスト実行環境が正しくセットアップされます。

2.Railsアプリケーションの環境設定: rails_helper.rbでは、Railsアプリケーションの環境設定を行います。これにはデ
ータベースの接続設定や環境変数の読み込みなどが含まれます。

3.テストの設定: テスト実行時の設定を行います。例えば、テストDBの作成や初期化、テストの実行前後の処理、テストカバレ
ッジの計測などが設定されます。

4.テスト環境の拡張: rails_helper.rbでは、RSpecの拡張機能や追加の設定を読み込むこともあります。これにより、テス
トコードの記述やテスト環境のカスタマイズが容易になります。

5.ファクトリボットやDBの設定: rails_helper.rbでは、テストデータの作成やDBのクリーンアップなど、テストに必要なデ
ータ関連の設定を行います。一般的には、ファクトリボットやデータベースクリーナーの設定が含まれます。

6.テストの実行方法の設定: rails_helper.rbでは、RSpecの実行方法に関する設定を行います。例えば、テストを実行する
ディレクトリの指定やフォーマットの設定などが含まれます。

================================================================================================
2
require 'devise'
Deviseを使用したテストで必要となる、Deviseのライブラリを読み込むための記述です。RSpecを使ったテストでDeviseを使
用する場合はこのようにライブラリを読み込む必要があります。

------------------------------------------------------------------------------------------------
require 'support/controller_macros'
Controllerテストでよく使われる、ログインを簡単に行うためのコントローラマクロを定義したファイルを読み込むための記
述です。コントローラマクロは、Deviseのテストヘルパーを使って、コントローラのテスト中にログイン処理を実行するため
のコードをまとめたものであり、このファイルを読み込むことでコントローラテストを書きやすくすることができます。

------------------------------------------------------------------------------------------------
require 'support/request_macros'
リクエストスペックでよく使われる、APIリクエストのテストに必要な認証トークンを取得するためのリクエストマクロを定義
したファイルを読み込むための記述です。リクエストマクロは、Devise Token Authを使って、リクエストのヘッダーに必要
な認証トークンを付与するためのコードをまとめたものであり、このファイルを読み込むことでAPIリクエストのテストを書き
やすくすることができます。

================================================================================================
3
このコードを加えることで、以下のようにrspecのテストコード中でFactory_botのメソッドを使用する際に、クラス
名の指定を省略できるようになる。
#通常FactoryBotをつけないと、メソッドを呼べない
user = FactoryBot.create(:user)

#設定を追加することで、FactoryBotの記述が省略できる。
user = create(:user)

================================================================================================
4
このコードは、spec/support ディレクトリ内のすべての .rb ファイルを読み込みます。これにより、
spec/support/controller_macros.rb および spec/support/request_macros.rb ファイル等が適切に読み込まれ、
RSpec で使用できるようになります。

================================================================================================
5
RSpecのテスト時にDeviseのヘルパーメソッドを使用する設定。
type: :requestでリクエストスペックでDeviseのヘルパーメソッドを使用できるようにする。

config.include Devise::Test::ControllerHelpers, type: :request
RSpecのコントローラテストでDeviseヘルパーメソッドを使えるようにするための設定です。
*Devise::Test::ControllerHelpers はDeviseのコントローラヘルパーメソッドを提供するモジュールです。
*config.include はRSpecの構成を変更するメソッドで、第1引数に読み込むモジュール、第2引数に読み込むテストの種類を
指定します。ここでは、コントローラテストでDeviseヘルパーメソッドを使えるように設定しています。
------------------------------------------------------------------------------------------------
config.extend はRSpecの構成を変更するメソッドで、第1引数に読み込むモジュール、第2引数に読み込むテストの種類を
指定します。ここでは、コントローラテストでControllerMacrosモジュールのメソッドを使えるように設定しています。

config.extend TestMacros, type: :request
TestMacrosはモジュール名。spec/support/test_macros.rbと、ファイル名とモジュール名が一致していると、コードの
可読性と保守性が向上。ただし、ファイル名とモジュール名が必ずしも一致する必要はありません。それらはあくまで参照のため
のラベルであり、最も重要なことはその名前がその内容を適切に表しているかどうかです。
Rubyの慣習として、ファイル名とそのファイル内で定義される主要なクラスやモジュールの名前は一致させることが一般的です。
そのため、このように設定すると、test_macros.rb ファイル内で TestMacros モジュールが定義されていると想定されま
す。つまり紐づく。
------------------------------------------------------------------------------------------------
config.includeとconfig.extendの使い分けについて：

config.includeはモジュールのメソッドをインスタンスメソッドとして取り込むために使われます。これにより、テストの各
エグザンプル（itブロック）の内部でモジュール内のメソッドを呼び出すことができます。つまり、ここでは
Devise::Test::ControllerHelpers モジュールのメソッドをリクエストスペックの各エグザンプル（itブロック）内で使
用できます。

一方、config.extendはモジュールのメソッドをクラスメソッドとして取り込むために使われます。これにより、テストの
describeやcontextブロックのレベル（つまり、テストの「クラスレベル」）でモジュール内のメソッドを呼び出すことがで
きます。したがって、ここでは TestMacros モジュールのメソッドをリクエストスペックのdescribeやcontextブロックレ
ベルで使用できます。
以上の理由から、config.includeとconfig.extendを使い分けています。それぞれのメソッドがどのレベルで使用されるか
（エグザンプルレベル、またはdescribe/contextブロックレベル）によって適切なメソッドを選ぶ必要があります。
================================================================================================

=end
