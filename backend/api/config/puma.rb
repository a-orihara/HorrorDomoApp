# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
# [threads` メソッドの設定には、最小値と最大値の2つの数値が必要です。]
# [Puma は内部スレッドプールから各リクエストをスレッドで処理することができます。]
# [スレッドプールを使用するライブラリは、Puma に指定された最大値と一致するように設定する必要があります。
# デフォルトでは、最小と最大で 5 スレッドに設定されています。これは Active Record のデフォルトのス
# レッドサイズと同じです。]

# 1

# 1.1
require 'rails'
# 2 変数max_threads_countを定義。Defaultの設定。
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
# 変数min_threads_countを定義。Defaultの設定。
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
# スレッドの最小数, 最大数を定義。Defaultの設定。
threads min_threads_count, max_threads_count

# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
# [開発環境において、Puma がワーカーを終了させる前に待つ `worker_timeout` の閾値を指定します。]
# pumaのworkerのタイムアウト時間を定義。Defaultの設定。
worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
# [Puma がTCPソケットでリクエストを受け取るためにリッスンする `port` を指定します。デフォルトは 3000 です。]
port ENV.fetch("PORT") { 3000 }
# 3 UNIXソケットでバインドします。
app_root = File.expand_path("../..", __FILE__)
# puts "app_rootはここだよー:#{app_root}"
bind "unix://#{app_root}/tmp/sockets/puma.sock"

# Specifies the `environment` that Puma will run in.
# [Puma が実行される `environment` を指定します。]
# pumaをどの環境で動作させるか指定。RAILS_ENVで指定。Defaultの設定。
environment ENV.fetch("RAILS_ENV") { "development" }

# Specifies the `pidfile` that Puma will use.
# [Puma が使用する `pidfile` を指定します。]
# 3.1
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked web server processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
#
# workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory.
#
# preload_app!

# Allow puma to be restarted by `rails restart` command.
# [puma を `rails restart` コマンドで再起動できるようにしました。]
plugin :tmp_restart

# @          @@          @@          @@          @@          @@          @@          @@          @
# 1
# Railsで開発をする場合にrails serverをすることで、Pumaが起動している。
# Pumaのwebサーバーとしての機能はおまけ程度で、[Rack] という機能を提供するアプリケーションサーバーという位置づけ
# Pumaは、Railsの場合、config/puma.rb で詳細な設定をすることができる。
# もちろん、オプションコマンドで設定も可能であるが、毎回コマンドを打つのが面倒なので、設定ファイルに用いる。
# 開発時は、Defaultの設定で問題ない
# 本番環境では、Nginxをリバースプロキシ（webサーバーの前段に置くサーバー）としてPumaの前段におき、UNIXドメインソケ
# ットを経由してNginxとPumaが通信を行う。

# ================================================================================================
# 1.1
# require 'rails'
# これがないと、下記のエラーが発生する。
#  config/puma.rb:32:in `_load_from': uninitialized constant Puma::DSL::Rails (NameError)
# エラーメッセージ uninitialized constant Puma::DSL::Rails (NameError) から、puma.rb 内で Rails が未初期
# 化という問題が生じていることがわかります。
# この問題は通常、Pumaが起動する前にRailsが正しくロードされていない(Rails定数が読み込まれていない)場合に発生します

# ================================================================================================
# 2
# . `max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }`:
# - `max_threads_count` 変数を定義しています。これは、アプリケーションが同時に処理できる最大スレッド数を示します。
# - `ENV.fetch("RAILS_MAX_THREADS")` は、環境変数 `RAILS_MAX_THREADS` の値を取得しています。この環境変数は
# Railsアプリケーションの最大スレッド数を指定するために使用されます。もし環境変数が設定されていない場合、デフォルト値
# として `{ 5 }` の値が使用されます。
# ------------------------------------------------------------------------------------------------
# . `min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }`:
# - `min_threads_count` 変数を定義しています。これは、アプリケーションが同時に処理する最小スレッド数を示します。
# - `ENV.fetch("RAILS_MIN_THREADS")` は、環境変数 `RAILS_MIN_THREADS` の値を取得しています。この環境変数は
# Railsアプリケーションの最小スレッド数を指定するために使用されます。もし環境変数が設定されていない場合、
# `max_threads_count` の値が使用されます。
# ------------------------------------------------------------------------------------------------
# . `threads min_threads_count, max_threads_count`:
# - `threads` ディレクティブは、Pumaサーバーのスレッド数を設定するためのものです。最小スレッド数と最大スレッド数を
# 指定します。
# - 上記で定義した `min_threads_count` と `max_threads_count` の値を使用して、スレッド数の範囲を設定。

