# 1
class Api::V1::UsersController < ApplicationController
  # 2 index,showアクションはdeviseにはないので、before_actionを自分で定義する必要がある。
  before_action :authenticate_api_v1_user!, only: [
    :index,
    :following,
    :followers,
    :is_following,
    :all_likes,
    :total_likes_count,
    :liked_posts_ids
  ]
  before_action :set_user, only: [:show]

  # GET /api/v1/users
  # 3 全てのユーザーをページネーション付きで取得するメソッド
  def index
    puts "indexアクションが発火"
    # ページ番号
    page = params[:page] || 1
    # 1ページあたりの表示件数
    per_page = params[:per_page] || 10
    # 指定したページの指定した表示件数分のユーザーを取得
    @users = User.all.page(page).per(per_page)
    # 総ユーザー数を取得
    total_users = User.count
    # { users: @users, total_users: total_users }と同じ意味
    # res:指定したページの指定した表示件数分のユーザーと総ユーザー数
    render json: { users: @users, total_users: total_users }
  end

  # 5
  def show
    puts "showアクションが発火"
    # generate_avatar_urlの戻り値はavatarのURLかnil
    avatar_url = generate_avatar_url(@user)
    render json: @user.as_json.merge(avatar_url: avatar_url)
  end

  # GET /api/v1/users/:id/following（memberメソッドでrouteは作成）
  # followingはmodels/user.rbで定義
  def following
    puts "followingアクションが発火"
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    # user  = User.find(params[:id])より変更。rescue節を使わずnullを返した方がエラー処理がシンプル
    user = User.find_by(id: params[:id])
    if user
      following_users = user.following.page(page).per(per_page)
      # 追加: 各ユーザに対してgenerate_avatar_urlを実行し、as_jsonとmergeを使って、avatar_urlを含む新しいハッシュを生成
      following_users_with_avatar = following_users.map do |f_user|
        avatar_url = generate_avatar_url(f_user)
        f_user.as_json.merge(avatar_url: avatar_url)
      end
      following_count = user.following.count
      # following_pagination = following.page(page).per(per_page)
      render json: {
        status: '200',
        following: following_users_with_avatar,
        following_count: following_count
      }
    else
      render json: {
        status: '404',
        message: 'フォローユーザーが見つかりません'
      }, status: :not_found
    end
  end

  # GET /api/v1/users/:id/followers（memberメソッドでrouteは作成）
  # followersはmodels/user.rbで定義
  def followers
    puts "followersアクションが発火"
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    # user  = User.find(params[:id])より変更。rescue節を使わずnullを返した方がエラー処理がシンプル
    user = User.find_by(id: params[:id])
    if user
      followers_users = user.followers.page(page).per(per_page)
      followers_users_with_avatar = followers_users.map do |f_user|
        avatar_url = generate_avatar_url(f_user)
        f_user.as_json.merge(avatar_url: avatar_url)
      end
      followers_count = user.followers.count
      # followers_pagination = followers.page(page).per(per_page)
      render json: {
        status: '200',
        followers: followers_users_with_avatar,
        followers_count: followers_count
      }
    else
      render json: {
        status: '404',
        message: 'フォロワーが見つかりません'
      }, status: :not_found
    end
  end

  # 5 ユーザーが特定のユーザーをフォローしているか確認するためのAPI
  def is_following
    current_user = User.find(params[:id])
    other_user = User.find(params[:other_id])
    is_following = current_user.following?(other_user)
    render json: { status: '200', is_following: is_following }
  end

  # 7 ユーザーの総いいね数のみを取得する
  def total_likes_count
    puts "total_likes_countアクションが発火"
    user = User.find(params[:id])
    if user
      total_liked_counts = user.likes.count
      render json: { status: '200', total_liked_counts: total_liked_counts }
    else
      render json: { status: '404', message: 'ユーザーが見つかりません' }, status: :not_found
    end
  end

  # 6 ユーザーがいいねした投稿の1P当たりの集合と、総いいね数を返す
  def all_likes
    puts "all_likesアクションが発火"
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    # 指定ユーザーIDでユーザーを検索
    user = User.find(params[:id])
    if user
      # 8
      liked_posts = user.likes.includes(:post).page(page).per(per_page).map { |like| like.post }
      # 指定ユーザーのいいねの真偽値情報を取得
      liked_posts_with_likes = liked_posts.map do |post|
          # いいねしているかの真偽値をlikedに代入
          liked = user.already_liked?(post)
          # 2
          post.as_json.merge(liked: liked)
      end
      # liked_posts（いいねした1p当たりのpost）に紐づくuserの集合を取得
      liked_users = liked_posts.map { |post| post.user }.uniq
      # いいねの総数を取得
      liked_users_with_avatar = liked_users.map do |user|
          avatar_url = generate_avatar_url(user)
          user.as_json.merge(avatar_url: avatar_url)
      end
      total_liked_counts = liked_posts.count
      # 1.いいねしたpostの集合、2.いいねしたpostの総数、3.いいねしたpostに紐づくuserの集合を返す
      render json: {
        status: '200',
        liked_posts: liked_posts_with_likes,
        total_liked_counts: total_liked_counts,
        liked_users: liked_users_with_avatar
      }
    else
      render json: { status: '404', message: 'ユーザーが見つかりません' }, status: :not_found
    end
  end


  def liked_posts_ids
    puts "liked_posts_idsアクションが発火"
    user = current_api_v1_user
    # pluck: liked_posts関連付けに対してカラムidの値を抽出して配列として取得する。
    liked_posts_ids = user.liked_posts.pluck(:id)
    render json: { status: '200', liked_posts_ids: liked_posts_ids }
  end

  private

    # Userモデルからidに対応するユーザーを検索し、変数userに代入する。
    def set_user
      @user = User.find(params[:id])
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
DeviseTokenAuthのSessionsControllerやRegistrationsControllerで定義されていない、Userのアクションは別途、
UsersControllerを自作する必要があります。

