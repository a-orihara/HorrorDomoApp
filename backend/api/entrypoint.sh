#!/bin/bash
# ↑1

# エラーが発生するとスクリプトを終了する
set -e

# 2
rm -f /api-app/tmp/pids/server.pid

# CMDで渡されたコマンド（コンテナのメインプロセス。→Railsのサーバー起動）を実行
exec "$@"

# @          @@          @@          @@          @@          @@          @@          @@
# 1
# `#!/bin/bash`はシェバン（shebang）。1行目に記載。bashを利用したシェルスクリプトであることを示している
# この行は、スクリプトを実行するために使用するシェルまたはインタプリタを指定します。ここでは`bash`シェルを指定。
# linuxカーネルはファイルの先頭に#!があれば、その後ろに書かれたコマンド（この場合は/bin/bash）を実行
# する。
# `bash`は多くのUNIX系システムで標準的なシェルであり、多くの便利な機能と拡張性を提供します。そのため、スクリプトを
# `bash`で実行することがよくあります。

# ================================================================================================
# 2
# /api-app:DockerfileでWORKDIRに指定したディレクトリ
# ------------------------------------------------------------------------------------------------
# Railsに潜在的に存在するserver.pidファイルがあれば削除します。
# pidファイルが既に存在するためサーバーが立ち上がらないエラーを回避する為。
# pidはプロセスid。開発用webサーバーを起動する時に、tmp/pids/server.pidに書き込まれ、終了する時に
# 削除される。server.pidにpidが書かれているとサーバーが起動中と判断されてしまう。sarver.pidファイル
# は毎回削除するようにします。
