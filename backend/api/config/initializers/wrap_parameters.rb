# 1

# [このファイルを変更した場合は、必ずサーバーを再起動してください。]

# [ このファイルは、ActionController::ParamsWrapperの設定を含みます。デフォルトで有効になっています。]

# [JSONのパラメータラッピングを有効にします。formatに空の配列を設定することで、これを無効にすることができます。]
# 2
ActiveSupport.on_load(:action_controller) do
  # wrap_parameters format: [:json]
  wrap_parameters false
end

# [ActiveRecordオブジェクトのJSONでルート要素を有効にする。]
# ActiveSupport.on_load(:active_record) do
#   self.include_root_in_json = true
# end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
このファイルはリクエストパラメータの自動ラッピングに関する設定を行います。
リクエストのパラメータを自動的にラップするかどうかを指定します。
================================================================================================
2
この設定は、アクションコントローラーに関連する設定を行っています。具体的には、リクエストパラメータの自動ラッピングに
関する設定をしています。
------------------------------------------------------------------------------------------------
ActiveSupport.on_load(:action_controller)は、アクションコントローラーがロードされた時に実行されるブロックを
指定するためのメソッドです。このブロック内での設定は、アクションコントローラーがロードされた後に適用されます。この設
定はアクションコントローラーに対してのみ有効になります。
------------------------------------------------------------------------------------------------
wrap_parameters format: [:json]
リクエストのパラメータをJSON形式で受け取る場合に、自動的にラップする設定を行っています。これにより、受け取ったJSON
パラメータを自動的にハッシュとして扱うことができます。
------------------------------------------------------------------------------------------------
wrap_parameters false
リクエストパラメータの自動ラッピングを無効にする設定です。リクエストパラメータは自動的にラップされず、そのままの形式
で受け取ることができます。
自動ラッピングを無効にすることで、リクエストパラメータのバリデーションやストロングパラメータの適用など、一部のRails
の機能が正しく動作しなくなる可能性もあります。そのため、この設定を行う場合は注意が必要です。
------------------------------------------------------------------------------------------------
device_auth_tokenのログイン時にUnpermitted parameter: session
# 修正前
Parameters: {"password"=>"[FILTERED]", "email"=>"e@e.com", "session"=>{"password"=>"[FILTERED]", "email"=>"e@e.com"}}
# 修正後
Parameters: {"password"=>"[FILTERED]", "email"=>"e@e.com"}
=end