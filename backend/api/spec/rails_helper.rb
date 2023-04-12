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
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
# Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

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

require 'support/request_macros'
リクエストスペックでよく使われる、APIリクエストのテストに必要な認証トークンを取得するためのリクエストマクロを定義
したファイルを読み込むための記述です。リクエストマクロは、Devise Token Authを使って、リクエストのヘッダーに必要
な認証トークンを付与するためのコードをまとめたものであり、このファイルを読み込むことでAPIリクエストのテストを書き
やすくすることができます。
=end