# ================================================================================================
# 3
# port ENV.fetch("PORT") { 3000 }
# ポートとunixドメインソケットの両方を設定。
# 本番環境で、nginxからバックエンドはunixドメインソケット、nginxからフロントにアクセスし、そのフロントからのapiは、
# ポートでアクセスしている
# ------------------------------------------------------------------------------------------------
# `app_root = File.expand_path("../..", __FILE__)`
# - __FILE__:現在実行しているファイル(＝このpuma.rb)。これは「現在のソースファイル名が格納された疑似変数」。
# - `"../.."` は、現在のファイルから見て2階層上のディレクトリ（このpuma.rbの二階層上は/api）を指します。
# - `File.expand_path` は、これらを組み合わせて絶対パスを生成します。
# - 結果として、`app_root` には `puma.rb` ファイルが存在するディレクトリから2階層上のディレクトリ（/api）からの
# 絶対パスが格納されます。
# ------------------------------------------------------------------------------------------------
# . `bind "unix://#{app_root}/tmp/sockets/puma.sock"`：
# - `bind`：Pumaサーバーが接続を待ち受けるための設定。
# - `unix://`：Unixソケットを使用することを示す。
# - `/tmp/sockets/puma.sock`：`app_root`からの相対パスで、Unixソケットの名前と場所を指定。
# `puma.sock`は、Puma サーバが起動したときに自動的に生成されます。
# ------------------------------------------------------------------------------------------------
# port ENV.fetch("PORT") { 3000 }
# 書き換え-> `bind "unix://#{Rails.root}/tmp/sockets/puma.sock"`
# 同時にTCPソケットとUNIXソケットでバインドすることは可能ですが、一般的にはどちらか一方を選びます。
# UNIXドメインソケットでの連携時、TCP通信での連携は不要になるので、port設定をコメントアウトすることでtcpでのlisten
# を行わなくなります。
# ------------------------------------------------------------------------------------------------
# `bind "unix://#{Rails.root}/tmp/sockets/puma.sock"`
# - この設定だとうまくいかず。原因不明。 Rails.root => #<Pathname:/api-app> なのに。
# - `bind`はPumaがどのプロトコルとアドレスにバインドするかを設定するオプションです。
# - `unix://#{Rails.root}/tmp/sockets/puma.sock`はUNIXソケットを指定しています。
# - `#{Rails.root}`はRailsアプリケーションのルートディレクトリ
# （api-app:Dockerfileで記述したWORKDIR /api-app）を動的に取得します。
# - `/tmp/sockets/puma.sock`はソケットファイルの保存場所です。
# {Rails.root}/tmp/sockets/puma.sock"=api-app/tmp/sockets/puma.sock
# {Rails.root} = /api-app
# ------------------------------------------------------------------------------------------------
# Pumaの設定と起動によってpuma.sockは自動的に生成される
# ------------------------------------------------------------------------------------------------
# Unixドメインソケットが成功すると下記ログが表示
# `rails-ctr-prod   | * Listening on unix:///api-app/tmp/sockets/puma.sock`:
# PumaサーバーがUnixドメインソケット `unix:///api-app/tmp/sockets/puma.sock` でリッスンしていることを示す。
# 対比：通常のポート接続：
# rails-ctr-dev   | * Listening on http://0.0.0.0:3000
# ここでは0.0.0.0はすべてのネットワークインターフェースを指し、ポート番号は3000です。つまり、このPumaサーバーはど
# のネットワークインターフェースからの接続も受け入れ、ポート3000でリクエストを待機しています。
# ------------------------------------------------------------------------------------------------
# このUnixドメインソケットは開発環境では行わない。
# 何故なら、ポートを指定した状態でrails serverを起動した場合はsockファイルがlistenされなくなり、tcpがlistenされ
# るから。
# * docker-compose.dev.ymlのコマンド
# command: bash -c "rm -f tmp/pids/server.pid && rails s -p 3000 -b '0.0.0.0'"
# ================================================================================================
# 3.1
# PID ファイルは、Pumaサーバーが自動的に生成されます。Pumaサーバーが起動する際に、新しいプロセスが生成され、そのプ
# ロセスのプロセスIDが server.pid ファイルに書き込まれます。