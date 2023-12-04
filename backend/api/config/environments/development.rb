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
  # メールの送信元アドレスを設定
  config.action_mailer.default_options = { from: ENV['EMAIL_ADDRESS'] }
  # ↓デモ用の設定
  # config.action_mailer.default_options = { from: "no-replay@example.com" }
  # 5.1 5.2 5.3 開発環境でメール内で生成されるURLがlocalhost:3010となるように指定
  config.action_mailer.default_url_options = { host: 'localhost', port: 3010 }
  # 5.4
  # メールの送信方法をSMTP（Simple Mail Transfer Protocol）に設定
  config.action_mailer.delivery_method = :smtp
  # ↓デモ用の設定
  # config.action_mailer.delivery_method = :letter_opener_web
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
Deviseが生成した一意の認証トークン`?confirmation_token=[トークン]`の送付先URLの指定
ActionMailerを使用してメールを送信する際、リンクやURLを生成するための基本的なURLを生成する際の基本設定を定義しま
す。
hostとportの指定により、メール内で使用されるURLのベース部分が設定されます。
このURLはmailをクリックした際のリダイレクト先です。
------------------------------------------------------------------------------------------------
{ host: 'localhost', port: 3010 }
ホスト側の3010がrailsコンテナが3000で待ち受けるので、3010を指定。
------------------------------------------------------------------------------------------------
Action Mailerは、Ruby on Rails に標準で組み込まれているメールの送信機能です。
例えばメールマガジンを一括メール送信など、メールの作成、送信、テンプレート管理などを担当し、Railsアプリケーションで
メール関連の処理を簡単に行えるように設計されています。モデル、ビュー、コントローラ（MVC）の原則に従い、メール送信の
ためのロジックをカプセル化します。
------------------------------------------------------------------------------------------------
フロントエンドへのリダイレクト
メール認証のリンク先をフロントエンドのアプリケーション（例えば、Next.jsで構築されたSPA）にすることも可能です。
これは特に、バックエンド（Rails）とフロントエンドが分離されたアーキテクチャの場合に適しています。この場合、Devise
からの確認メールのリンクをクリックすると、ユーザーはまずフロントエンドの特定のページ（例：サインインページ）にリダイ
レクトされ、その後、必要に応じてバックエンドのAPIにリクエストを送る流れになります。

================================================================================================
5.2
. **開発環境でのRailsアプリケーションへのリダイレクトと認証メカニズム**
- `{ host: 'localhost', port: 3010 }` という設定で、Deviseはメール内のリンクを生成します。このリンクには通
常、認証トークンが含まれています。
- ユーザーがこのリンクをクリックすると、彼らは設定されたURL（この場合は、開発環境のRailsアプリ）にリダイレクトされ
ます。
- リダイレクトされたとき、Railsアプリケーションはリクエストから認証トークンを取得し、これを使ってユーザーのアカウン
トを認証します。
- Deviseはこのトークンを検証し、対応するユーザーのアカウントを有効化するプロセスを行います。
- このプロセスは、通常、Deviseの `ConfirmationsController` によって自動的に処理されます。
------------------------------------------------------------------------------------------------
. **メール認証のリンク先をフロントエンドアプリケーションに設定した場合**
- フロントエンドアプリケーション（例えば、Next.jsで構築されたSPA）にリダイレクトする場合、リンクには引き続き認証ト
ークンが含まれます。
- ユーザーがこのリンクをクリックすると、フロントエンドアプリにリダイレクトされます。
- ここで、フロントエンドアプリはリクエストから認証トークンを取得し、バックエンドのRails APIに対して認証リクエストを
送信します。
- Rails APIはこのトークンを検証し、ユーザーのアカウントを有効化します。
- フロントエンドアプリは、この認証プロセスの結果に基づいてユーザーに適切なフィードバックを提供する必要があります（
例：成功メッセージの表示、ログインページへのリダイレクトなど）。

================================================================================================
5.3
`config.action_mailer.default_url_options = { host: 'localhost', port: 3010 }` にリクエストされる仕
組みについて説明します。確かに、この設定自体は特定のコントローラーを指定していません。ここでのキーポイントは、この
設定がメール内のリンクのベースURLを指定するために使用されるということです。この設定は、メール内のリンクの生成にのみ
使用されます。
------------------------------------------------------------------------------------------------
. **メール内リンクの生成**
- Deviseでは、ユーザーがサインアップすると、自動的にアカウント確認のメールが送信されます。
- このメールに含まれる確認リンクは、`config.action_mailer.default_url_options` の設定を基に生成されます。
- 例えば、アカウント確認のリンクは通常 `http://localhost:3010/users/confirmation?confirmation_token=[ト
  ークン]` のような形式になります。
------------------------------------------------------------------------------------------------
Deviseで生成されるアカウント確認のメールに含まれるリンクは、基本的に `<リンクのベースURL>` + `<リンクのパス>`+
`<クエリパラメータ>` の形式で構成されます。具体的には以下のようになります：
------------------------------------------------------------------------------------------------
. **リンクのパス**
- これはDeviseが提供する特定のルートです。アカウント確認の場合、通常は `/users/confirmation` というパスになり
ます。
------------------------------------------------------------------------------------------------
. **クエリパラメータ**
- これには、Deviseが生成した一意の認証トークンが含まれます。例：`?confirmation_token=[トークン]`
------------------------------------------------------------------------------------------------
. **リダイレクト先の決定**
- メール内のリンクがクリックされると、ユーザーはそのリンクに指定されたURL（この場合は `localhost` 上の `3010`
ポート）にリダイレクトされます。
- このURLは、`config/routes.rb` ファイルで定義されたルート（Deviseが提供する特定のルート）に基づいて、適切なコ
ントローラーとアクションにマッピングされます。
- Deviseの場合、`confirmation_token` パラメータは `ConfirmationsController` の `show` アクション（また
は類似のアクション）にルーティングされます。
------------------------------------------------------------------------------------------------
. **トークンの処理**
- コントローラーのアクションは、リクエストから `confirmation_token` を取得し、それを使ってユーザーのアカウント
を確認します。
- このプロセスは、Deviseによって自動的に処理されます。
------------------------------------------------------------------------------------------------
ちなみにトークンをクリックすると、遷移後のurlの表示は、
`http://localhost:3001/signin?account_confirmation_success=true`になる。

================================================================================================
5.4
config.action_mailer.delivery_method = :letter_opener_web
. **機能と目的**:
- この設定は、Railsアプリケーションでのメール送信方法を指定します。
- `:letter_opener_web`を指定することで、開発環境において実際にメールサーバーを使用することなく、メールの送信を
シミュレートできます。
. **Letter Opener Webの役割**:
- Letter Opener Webは、開発環境でメールを送信する際に、それらをWebブラウザで簡単にプレビューするツールです。
- メールは実際には送信されず、代わりにWebインターフェース上で表示されます。
- この設定により、`ActionMailer`を使ってメールを送信する際、送信されたメールはローカルのWebページとして保存され
、ブラウザで直接見ることができます。
- 開発者はメールサーバーを設定することなく、メール送信の結果を即座に確認できます。
=end