================================================================================================
2
:authenticate_api_v1_user!
ユーザーがサイインしていればアクションを実行。
そうでなければエラーを返す。
{"errors":["ログインもしくはアカウント登録してください。"]}
------------------------------------------------------------------------------------------------
トークン認証を行うメソッド。パスワード認証であれば、サインインしているかどうか確認するメソッドに近い。
Railsアプリケーションの認証機能であるDeviseを使って、APIリクエストを行ったユーザーが認証されているかどうかを確認
するメソッドです。ユーザーが認証されていることを確認できます。
Railsを使ったAPI開発においては、before_actionフィルターを使用して、アクセス制御（認可）のために認証を要求するこ
とが一般的です。
------------------------------------------------------------------------------------------------
before_action :authenticate_api_v1_user!, only: [:index]
ユーザーの index ページ（ユーザー一覧ページ）は、認証（サインイン）したユーザーにしか見せないようにする。
------------------------------------------------------------------------------------------------
set_user
アクションで使用する前に、特定のユーザーをデータベースから取得して @user インスタンス変数に割り当てることを目的と
しています。つまり、@user はコントローラー内の多くのアクションで使用される可能性があるため、その値をセットすること
で、コードの重複を避け、保守性を高めることができます。

================================================================================================
3
params[:page] || 1
「params[:page]が存在する場合はparams[:page]を使い、そうでない場合は1を使う

User.all
データベース内の全てのUserレコードを取得するActive Recordのメソッド

page(page)
Kaminariというページネーション用のgemで提供されているメソッドで、指定されたページのレコードを取得するためのメソッ
ドです。

per(per_page)
Kaminariで提供されているメソッドで、1ページあたりに表示するレコード数を指定するためのメソッドです。

