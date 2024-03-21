# Be sure to restart your server when you modify this file.
# このファイルを変更した際には、必ずサーバーを再起動してください。

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.
# フロントエンドアプリからAPIを呼び出す際にCORSの問題を回避する.
# クロスオリジンのAJAXリクエストを受け付けるために、CORS(Cross-Origin Resource Sharing)を処理します。

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # 許可されるCORSリクエストについての設定
  allow do
    origins Settings.front_domain
    # origins '*'
    # すべてのリソースに対するCORSポリシーを指定
    resource '*',
              # すべてのヘッダーを許可
              :headers => :any,
              # CORSリクエストに含まれるヘッダーの内、許可されるヘッダーを指定
              :expose => ['access-token', 'expiry', 'token-type', 'uid', 'client'],
              # 許可されるHTTPメソッドを指定
              :methods => [:get, :post, :options, :delete, :put, :show, :patch]
  end
end
# Rails.logger.info "フロントドメイン is set to: #{Settings.front_domain}"

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
- 一般的に、CORS（Cross-Origin Resource Sharing）の設定は、`config/application.rb`ではなく、
`config/initializers/cors.rb`で行う方が望ましい。
- ロード順序とわかりやすさ**： Railsのイニシャライザは、アプリケーションフレームワークとプラグインがロードされた後、
アプリケーション自体がロードされる前にロードされます。これにより、CORS設定がアプリケーションで必要になる前に適切に設
定されます。CORS専用のイニシャライザファイルを使用することで、CORS設定がどこに設定されているかが他の開発者に明確にな
り、チーム内の理解と協力が促進されます。
=end