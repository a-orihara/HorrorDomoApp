class Api::V1::LikesController < ApplicationController
  before_action :authenticate_api_v1_user!
  # 1
  def create
    puts "Likeのcreateアクションが発火"
    # 投稿に対していいねを作成する
    like = current_api_v1_user.likes.build(post_id: params[:post_id])
    if like.save
      render json: { status: '201', data: like }, status: :ok
    else
      render json: { status: '422', message: like.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 旧
  # def destroy
  #   like = Like.find_by(post_id: params[:post_id], user_id: current_api_v1_user.id)
  #   if like.destroy
  #     render json: { status: '200', message: 'Like was successfully destroyed.' }, status: :ok
  #   else
  #     render json: { status: '422', message: 'Failed to destroy the like.' }, status: :unprocessable_entity
  #   end
  # end

  def destroy
    like = current_api_v1_user.likes.find_by(post_id: params[:post_id])
    if like
      like.destroy
      render json: { status: '200', message: 'Like was successfully destroyed.' }, status: :ok
    else
      render json: { status: '404', message: 'Like not found.' }, status: :not_found
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
likes.build.newでも良い。
.newと.buildは同じ動作をします。どちらも新しいオブジェクトをメモリ上に生成しますが、そのオブジェクトはまだデータベ
ースに保存されていません。一般的にはどちらを使っても問題ないですが、アソシエーションが絡む場合は.buildを使うことが
多いです。
------------------------------------------------------------------------------------------------
like = current_api_v1_user.likes.create(post_id: params[:post_id])のように、createメソッドは使わない。
createメソッドはオブジェクトをメモリ上に作成するだけでなく、そのオブジェクトをデータベースにも保存します。そのため、
.createの直後に.saveを呼び出すと、同じデータを二度保存することになります。
=end