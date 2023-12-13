class Api::V1::RelationshipsController < ApplicationController
  # 1 サインインしているかの確認
  before_action :authenticate_api_v1_user!

  # 2
  def create
    logger.info "Relationshipのcreateアクションが発火"
    user = User.find(params[:other_id])
    if current_api_v1_user.follow(user)
      render json: { status: 200, message: 'フォローしました' }
    else
      render json: { status: 500, message: 'フォローに失敗しました' }, status: 500
    end
  end

  # 3
  def destroy
    logger.info "Relationshipのdestroyアクションが発火"
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
------------------------------------------------------------------------------------------------
1. `Devise Token Auth`の`before_action :authenticate_user!`の挙動：
- このメソッドは、コントローラーのアクションが実行される前に、ユーザーの認証を行います。
- ユーザーが認証されていない場合、アクションは中断され、エラーメッセージが表示されます。
- 通常は、ユーザーがログインしていることを確認するために、各コントローラーアクションで使用します。

2. `Devise Token Auth`の`current_user`の挙動：
- `current_user`メソッドは、現在ログインしているユーザーのインスタンスを返します。
- ユーザーがログインしていない場合、このメソッドはnilを返します。
- このメソッドは、現在ログインしているユーザーの情報にアクセスするために使用されます。

3. `before_action :authenticate_user!`と`current_user`の挙動と使い所の違い：
- `before_action :authenticate_user!`は、特定のアクションが実行される前にユーザー認証を強制します。これは主
にユーザーがログインしていることを確認するために使われます。認証されていないユーザーはアクションを実行できません。
- 一方、`current_user`は、現在ログインしているユーザーの情報にアクセスするために使用されます。このメソッドはユー
ザーが認証されていなくてもエラーを返しません。その代わり、認証されていない場合はnilを返します。このメソッドは、ログ
インユーザーのデータを取得または操作する際に使用します。
================================================================================================
2
followは、models/user.rbで定義。ユーザーをフォローする。

================================================================================================
3
Railsのルーティングにおいては、destroyアクションを行う際は対象となるリソースのIDが必要になります。
=end
