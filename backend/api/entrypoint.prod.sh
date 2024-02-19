#!/bin/bash
set -e

# echoは単純に文字列をログ出力するだけのコマンド
echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# 消す
# Drop the database
echo "RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop"
# 1.1
RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop

# 消す
echo "bundle exec rails db:create RAILS_ENV=production"
# 1.2
bundle exec rails db:create RAILS_ENV=production

echo "bundle exec rails db:migrate RAILS_ENV=production"
bundle exec rails db:migrate RAILS_ENV=production

# 消す
echo "bundle exec rails db:seed RAILS_ENV=production"
bundle exec rails db:seed RAILS_ENV=production

echo "exec pumactl start"
# 2
bundle exec pumactl start

# @          @@          @@          @@          @@          @@          @@          @@          @
# 1.1
# 1. **bundle exec rake db:drop`` による `DISABLE_DATABASE_ENVIRONMENT_CHECK=1` の説明:**
# - Railsでは、特定のコマンドを誤って実行するとデータ損失などの取り返しのつかない変更を引き起こす可能性があるため、
# 本番環境で実行されないように保護されています。コマンド `bundle exec rake db:drop` はそのようなコマンドのひとつ
# で、アプリケーションに関連付けられたデータベースを削除します。この動作は一般的に、本番環境では偶発的に起こってほしく
# ないものです。
# - DISABLE_DATABASE_ENVIRONMENT_CHECK=1`環境変数は、Railsに組み込まれた安全メカニズムを上書きするために使用
# します。デフォルトでは、アプリケーションが本番環境 (`RAILS_ENV=production`) にあるとき、Railsはデータベースを
# 削除するような破壊的なタスクの実行をブロックします。DISABLE_DATABASE_ENVIRONMENT_CHECK=1`を設定すると、Rails
# にこの安全性チェックを無効にするように指示し、本番環境でも`db:drop`タスクの実行を許可します。

# ================================================================================================
# 1.2
# 初回デプロイにおいては、そもそもマイグレーションを行うDBがないところからのスタートになりますので、
# db:create
# db:migrate
# db:seed
# を順に実行させます。
# このうち、 db:create と db:seed は2回目以降のデプロイでは実行不要のため、のちほど削除する予定です。

# ================================================================================================
# 2
# bundle exec pumactl start
# ================================================================================================
# bundle exec
# `Gemfile.lock` で指定された gem のバージョンを使用。
#  本番環境では、バージョン管理に関するリスクを最小化するために `bundle exec` を使用するのが一般的です。
# ------------------------------------------------------------------------------------------------
# pumactl start
# Pumaウェブサーバーを起動する
