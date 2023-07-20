class Api::V1::RelationshipsController < ApplicationController
  # 1
  before_action :authenticate_api_v1_user!

  def create

  end

  def destroy

  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
authenticate_api_v1_user!
Devise Token Authによって提供されるメソッドで、APIリクエストが認証済みのユーザーから来ているかどうかを確認しま
す。認証されていない場合は、401エラーを返します。
=end