@users = User.all.page(page).per(per_page)の@usersの中身
現在のページに表示するために必要なUserレコードが格納された配列です。Kaminariのpageとperメソッドによって、現在の
ページに表示するための必要なUserレコードの数だけを取得し、@usersに格納しています。
------------------------------------------------------------------------------------------------
1. @users = User.all
- 全てのユーザー情報がデータベースから取得され、@users変数に格納される。ここでは、1ページあたり10件の場合、80件の
ユーザー情報が取得される。
2. @users = User.all.page(page)
- ページネーションが適用され、指定された「page」のページに含まれる情報のみが取得され、@users変数に格納される。た
とえば、2ページ目の場合、11~20件目のユーザー情報が取得される。
3. @users = User.all.page(page).per(per_page)
- ページネーションが適用され、指定された「page」のページに含まれる情報のうち、「per_page」で指定された数に制限
され、@users変数に格納される。たとえば、2ページ目で1ページあたり10件の場合、11~20件目のユーザー情報が取得される。
------------------------------------------------------------------------------------------------
意図
現在のページに必要なUserレコード数を取得し、その配列を@usersに格納することで、APIからフロントへ返却されるデータを
ページネーションに対応した形式に変換することが目的です。
具体的には、Kaminariの`page`と`per`メソッドを使用して、現在のページ番号と1ページあたりに表示するアイテム数を指定
し、`User.all`で全てのユーザー情報を取得した結果から、必要な範囲のデータを取得しています。
取得されたデータは、`@users`という配列に格納され、最終的にJSON形式で返却されます。

================================================================================================
4
admin?
current_api_v1_user オブジェクトの admin? メソッドを呼び出している。このメソッドは、current_api_v1_user オ
ブジェクトが管理者であるかどうかを判定するために使用される。
admin 属性を User モデルに 追加すると、自動的に admin?メソッド(論理値を返す)も使えるようになる。
------------------------------------------------------------------------------------------------
current_api_v1_user
Devise Token Auth のヘルパーメソッド。現在のユーザーオブジェクトを返す。
------------------------------------------------------------------------------------------------
&.（ぼっち演算子）
Rubyの演算子の一つ、セーフナビゲーション演算子。オブジェクトの「メソッド呼び出し」を安全に行うためのものです。
オブジェクト&.メソッドの形式で使用します。
オブジェクトが nil の場合、メソッド呼び出しの結果は 、エラーにならず、nil になります。エラーになりません。オブジェ
クトが nil でない場合は、通常のメソッド呼び出しと同じ結果が得られます。
オブジェクトが存在しない可能性がある場合や、メソッド呼び出し時にエラーを回避したい場合に便利な演算子です。特にオブ
ジェクトのチェーンやネストしたメソッド呼び出しで使用すると、より安全なコードを記述することができます。
current_api_v1_user&.admin?
------------------------------------------------------------------------------------------------
unless current_api_v1_user&.admin?
current_api_v1_user が存在し、かつ admin? メソッドが呼び出せる場合に条件を満たす。
つまり、現在のユーザーが存在し、かつ管理者でない場合に条件が成立します。エラーレスポンスを返します。
管理者以外のユーザーが特定のアクションを実行しようとした場合にエラーメッセージを返すための制御フローです。
------------------------------------------------------------------------------------------------
もし、unless current_api_v1_user.admin?だと、admin属性を正しくチェックしているように見えますが、
current_api_v1_userがnil（ログインしていない状態）の場合にエラーが発生します。そのため、
current_api_v1_user&.admin?として安全な参照を行います。

================================================================================================
5
`current_user = User.find(params[:id])`の`params[:id]`は、ルーティングパラメーターのidを指しています。
このidはURLの一部として送られ、Railsのルーティングによってパラメーターとして取り出されます。
------------------------------------------------------------------------------------------------
# models/user.rbで定義したfollowing?メソッドを使って、フォローしているかどうかを確認
is_following = current_user.following?(other_user)
------------------------------------------------------------------------------------------------
フロントエンドでユーザーがあるユーザーをフォローしているかどうかを確認するには、APIを通じてバックエンドに問い合わせ
るのが適切です。フロントエンドがその情報を保持するとなると、データの同期問題などが生じる可能性があります。

バックエンド側で、ユーザーが他のユーザーをフォローしているかどうかを確認するには、Userモデルの`following?`メソッ
ドを使うのが適切です。`following?`メソッドは引数で渡されたユーザーが`following`リストに含まれるかを確認します。

