# frozen_string_literal: true

DeviseTokenAuth.setup do |config|
  # By default the authorization headers will change after each request. The
  # client is responsible for keeping track of the changing tokens. Change
  # this to false to prevent the Authorization header from changing after
  # each request.
  config.change_headers_on_each_request = false

  # By default, users will need to re-authenticate after 2 weeks. This setting
  # determines how long tokens will remain valid after they are issued.
  config.token_lifespan = 2.weeks

  # Limiting the token_cost to just 4 in testing will increase the performance of
  # your test suite dramatically. The possible cost value is within range from 4
  # to 31. It is recommended to not use a value more than 10 in other environments.
  config.token_cost = Rails.env.test? ? 4 : 10

  # Sets the max number of concurrent devices per user, which is 10 by default.
  # After this limit is reached, the oldest tokens will be removed.
  # config.max_number_of_devices = 10

  # Sometimes it's necessary to make several requests to the API at the same
  # time. In this case, each request in the batch will need to share the same
  # auth token. This setting determines how far apart the requests can be while
  # still using the same auth token.
  # config.batch_request_buffer_throttle = 5.seconds

  # This route will be the prefix for all oauth2 redirect callbacks. For
  # example, using the default '/omniauth', the github oauth2 provider will
  # redirect successful authentications to '/omniauth/github/callback'
  # config.omniauth_prefix = "/omniauth"

  # By default sending current password is not needed for the password update.
  # Uncomment to enforce current_password param to be checked before all
  # attribute updates. Set it to :password if you want it to be checked only if
  # password is updated.
  # config.check_current_password_before_update = :attributes

  # By default we will use callbacks for single omniauth.
  # It depends on fields like email, provider and uid.
  # config.default_callbacks = true

  # Makes it possible to change the headers names
  # 3
  config.headers_names = {:'access-token' => 'access-token',
                          :'client' => 'client',
                          :'expiry' => 'expiry',
                          :'uid' => 'uid',
                          :'token-type' => 'token-type' }

  # Makes it possible to use custom uid column
  # config.other_uid = "foo"

  # By default, only Bearer Token authentication is implemented out of the box.
  # If, however, you wish to integrate with legacy Devise authentication, you can
  # do so by enabling this flag. NOTE: This feature is highly experimental!
  # config.enable_standard_devise_support = false

  # By default DeviseTokenAuth will not send confirmation email, even when including
  # devise confirmable module. If you want to use devise confirmable module and
  # send email, set it to true. (This is a setting for compatibility)
  # config.send_confirmation_email = true
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @@
1
config.change_headers_on_each_request = false
config.change_headers_on_each_requestは、リクエストごとに新しいランダムなヘッダーを生成するかどうかを決定す
るブール値です。trueに設定すると、サーバーへの各リクエストに対して新しいランダムヘッダーが生成されます。falseに設
定すると、各リクエストに同じヘッダーが使用されます。

各リクエストにランダムなヘッダーを使用すると、CSRF（Cross-Site Request Forgery）などの攻撃を防ぐことができるた
め、この設定はセキュリティ目的で使用することを意図しています。

この設定のデフォルト値はtrueで、各リクエストに対して新しいランダムなヘッダーが生成されることを意味します。しかし、
リクエストごとにヘッダーを変更することに問題がある特定のライブラリやフレームワークを使用する場合は、この設定をfalse
にすることが一般的です。さらに、リクエストごとに新しいヘッダーを生成するとオーバーヘッドが発生するため、パフォーマン
ス上の理由からfalseに設定する開発者もいるようです。
================================================================================================
2
config.token_lifespanは、トークンの有効期間を設定するためのDeviseの設定です。この例では、トークンの有効期間を
2週間に設定しています。

トークンの有効期間を制限することで、セキュリティを向上させることができます。例えば、トークンが長期間有効である場合、
トークンが漏洩した場合に不正なアクセスを許してしまう可能性があります。このため、トークンの有効期間を設定することで、
不正なアクセスのリスクを減らすことができます。

一般的には、トークンの有効期間は数日から数週間程度が設定されることが多いです。ただし、アプリケーションによっては、
より長い有効期間が必要な場合もあります。また、セキュリティ上の理由から、トークンの有効期間を短く設定することが推奨
されることが多いです。
================================================================================================
3
この設定は、ヘッダーの名前を定義するためのものです。access-token、client、expiry、uid、token-type、
authorizationの6つのキーとその値を指定しています。

この設定は、Devise Token Authが発行するトークンに関連するヘッダー情報を、アプリケーションで実際に使用されている
ヘッダー名と紐付けるために使用されます。この設定を使用することで、アプリケーションで使用されている実際のヘッダー名
を自由に設定できます。例えば、:access-tokenという実際のヘッダー名を、Devise Token Authが使用する
:access-tokenに紐付けることができます。これにより、アプリケーションが特定のヘッダー名を要求する場合、
Devise Token Authが自動的にこれらのヘッダーを検出して使用することができます。一般的に、この設定はアプリケーショ
ンで頻繁に使用されます。

一般的には、Devise Token Authを使用する場合にこのようなヘッダー名の設定が行われることがあります。ただし、具体的
な設定内容はアプリケーションによって異なります。
=end