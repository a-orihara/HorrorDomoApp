class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "成功：Success Health Check!" }, status: :ok
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
ヘルスチェックとは？
システムが正常に動作しているかを確認するプロセスのことです。
中身としては、GETリクエストを送信すると「ステータス 200 OK」のレスポンスを返す、という単純な機能として実装します。
今回Railsに実装したヘルスチェック機能は、主に以下の点で利用されます。
.今後実装予定のフロントエンド（Next.js）との疎通確認
.本番環境デプロイ時のインターネットからの疎通確認
=end