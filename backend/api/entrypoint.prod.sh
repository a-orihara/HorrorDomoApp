#!/bin/bash
set -e

# echoは単純に文字列をログ出力するだけのコマンド
echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# 消す
# Drop the database
echo "RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop"
RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop

# 消す
echo "bundle exec rails db:create RAILS_ENV=production"
# 1
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
# ================================================================================================
# 1
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
