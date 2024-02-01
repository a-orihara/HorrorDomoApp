class Api::V1::LikesController < ApplicationController
  # before_action :authenticate_api_v1_user!
  before_action :authenticate_api_v1_user!
  before_action :set_post, only: [:destroy]
  before_action :set_like, only: [:destroy]

  # 1
  def create
    logger.info "Likeのcreateアクションが発火"
    # 投稿に対していいねを作成する
    # 1.1
    like = current_api_v1_user.likes.build(post_id: params[:post_id])
    if like.save
      # render json: { status: '201', data: like }, status: :ok
      render json: { status: '201' }, status: :ok
    else
      render json: { status: '422', message: "いいねに失敗しました" }, status: :unprocessable_entity
    end
  end

  def destroy
    logger.info "Likeのdestroyアクションが発火"
    if @like.destroy
      # render json: { status: '200', data: @post }
      render json: { status: '200' }, status: :ok
    else
      render json: { status: '422', message: '操作を完了できませんでした' }, status: :unprocessable_entity
    end
  end

  private

  # 2 インスタンス変数で記載する
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
1.1
`create`メソッドと`build`メソッドの使い分け
. **`build`メソッドの使用意図**
- `build`メソッドは、関連付けられたオブジェクトをメモリ上に新しく生成するが、データベースにはすぐに保存しない。
- これにより、オブジェクトをデータベースに保存する前に追加の検証や設定を行うことができる。
- `like = current_api_v1_user.likes.build(post_id: params[:post_id])`では、`current_api_v1_user`に
関連付けられた新しい`like`オブジェクトを生成し、`post_id`をセットしているが、まだデータベースには保存していない。
------------------------------------------------------------------------------------------------
. **`create`メソッドとの違い**
- `create`メソッドは、オブジェクトを生成し、すぐにデータベースに保存する。
- `build`を使用することで、保存前にオブジェクトに対して追加の操作を行う余地ができる。例えば、条件分岐による処理の
挿入や、コールバックの実行などがこれにあたる。
------------------------------------------------------------------------------------------------
. **なぜ`build`が好まれるか**
- フレキシビリティとコントロールが高いため。特に、複雑なビジネスロジックや検証が必要な場合、オブジェクトをデータベ
ースに保存する前に必要な処理を施すことが可能。
- 例えば、いいね機能では、同じ投稿に対する重複したいいねを防止するための検証や、特定の条件下でのみいいねを許可する
ロジックを`save`メソッドを呼び出す前に実装できる。

================================================================================================
2
. インスタンス変数@を使わないと上手くいかない理由は？
- `before_action`で呼ばれる`set_post`と`set_like`メソッドではインスタンス変数ではなくローカル変数
（`post`と`like`）が定義されています。そのため、`destroy`メソッド内ではこれらの変数が存在せず、エラーが発生しま
す。ローカル変数は定義されたメソッド内（`set_post`と`set_like`）でのみ有効なため、メソッドを跨いで使用することは
できません。
- Railsのコントローラで使用されるインスタンス変数とNext.jsは関係ない。
=end
