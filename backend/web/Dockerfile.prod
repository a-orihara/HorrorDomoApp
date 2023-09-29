# 1  FROM nginx:1.22.1-alpine
FROM nginx:alpine

# 2
RUN rm -f /etc/nginx/conf.d/*

# 3
ADD ./nginx.conf /etc/nginx/conf.d/api-app.conf

# 4 ビルド完了後にNginxを起動
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf

EXPOSE 80



# ./container/nginx/default.conf:/etc/nginx/conf.d/default.conf

# @          @@          @@          @@          @@          @@          @@          @@          @
# 1
# . `FROM nginx:alpine`
# - `nginx:alpine`は、Nginx WebサーバーがプリインストールされたAlpine LinuxベースのDockerイメージ。
# - Alpineは軽量なLinuxディストリビューション。
# - `FROM nginx:1.22.1-alpine` 1.22.1バージョンを指定。ないと最新のバージョンを取得

# ================================================================================================
# 2
# . `RUN rm -f /etc/nginx/conf.d/*` :
# - このコマンドは、Nginxの設定ファイルが格納されている`/etc/nginx/conf.d/`ディレクトリ内の全ファイルを削除。
# - 理由は、デフォルトの設定を一掃し、カスタム設定だけを使いたいため。
# - `rm -f`は強制削除なので、エラーを出さずに削除が行われる。
# - インクルード用のディレクトリ内を削除(一旦デフォで作成されているconf.dディレクトリ以下のサンプルファイルを削除)
# - nginxをインストールすると、/etc配下にnginx/nginx.confやnginx/conf.dというディレクトリが生成される

# ================================================================================================
# 3
# . `ADD nginx.conf /etc/nginx/conf.d/api-app.conf`
# - ローカルの`nginx.conf` ファイルをDockerコンテナの `/etc/nginx/conf.d/api-app.conf` へ追加。
# ------------------------------------------------------------------------------------------------
# nginx.confが一番初めに読み込まれる。nginx.confがnginx/conf.d以下を読み込む。
# conf.dディレクトリにバーチャルサーバ毎の設定ファイルを置くことにより、その設定ファイルが読み込まれます。
# ------------------------------------------------------------------------------------------------
# アプリごとの設定ファイルは「/etc/nginx/conf.d/」の下に新規で作成し、Nginx全体に関わる設定は
# 「/etc/nginx/nginx.conf」を編集するようにします。
# 今回はアプリ単体の設定なので「/etc/nginx/conf.d/api-app.conf」を作成します。
# ================================================================================================
# 4
# . `CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf`
# ------------------------------------------------------------------------------------------------
# - /usr/sbin/nginx： コンテナ内のNginx実行ファイルへのパスです。Nginxはこの実行ファイルを使用して起動します。
# - g 'daemon off;'： このフラグはNginxがフォアグラウンドで実行されるようにします。デフォルトではNginxはデーモン
# として起動しますが、DockerではDockerコンテナが終了しないようにフォアグラウンドで実行し続けたいものです。
# - -c /etc/nginx/nginx.conf： このフラグはNginx設定ファイルのパスを指定します。この場合、
# `/etc/nginx/nginx.conf`を指します。
# ------------------------------------------------------------------------------------------------
# -  nginxを前面で実行し、コンテナが停止しないようにする。
# -  `-g 'daemon off;'` でnginxをデーモンとしてではなく前面で実行。 `-c /etc/nginx/nginx.conf` で設定ファ
# イルを指定。
# -  Dockerコンテナは前面で動作するプロセスが終了すると停止します。そのため、nginxを前面で動作させる必要があります。
# dockerではコマンドをforegroundで動かさないとコンテナが停止してしまいます。 nginxはデフォルトはデーモンとして動く
# ので、['daemon off;']でforegroundで動くように設定。


