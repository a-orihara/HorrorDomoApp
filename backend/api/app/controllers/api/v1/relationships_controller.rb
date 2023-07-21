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

  # def create
  #   puts "Postのcreateアクションが発火"
  #   # 7
  #   @post = current_api_v1_user.posts.build(post_params)
  #   if @post.save
  #     # 8
  #     render json: { status: '201', message: '投稿しました', data: @post }, status: :created
  #   else
  #     # 9
  #     render json: { status: '422', message: '投稿に失敗しました', errors: @post.errors.full_messages.join(', ') }, status: :unprocessable_entity
  #   end
  # end

  def destroy

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


=end
