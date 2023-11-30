class Api::V1::User::ConfirmationsController < Api::V1::BaseController
  # 1.1
  def update
    user = User.find_by(confirmation_token: params[:confirmation_token])
    return render json: { message: "User record is not found." }, status: :not_found if user.nil?
    return render json: { message: "User has already been confirmed." }, status: :bad_request if user.confirmed?
    user.update!(confirmed_at: Time.current)
    render json: { message: "User confirmartion succeeded." }, status: :ok
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
`confirmations_controller.rb`内のコードの挙動と使用意図について解説します。
. **`User.find_by(confirmation_token: params[:confirmation_token])`の挙動と使用意図**:
- この行は、データベース内の`users`テーブルから、パラメーターで渡された`confirmation_token`に一致するユーザー
を検索します。
- 使用意図は、ユーザーがアカウント確認リンクをクリックした時に、そのリンクに含まれるトークンを用いて対応するユーザ
ーを特定し、そのユーザーのアカウントを有効化することです。
------------------------------------------------------------------------------------------------
. **`status: :not_found if user.nil?`の挙動と使用意図**:
- この行は、検索した結果、該当するユーザーがデータベースに存在しない場合（`user`が`nil`の場合）、
`404 Not Found`ステータスコードを持つJSONレスポンスを返します。
- 使用意図は、無効なまたは存在しない確認トークンが提供された場合に、クライアント（フロントエンド）に対して適切なエ
ラーメッセージを返し、リクエストが失敗したことを通知することです。
------------------------------------------------------------------------------------------------
. **`status: :bad_request if user.confirmed?`の挙動と使用意図**:
- この行は、該当するユーザーがすでにアカウントを確認（`confirmed`）している場合に、`400 Bad Request`ステータ
スコードを持つJSONレスポンスを返します。
- 使用意図は、ユーザーが既に確認されている場合（つまり、アカウントがすでにアクティブである場合）に、重複した確認リ
クエストを無効にし、クライアントに適切なフィードバックを提供することです。
=end