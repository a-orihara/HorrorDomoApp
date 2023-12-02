require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false

  # Ensures that a master key has been made available in either ENV["RAILS_MASTER_KEY"]
  # or in config/master.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = 'http://assets.example.com'

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Store uploaded files on the local file system (see config/storage.yml for options).
  # [アップロードされたファイルはローカルのファイルシステムに保存されます (オプションはconfig/storage.ymlを参照)。]
  # amazonに変更
  config.active_storage.service = :amazon

  # Mount Action Cable outside main process or domain.
  # config.action_cable.mount_path = nil
  # config.action_cable.url = 'wss://example.com/cable'
  # config.action_cable.allowed_request_origins = [ 'http://example.com', /http:\/\/example.*/ ]

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Include generic and useful information about system operation, but avoid logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII).
  # [システム操作に関する一般的で有用な情報を含めるが、個人を特定できる情報（PII）の不用意な露出を避けるため、
  # 多くの情報を記録することは避ける。]
  config.log_level = :info

  # Prepend all log lines with the following tags.
  config.log_tags = [ :request_id ]

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # config.active_job.queue_adapter     = :resque
  # config.active_job.queue_name_prefix = "api_app_production"

  config.action_mailer.perform_caching = false
  # 1.1 メールの送信元アドレスを設定
  config.action_mailer.default_options = { from: "no-reply@horror-domo-app.com" }
  config.action_mailer.default_url_options = { host: "https://horror-domo-app.com" }
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: "smtp.gmail.com",
    port: 587,
    domain: "gmail.com",
    # 1.2 1.3 1.4 Rails.application.credentials.production[:gmail][:user_name]でも可
    user_name: Rails.application.credentials[:production][:gmail][:user_name],
    password: Rails.application.credentials[:production][:gmail][:password],
  #   authentication: "plain",
  #   enable_starttls_auto: true,
  }

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Log disallowed deprecations.
  config.active_support.disallowed_deprecation = :log

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Use a different logger for distributed setups.
  # require "syslog/logger"
  # config.logger = ActiveSupport::TaggedLogging.new(Syslog::Logger.new 'app-name')

  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Inserts middleware to perform automatic connection switching.
  # The `database_selector` hash is used to pass options to the DatabaseSelector
  # middleware. The `delay` is used to determine how long to wait after a write
  # to send a subsequent read to the primary.
  #
  # The `database_resolver` class is used by the middleware to determine which
  # database is appropriate to use based on the time delay.
  #
  # The `database_resolver_context` class is used by the middleware to set
  # timestamps for the last write to the primary. The resolver uses the context
  # class timestamps to determine how long to wait before reading from the
  # replica.
  #
  # By default Rails will store a last write timestamp in the session. The
  # DatabaseSelector middleware is designed as such you can define your own
  # strategy for connection switching and pass that into the middleware through
  # these configuration options.
  # config.active_record.database_selector = { delay: 2.seconds }
  # config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
  # config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
このメールアドレスは通常、自動生成されるメールからの返信を受け付けないことを示すために "no-reply" という名前が含
まれています。
返信を避ける: "no-reply" という名前からも分かるように、このメールアドレスは通常、ユーザーからの返信メールを受け付
けないことを意味します。アプリケーションが送信したメールは、通常の問い合わせやサポートリクエストに対するものではなく
、情報提供や通知のために使用されることが多いためです。

================================================================================================
1.2
user_name: Rails.application.credentials.production.gmail.user_name,
credentialsファイルのproductionキー（本番環境）のgmail.user_nameを取得。user_nameキーにgmailのアドレスを格
納している

================================================================================================
1.3
. **credentialsに直接アプリパスワードを書いてもいいの？**
- Railsの`credentials`機能を使用する場合、秘密情報（例えばアプリパスワード）を安全に保存することができます。これ
らの情報は暗号化されたファイル（`credentials.yml.enc`）に保存されるため、GitHubにpushしても安全です。秘密情報
は、`credentials:edit`コマンドを使って編集することができ、この時に使用する`master.key`はリポジトリに含めないよ
うにする必要があります。
------------------------------------------------------------------------------------------------
. **Railsの`/config/credentials.yml.enc`はどういう役割があるの？**
- `credentials.yml.enc`はRailsアプリケーションの秘密情報（例えばAPIキー、データベースパスワード、外部サービス
の認証情報など）を安全に保存するための暗号化されたファイルです。このファイルは`rails credentials:edit`コマンド
で編集でき、内容は`Rails.application.credentials`を通じてアクセス可能です。これにより、秘密情報をコードベース
から分離し、セキュリティを強化できます。
------------------------------------------------------------------------------------------------
. **`credentials.yml.enc`の`.enc`の意味は？**
- `.enc`は「encrypted」（暗号化された）の略です。これは、ファイルの内容が暗号化されていることを示しています。暗
号化されたファイルは、対応する`master.key`がなければ内容を読み取ることはできません。このため、`master.key`は秘
密にしておく必要があり、特に公開リポジトリには含めないようにします。

================================================================================================
1.4
docker-compose -f docker-compose.dev.yml run --rm api EDITOR="vi" rails credentials:edit
------------------------------------------------------------------------------------------------
backend/api/config/credentials.yml.enc

production:
  .
  .
  gmail:
    user_name: xxxxxxxxx@gmail.com
    password: xxxxxxxxxxxxxxxxxxxx
------------------------------------------------------------------------------------------------
production: gmail: について
* production: gmail: の部分は、Railsのcredentialsファイル内で特定の環境（この場合は本番環境）に特有の設定を
行うための構造です。ここで設定されるgmailキーは、GmailのSMTPサーバーを使用するためのユーザー名（メールアドレス）
とパスワードを格納するために使用されます。
* credentialsファイルは、環境ごとに異なる秘密情報（例えばAPIキー、メールアドレス、パスワードなど）を安全に保存す
るための暗号化されたファイルです。このファイル内で設定されるキーと値は、アプリケーションのコード内で安全に参照する
ことができます。
* このように書く意図は、本番環境特有のメール設定を分離し、秘密情報をコードベースから分離して安全に管理することです。
この場合、Gmailのユーザー名とパスワードは、本番環境でのみ使用され、開発やテスト環境では使用されません。
=end
