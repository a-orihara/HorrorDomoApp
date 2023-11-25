# 1
require "active_support/core_ext/integer/time"

# 2
Rails.application.configure do
  # [ここで指定した内容は、config/application.rbで指定した内容より優先されます。]

  # [開発環境では、アプリケーションのコードが変更されるたびに再読み込みされます。
  # このため、レスポンスタイムは遅くなりますが、コードを変更する際にWebサーバーを再起動する必要がないため、
  # 開発環境としては最適です。デフォ：false]
  config.cache_classes = false

  # [ブート時にコードを熱心に読み込まない。デフォ：false]
  config.eager_load = false

  # [完全なエラーレポートを表示。デフォ：true]
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  # [アップロードされたファイルをローカルファイルシステムに保存します（オプションはconfig/storage.ymlを参照）。]
  config.active_storage.service = :local

  # [メーラーが送れなくとも気にしない。デフォ：false]
  # 5 メールの送信エラーが発生した際に例外（エラー）を発生させるかどうかを指定
  config.action_mailer.raise_delivery_errors = true
  # 5.1 開発環境でメール内で生成されるURLがlocalhost:3000となるように指定
  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
  # メールの送信元アドレスを設定
  config.action_mailer.default_options = { from: ENV['EMAIL_ADDRESS'] }
  # メールの送信方法をSMTP（Simple Mail Transfer Protocol）に設定
  config.action_mailer.delivery_method = :smtp
  # 4 SMTPの設定
  config.action_mailer.smtp_settings = {
    # SMTPサーバーのアドレスを指定。
    address: 'smtp.gmail.com',
    # SMTPサーバーのポート番号を指定。
    port: 587,
    # HELOコマンドで使用するドメインを指定
    domain: 'gmail.com',
    # SMTPサーバーへの認証に使用するユーザー名を指定
    user_name: ENV['EMAIL_ADDRESS'],
    # SMTPサーバーへの認証に使用するパスワードを指定
    password: ENV['EMAIL_PASSWORD'],
    # 認証方式を指定しています。この場合、PLAIN認証が使用されます。
    authentication: 'plain',
    # STARTTLSコマンドを使用してTLS(Transport Layer Security)接続を自動的に開始するかどうかを指定
    enable_starttls_auto: true
  }

  config.action_mailer.perform_caching = false

  # [Railsのロガーに非推奨のお知らせを出力する。 デフォ::log]
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true


  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
end
=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
/config/environments/development.rbとは、Railsの開発環境設定を行うためのファイルです。
このファイルには、開発環境特有の設定を書くことができます。
例えば、デバッグ情報の表示、エラー発生時の挙動、メール送信の設定などがここで行われます。

================================================================================================
2
Rails.application.configure do endとは、Railsアプリケーションの設定を行うためのブロックです。
doとendの間に設定を書くことで、アプリケーションの設定を変更することができます。
================================================================================================
3
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
Railsが生成するURLのデフォルトのホスト名とポート番号を設定しています。
この設定は、主にActionMailer（Railsのメール送信機能）で使用されます。
------------------------------------------------------------------------------------------------
host: 'localhost'：Railsが生成するURLのホスト名をlocalhostに設定しています。
例えば、メール内にアプリケーションのリンクを含める場合、このホスト名が使用されます。
port: 3000：Railsが生成するURLのポート番号を3000に設定しています。
開発環境では通常、Railsアプリケーションはポート3000で実行されるため、この設定が必要です。
================================================================================================
4
address: 'smtp.gmail.com'
smtp.gmail.comはGmailのSMTPサーバーのホスト名。メール送信サーバーをGmailに指定。
------------------------------------------------------------------------------------------------
port: 587
SMTPサーバーのポート番号を指定。587はSTARTTLSを利用するSMTPのための標準的なポート番号。
この設定は、GmailのSMTPサーバーとの通信を行う際にどのポートを使用するかを指定するためのものです。
------------------------------------------------------------------------------------------------
domain: 'gmail.com'
HELOコマンドで使用するドメインを指定。
HELOコマンドとはSMTP通信において最初に送信されるコマンドで、送信元のホスト名をサーバーに通知するためのものです。
domain: 'gmail.com'という設定は、HELOコマンドで使用するホスト名を指定するためのもので、GmailのSMTPサーバーとの
通信に適合するように'gmail.com'を指定しています
------------------------------------------------------------------------------------------------
authentication: 'plain'
認証方式をPLAIN認証に指定。
plain認証は、ユーザ名とパスワードをBase64エンコーディングで送信するSMTPの認証方式です。この設定は、SMTPサーバー
への接続認証を行う方式を指定するためのもので、GmailのSMTPサーバーではplain認証が用いられます。
------------------------------------------------------------------------------------------------
enable_starttls_auto: true
STARTTLSコマンドを使用してTLS(Transport Layer Security)接続を自動的に開始するかどうかを指定。
STARTTLSコマンドとは、SMTP通信を行っている途中で暗号化通信（TLSまたはSSL）に切り替えるためのコマンドです。
SMTP通信を開始する際に自動的にSTARTTLSコマンドを送信し、TLS接続を開始するかどうかを指定するものです。
これにより、メールの送信処理が暗号化され、安全に行われます。
================================================================================================
5
config.action_mailer.raise_delivery_errors = false
メールの送信エラーが発生した際に例外（エラー）を発生させるかどうかを設定
falseに設定すると、メールの送信に失敗したとしてもRailsは例外を発生させません。つまり、メールの送信失敗がアプリケー
ションの動作に影響を及ぼさないようになります。
ただし、この設定が原因でメールの送信エラーが静かに無視され、問題が見逃される可能性があります。そのため、開発環境やテ
スト環境ではエラーを発見しやすいようtrueに設定することが多いです。

================================================================================================
5.1
config.action_mailer.default_url_options
ActionMailerを使用してメールを送信する際、リンクやURLを生成するための基本的なURLを生成する際の基本設定を定義しま
す。
hostとportの指定により、メール内で使用されるURLのベース部分が設定されます。
------------------------------------------------------------------------------------------------
{ host: 'localhost', port: 3000 }
railsコンテナが3000で待ち受けているので、3000を指定。ホスト側の3010ではない。
------------------------------------------------------------------------------------------------
Action Mailerは、Ruby on Rails に標準で組み込まれているメールの送信機能です。
例えばメールマガジンを一括メール送信など、メールの作成、送信、テンプレート管理などを担当し、Railsアプリケーションで
メール関連の処理を簡単に行えるように設計されています。モデル、ビュー、コントローラ（MVC）の原則に従い、メール送信の
ためのロジックをカプセル化します。

=end