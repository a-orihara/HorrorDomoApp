# RspecのRails特有の設定を記述するファイル

# This file is copied to spec/ when you run 'rails generate rspec:install'
# [このファイルは、'rails generate rspec:install' を実行すると spec/ にコピーされます。]
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
# [環境がproductionの場合、データベースの切り詰めを防止する]
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!
# [この行の下に追加のrequireを追加します。この時点までRailsはロードされていません!]

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
# [spec/support/ およびそのサブディレクトリにある、カスタムマッチャーやマクロなどを含むサポート用
# Rubyファイルが必要です。spec/**/*_spec.rb` にマッチするファイルは、デフォルトで spec ファイル
# として実行されます。つまり、spec/supportにある_spec.rbで終わるファイルは、specとして要求され、
# 実行されるので、specが2度実行されることになります。このグロブにマッチするファイル名を_spec.rbで
# 終わらないようにすることをお勧めします。このパターンはコマンドラインの--patternオプション、また
# は~/.rspec、.rspec、`.rspec-local`で設定することができます。]
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

  # 1
  config.include FactoryBot::Syntax::Methods
end

=begin
=        ==        ==        ==        ==        ==        ==        ==        ==        =
1
#このコードを加えることで、以下のようにrspecのテストコード中でFactory_botのメソッドを使用する際に、クラス
名の指定を省略できるようになる。
#通常FactoryBotをつけないと、メソッドを呼べない
user = FactoryBot.create(:user)

#設定を追加することで、FactoryBotの記述が省略できる。
user = create(:user)

=end
