# ベースとなるイメージの指定（rubyのバージョン安定版（22/10現在）3.1.2を指定）
FROM ruby:3.1.2

# 1
RUN apt-get update -qq \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --global yarn

# 作業ディレクトリはその後のDockerfile内でのRUN,COPYなどのあらゆる命令の起点となるカレントディレクトリ。
WORKDIR /api-app
#COPY(コピー)はローカル側のファイルをdockerイメージ側の指定したディレクトリにコピーする
COPY Gemfile /api-app/Gemfile
COPY Gemfile.lock /api-app/Gemfile.lock
# Gemfileに記載されたGem(初回時はrailsが記載)をインストールする。再ビルド時にbundle installするために記載。
RUN bundle install
# コンテナ起動時に毎回実行されるスクリプトを追加する。/usr/bin/はコンテナのLinuxベースのディレクトリ。
COPY entrypoint.sh /usr/bin/
# entrypoint.shの権限(+x:すべてのユーザーに実行権限を追加)を変更
RUN chmod +x /usr/bin/entrypoint.sh
# 2 ENTRYPOINTはdocker runの時に実行される
ENTRYPOINT ["entrypoint.sh"]
# 4
# EXPOSE 3000
# 3 イメージの実行時に実行するメインプロセス
CMD ["rails", "server", "-b", "0.0.0.0"]


# @          @@          @@          @@          @@          @@          @@          @@
# 1
# RUNはビルド時(docker buildのとき)にコンテナ内で実行されます。
# 一つのDockerfileは複数のRUNを持ち、ビルドステップに応じて呼び出されます。
# RUNの数だけレイヤー(中間生成コンテナ)が生成されるので少ないに越したことはないです。

# apt-get:Debian系のコマンド。Ubuntuパッケージ管理システム＝APTライブラリを利用してパッケージ操作・
# 管理するコマンド
# apt-get update:インストール可能なパッケージの一覧の更新
# -qq:quietモードで実行。ログを極力表示させない。エラー以外を表示しないオプション

# -          --          --          --          --          --          --          -
# Railsの起動に必要となるnodejsとnpmをインストールする。常にyesの-y指定。
# apt-get install -y nodejs npm

# -          --          --          --          --          --          --          -
# rm -rf:ディレクトリを強制削除。aptのキャッシュを削除し容量を小さくする
# rm -rf /var/lib/apt/lists/* \

# =          ==          ==          ==          ==          ==          ==          =
# 2
# ENTRYPOINT
# ENTRYPOINTはCMD同様、イメージからコンテナを作成する時（docker run時）に実行されるのですが、
# ENTRYPOINTはdocker runの引数のcommandに上書きされません。
# ENTRYPOINTはCMDと組み合わせて使います。
# ENTRYPOINTとCMDが両方書かれているとき、書く順番によらず、ENTRYPOINTを実行するコマンドとして、CMD
# をそのコマンドのargumentとして、実行されます。
# ENTRYPOINTはdocker container runの引数やdocker-compose.ymlの- commandに上書きされないがCMDは上
# 書きされませんが、その性質を利用して、引数のみを上書き可能にしたコマンドを用意することもできます。

# ENTRYPOINTは、コンテナを実行ファイル(executable)として処理するように設定できます。
# exec形式を公式で推奨。shell形式では、CMDやrunコマンドラインの引数を使えません。
# ENTRYPOINTのexec形式は、確実に実行するデフォルトのコマンドと引数を設定するために使います。
# 複数のコマンドが必要な場合は、シェルスクリプトから実行する

# ["entrypoint.sh"]の最終行の[exec "$@"]より、CMD ["rails", "server", "-b", "0.0.0.0"]が
# 実行される。
# =          ==          ==          ==          ==          ==          ==          =
# 3
# bindオプションで0.0.0.0を指定。0.0.0.0は全てのアドレスという意味。由まり、どのIP Addressからも
# railsサーバーに接続可能という意味。

# -          --          --          --          --          --          --          -
# CMD
# CMDは完成したイメージからコンテナを作成するときに実行されます。つまりdocker runの時に実行されます。
# 1つのDockerfileにつき1つのCMDが呼び出され、複数書いてあったとしても最後に書かれたものが実行されま
# す。ただし、docker runの引数としてcommandが指定されていた場合、これが最後のコマンドと捉えられ、こ
# れに上書きされてしまいます。

# -          --          --          --          --          --          --          -
# ↓pumaでUNIXドメインソケット通信する為、ポート指定は不要になる。
# CMD ["rails", "server"]

# -          --          --          --          --          --          --          -
# コンテナでメインとして実行するプロセスは、 Dockerfileの最後に書かれているENTRYPOINTかCMD か、あ
# るいは両方によって指定します。

# =          ==          ==          ==          ==          ==          ==          =
# 4
# EXPOSE 3000
# コンテナがホスト(ローカルPC)に対してリッスンするport番号を3000に設定する。
# ここで設定しなくても、コンテナ立ち上げ時に-p 3010:3000のようにすれば、ポート接続出来る
# pumaでUNIXドメインソケット通信する為、ポート指定は不要に。