バックエンドのロジックは主にコントローラーに書くのが適切です。今回の場合、ユーザーが特定のユーザーをフォローしている
か確認するためのAPIエンドポイントを作成するため、`users_controller.rb`にそのロジックを追加します。
------------------------------------------------------------------------------------------------
フォローの状態はユーザーの一部の状態（属性）として考えることができます。したがって、特定のユーザーが他のユーザーをフ
ォローしているかどうかを確認する操作は、ユーザーというリソースの一部を扱う操作と捉えることができます。
それにより、users_controller.rbでその操作を処理するという選択がなされます。

一般的にRESTfulな設計をする際、あるリソースに対する操作はそのリソースのコントローラーで行うのが基本です。しかし、実
際の設計はビジネスロジックや開発チームの好みにより変わる可能性があります。従って、users_controller.rbか、あるいは
relationships_controller.rbにその処理を書くかは設計次第です。そのため、どちらの方法も一般的によく見られます。
ただし、users_controller.rbに書く方が単一責任の原則に近く、リソース指向設計の観点からは好ましいと思われます。
================================================================================================
6
. `user_likes = user.likes.includes(:post)`は適切です。
includesメソッドの基本構文
モデル名.includes(:関連名) # 関連名はテーブル名ではない
includesメソッドに渡す引数は、テーブル名ではなくアソシエーションで定義した関連名を指定します。
例えば関連名は、belongs_to :postの場合はpostになります。
------------------------------------------------------------------------------------------------
`user_likes = user.likes.includes(:post)` の `user_likes` の中身は、ログインユーザー（`user`）がいいね
した `Like` オブジェクトの配列です。
[id: 29,
  post_id: 617,
  user_id: 2,
  created_at: Mon, 31 Jul 2023 09:00:11.878736000 UTC +00:00,
  updated_at: Mon, 31 Jul 2023 09:00:11.878736000 UTC +00:00>, ..., ...,
]
ここで `includes(:post)` は事前に `post` を読み込むための命令で、これにより後の処理（`like.post`）で毎回デー
タベースにアクセスすることなく `post` の情報を取得できます。
つまり、`user_likes` の各要素は `Like` オブジェクトで、それぞれがいいねした `post` の情報も含んでいます。
`Like` テーブルのレコードのみに見えますが、内部的には `Like` テーブルに関連する `post` テーブルのレコードも含め
て取得する事が出来ています。
つまり、こう
[
  # いいねオブジェクトの例
  <Like id: 1, user_id: 1, post_id: 2, created_at: "2023-06-01 00:00:00", updated_at: "2023-06-01 00:00:00",
    post: <Post id: 2, title: "Post title", content: "Post content", user_id: 3, created_at: "2023-06-01 00:00:00", updated_at: "2023-06-01 00:00:00">>,
...
]
したがって、次の行の `user_likes.map { |like| like.post }` で各 `Like` オブジェクトから `post` を取り出し
、それを `liked_posts` 配列に格納することが出来ます。これが includes(:post) によって可能になります。
------------------------------------------------------------------------------------------------
- `user.likes.includes(:post)`は、ログインユーザーがいいねした投稿（Post）を取得する際にN+1問題を解消するた
めの記述です。
- このコードは現在のログインユーザー（`user`）のいいねデータ（`likes`）とそれに関連する投稿データ（`:post`）を一
度のクエリで取得します。この処理は、`user.likes`を繰り返す度に投稿（`:post`）のデータを毎回データベースから取得す
る必要を無くすためのものです。
- `includes`はActiveRecord::Relationのメソッドで、主にN+1問題の解消に使われます。このメソッドを使用すると、
関連データを一度に事前読み込み（プリロード）することができ、データベースへの不必要な問い合わせを減らすことが可能で
す。
- つまり、`user.likes.includes(:post)`は、「ユーザーの「いいね」データとそれに関連する投稿データを一度の問い合
わせで取得する」という意味になります。
------------------------------------------------------------------------------------------------
N+1問題はデータベースとのやり取りにおいて頻出するパフォーマンス問題で、主に関連するデータを取得する際に発生します。
N+1問題は、まず1回のクエリで「親」データを取得し（これが「+1」）、次にそれぞれの「親」について「子」データを取得す
るためにN回のクエリを発行する（これが「N」）、という過剰なデータベースへの問い合わせが行われる問題です。

