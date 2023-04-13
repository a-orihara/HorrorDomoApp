# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!
# [この行の下に追加のrequireを追加します。この時点までRailsはロードされていません！]
# 1
require 'devise'
require 'support/controller_macros'
require 'support/request_macros'

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
# 3
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

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
  # 2
  config.include FactoryBot::Syntax::Methods
  # 4
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.extend ControllerMacros, type: :controller
  config.include RequestMacros, type: :request
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
require 'devise'
Deviseを使用したテストで必要となる、Deviseのライブラリを読み込むための記述です。DeviseはRailsでよく使われる認
証機能を提供するGemであり、RSpecを使ったテストでDeviseを使用する場合はこのようにライブラリを読み込む必要があり
ます。
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
2
このコードを加えることで、以下のようにrspecのテストコード中でFactory_botのメソッドを使用する際に、クラス
名の指定を省略できるようになる。
#通常FactoryBotをつけないと、メソッドを呼べない
user = FactoryBot.create(:user)

#設定を追加することで、FactoryBotの記述が省略できる。
user = create(:user)

================================================================================================
3
このコードは、spec/support ディレクトリ内のすべての .rb ファイルを読み込みます。これにより、
spec/support/controller_macros.rb および spec/support/request_macros.rb ファイル等が適切に読み込まれ、
RSpec で使用できるようになります。

================================================================================================
4
RSpecのコントローラテストでDeviseヘルパーメソッドを使えるようにするための設定です。
:controller タイプのテストで Devise::Test::ControllerHelpers と ControllerMacros が利用可能になり、
:request タイプのテストで RequestMacros が利用可能になります。

config.include Devise::Test::ControllerHelpers, type: :controller
RSpecのコントローラテストでDeviseヘルパーメソッドを使えるようにするための設定です。
*Devise::Test::ControllerHelpers はDeviseのコントローラヘルパーメソッドを提供するモジュールです。
*config.include はRSpecの構成を変更するメソッドで、第1引数に読み込むモジュール、第2引数に読み込むテストの種類を
指定します。ここでは、コントローラテストでDeviseヘルパーメソッドを使えるように設定しています。

config.extend ControllerMacros, type: :controller
RSpecのコントローラテストでControllerMacrosモジュールのメソッドを使えるようにするための設定です。
*ControllerMacros は、RSpecのコントローラテストでよく使われるメソッドをまとめたモジュールです。
*config.extend はRSpecの構成を変更するメソッドで、第1引数に読み込むモジュール、第2引数に読み込むテストの種類を
指定します。ここでは、コントローラテストでControllerMacrosモジュールのメソッドを使えるように設定しています。
*config.include は、インスタンスレベルでメソッドを利用できるようにするのに対して、config.extend はクラスレベ
ルでメソッドを利用できるようにします。
ControllerMacros モジュール内の login_user メソッドは、RSpec の「before」フックなどで使用されることが想定さ
れています。これらのフックは、クラスレベルで実行されるため、config.extend を使用して、クラスレベルで login_user
メソッドを利用できるようにする必要があります。
config.extend を使用することで、ControllerMacros モジュール内のメソッドが他のインスタンスメソッドと衝突するこ
とを防ぐことができます。

config.include RequestMacros, type: :request
RSpecのリクエストテストでRequestMacrosモジュールのメソッドを使えるようにするための設定です。
*RequestMacros は、RSpecのリクエストテストでよく使われるメソッドをまとめたモジュールです。
*config.include はRSpecの構成を変更するメソッドで、第1引数に読み込むモジュール、第2引数に読み込むテストの種類を
指定します。ここでは、リクエストテストでRequestMacrosモジュールのメソッドを使えるように設定しています。
=end
