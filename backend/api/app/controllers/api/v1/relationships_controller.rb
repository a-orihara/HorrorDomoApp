class Api::V1::RelationshipsController < ApplicationController
  # 1
  before_action :authenticate_api_v1_user!

  # 2
  def create
    puts "Relationshipのcreateアクションが発火"
    user = User.find(params[:other_id])
    if current_api_v1_user.follow(user)
      render json: { status: 200, message: 'フォローしました' }
    else
      render json: { status: 500, message: 'フォローに失敗しました' }, status: 500
    end
  end

  # 3
  def destroy
    puts "Relationshipのdestroyアクションが発火"
    user = User.find(params[:other_id])
    if current_api_v1_user.unfollow(user)
      render json: { status: 200, message: 'フォロー解除しました' }
    else
      render json: { status: 500, message: 'フォロー解除に失敗しました' }, status: 500
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
authenticate_api_v1_user!
Devise Token Authによって提供されるメソッドで、APIリクエストが認証済みのユーザーから来ているかどうかを確認しま
す。認証されていない場合は、401エラーを返します。
================================================================================================
2
followは、models/user.rbで定義。ユーザーをフォローする。

================================================================================================
3
Railsのルーティングにおいては、destroyアクションを行う際は対象となるリソースのIDが必要になります。
=end