`user.likes`だけで取得する場合、以下の手順でデータベースとのやり取りが行われます。
1. ユーザーが「いいね」した全ての「いいね」データを取得（これが「+1」の部分）
2. それぞれの「いいね」に紐づく投稿データ（`:post`）を取得するために「いいね」の数だけクエリを発行（これが「N」の
部分）
例えば、もしユーザーが10個の「いいね」をしている場合、それぞれの「いいね」について投稿データを取得するため、合計で11
回（1（ユーザーのいいね取得） + 10（各いいねに対する投稿データの取得））のデータベースへの問い合わせが発生します。
これがN+1問題です。
対策として`includes(:post)`を使用すると、以下の手順でデータベースとのやり取りが行われます。
1. ユーザーが「いいね」した全ての「いいね」データとそれに関連する投稿データを一度のクエリで取得
その結果、データベースへの問い合わせ回数が大幅に削減され、アプリケーションのパフォーマンスが向上します。
------------------------------------------------------------------------------------------------
. `likes_data_with_post = user_likes.map do |like| { like_data: like, post_data: like.post } end`
- この部分は、取得した「いいね」（`user_likes`）に対して`.map`メソッドを使用しています。`.map`メソッドは、元の
配列の各要素に対してブロック内の処理を行い、その結果を新たな配列として返すメソッドです。
- ここでは、各「いいね」データ（`like`）とそれに対応する投稿データ（`like.post`）をハッシュ形式で格納しています。
これにより、`likes_data_with_post`という配列が作成され、各要素はユーザーの「いいね」とその「いいね」に対応する投
稿データのハッシュになります。

================================================================================================
7
フロント側のapi関数で、いいねの総数のみを取得する専用の関数とページネーション用の関数を分けるために、
`total_likes_count` を作成。
------------------------------------------------------------------------------------------------
ページネーション用の1ページあたりの件数と、そのいいねの総数を取得する機能を一つのapi関数でまとめると、総数だけ取得
する場合、そのapi関数の引数のpage?: number, itemsPerPage?: numberがいらない。
それを条件分岐でさらに処理すると、複雑な関数になる。
------------------------------------------------------------------------------------------------
関数を分けた方が良いと考えます。理由は以下の通り。
機能が異なる場合、関数を分けることで、各関数の役割が明確になり、コードの可読性が向上する。
ページネーションと総数取得の機能が混在していると、将来的に変更があった際の修正が複雑になる可能性がある。
分割することで、テストが容易になり、バグの発見もしやすくなる。

================================================================================================
8
# n+1問題が発生するため、user.likes.allで取得しない。
# includes(:post)により、user_likesの各要素に対して、postを事前に取得している。
------------------------------------------------------------------------------------------------
当初のコード
# n+1問題が発生するため、user.likes.allで取得しない。
user_likes = user.likes.includes(:post)
# includes(:post)により、user_likesの各要素に対して、postを事前に取得している。
liked_posts = user_likes.map { |like| like.post }.page(page).per(per_page)
------------------------------------------------------------------------------------------------
当初のコードがうまくいかなかった理由
1. **メソッドチェーンの順序の問題**:
- 最初のコードでは、`page`メソッドが配列に対して呼び出されています。
- `user_likes.map { |like| like.post }` の結果は通常のRubyの配列であり、Kaminariのページネーションメソッド
が適用できるActiveRecordのリレーションではありません。
- したがって、`page`メソッドはこのコンテキストでは動作しません。
2. **正しい動作のコードの理由**:
liked_posts = user.likes.includes(:post).page(page).per(per_page).map { |like| like.post }
- うまく作動したコードでは、`page`メソッドがActiveRecordのリレーションに対して呼び出されています。
- `user.likes.includes(:post)`の結果はActiveRecordのリレーションであるため、Kaminariの`page`メソッドが適
切に動作します。
- その後、ページネーションが適用されたリレーションに対して`map`メソッドを使用して、必要なポストを取得しています。
以上のように、ページネーションメソッド`page`の挙動の問題ではなく、メソッドチェーンの順序による問題でした。
=end
