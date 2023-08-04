class Api::V1::LikesController < ApplicationController
  # before_action :authenticate_api_v1_user!
  before_action :authenticate_api_v1_user!
  before_action :set_post, only: [:destroy]
  before_action :set_like, only: [:destroy]

  # 1

  def index


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

  def destroy
    puts "Likeのdestroyアクションが発火"
    if @like.destroy
      render json: { status: 'SUCCESS', message: 'Unliked the post', data: @post }
    else
      render json: { status: 'ERROR', message: 'Unliking the post failed', data: @like.errors }
    end
  end

  private

  # 2 インスタん変数で記載する
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

================================================================================================
2
. インスタンス変数@を使わないと上手くいかない理由は？
- `before_action`で呼ばれる`set_post`と`set_like`メソッドではインスタンス変数ではなくローカル変数
（`post`と`like`）が定義されています。そのため、`destroy`メソッド内ではこれらの変数が存在せず、エラーが発生しま
す。ローカル変数は定義されたメソッド内（`set_post`と`set_like`）でのみ有効なため、メソッドを跨いで使用することは
できません。
- Railsのコントローラで使用されるインスタンス変数とNext.jsが関係ないことは正しいです。しかしながら、上記の説明の
ように、`set_post`と`set_like`で定義された変数を`destroy`メソッドで使用するにはインスタンス変数が必要となりま
す。
=end