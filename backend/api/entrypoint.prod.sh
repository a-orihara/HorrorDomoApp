#!/bin/bash
set -e

# echoは単純に文字列をログ出力するだけのコマンド
echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

echo "bundle exec rails db:create RAILS_ENV=production"
bundle exec rails db:create RAILS_ENV=production

echo "bundle exec rails db:migrate RAILS_ENV=production"
bundle exec rails db:migrate RAILS_ENV=production

echo "bundle exec rails db:seed RAILS_ENV=production"
bundle exec rails db:seed RAILS_ENV=production

echo "exec pumactl start"
# 1
bundle exec pumactl start

# @          @@          @@          @@          @@          @@          @@          @@          @
# bundle exec pumactl start
# ================================================================================================
# bundle exec
# `Gemfile.lock` で指定された gem のバージョンを使用。
#  本番環境では、バージョン管理に関するリスクを最小化するために `bundle exec` を使用するのが一般的です。
# ------------------------------------------------------------------------------------------------
# pumactl start
# Pumaウェブサーバーを起動する
