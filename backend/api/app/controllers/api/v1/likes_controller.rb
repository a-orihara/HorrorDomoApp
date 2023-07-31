class Api::V1::LikesController < ApplicationController
  # before_action :authenticate_api_v1_user!
  before_action :authenticate_api_v1_user!
  before_action :set_post, only: [:destroy]
  before_action :set_like, only: [:destroy]

  # 1

  def index
    # page = params[:page] || 1
    # per_page = params[:per_page] || 10

    # if params[:user_id]
    #   # 6
    #   user = User.find_by(id: params[:user_id])
    #   if user
    #     # @posts = user.posts
    #     # 指定したページの1ページ当たりの表示件数分のpostを取得
    #     @posts = user.posts.page(page).per(per_page)
    #     total_posts = user.posts.count
    #   else
    #     return render json: { status: '404', message: 'User not found' }, status: :not_found
    #   end
    # else
    #   # 4
    #   # @posts = current_api_v1_user.posts
    #   @posts = current_api_v1_user.posts.page(page).per(per_page)
    #   total_posts = current_api_v1_user.posts.count
    # end
    # # 5
    # render json: { status: '200', data: @posts, total_posts: total_posts }, status: :ok

  end
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

  # 旧2
  # def destroy
  #   like = current_api_v1_user.likes.find_by(post_id: params[:post_id])
  #   if like
  #     like.destroy
  #     render json: { status: '200', message: 'Like was successfully destroyed.' }, status: :ok
  #   else
  #     render json: { status: '404', message: 'Like not found.' }, status: :not_found
  #   end
  # end

  def destroy
    puts "Likeのdestroyアクションが発火"
    if @like.destroy
      render json: { status: 'SUCCESS', message: 'Unliked the post', data: @post }
    else
      render json: { status: 'ERROR', message: 'Unliking the post failed', data: @like.errors }
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_like
    @like = @post.likes.find_by(user_id: current_api_v1_user.id)
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