require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ApiApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.time_zone = 'Tokyo'
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # rspecでgenerator使用時にスペックファイルを作成するかどうかの設定
    config.generators do |g|
      g.test_framework :rspec,
        # ヘルパーファイル用のスペックを作成しない
        helper_specs: false,
        # ルーティング(config/routes)用のスペックファイルを作成しない
        routing_specs: false,
        # ビュースペックを作成しない。フィーチャースペック、またはフロント側でUIをテストする為
        view_specs: false
    end

    # Rackミドルウェアを使用してCORS（Cross-Origin Resource Sharing）ポリシーを設定
    config.middleware.insert_before 0, Rack::Cors do
      # 許可されるCORSリクエストについての設定
      allow do
        # origins '*'すべてのオリジンからのリクエストを許可（なぜかrspecだと使えないため）
        # origins Settings.front_domain || '*'
        origins '*'
        # すべてのリソースに対するCORSポリシーを指定
        resource '*',
                  # すべてのヘッダーを許可
                  :headers => :any,
                  # CORSリクエストに含まれるヘッダーの内、許可されるヘッダーを指定
                  :expose => ['access-token', 'expiry', 'token-type', 'uid', 'client'],
                  # 許可されるHTTPメソッドを指定
                  :methods => [:get, :post, :options, :delete, :put, :show, :patch]
      end
    end
    # 2
    config.i18n.default_locale = :ja
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
このコードは、Rack::Corsを使ってCORS（Cross-Origin Resource Sharing）を設定するためのものです。allowブロ
ック内にある設定によって、許可されたオリジン、許可されたHTTPメソッド、許可されたヘッダーなどが定義されています。

CORSは、異なるオリジン間でWebアプリケーションのリソースにアクセスするための仕組みであり、セキュリティを維持するた
めに必要です。この設定は、アプリケーションのサーバーが異なるオリジンからのリクエストを受け入れるための設定であり、
異なるオリジンからのアクセスを許可するために必要な設定が含まれています。

一般的には、CORSを設定する際には、許可するオリジン、HTTPメソッド、ヘッダーの設定を行うことが多いです。また、
Railsアプリケーションでは、Rack::Corsを使ってCORSを設定することが一般的です。

================================================================================================
2
config.i18n.default_locale = :ja
Railsアプリケーションのデフォルトのロケール（言語設定）を日本語（ja）に設定する。
この設定により、アプリケーション内で使用されるテキストやメッセージがデフォルトで日本語になります。エラーメッセージや
フラッシュメッセージなどのテキストが日本語で表示されます。

================================================================================================
=end