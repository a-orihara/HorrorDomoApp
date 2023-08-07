class Api::V1::HomePagesController < ApplicationController
  before_action :authenticate_api_v1_user!

  # UserHomePageで取得するfeedをhomeアクションから取得
  def home
      page = params[:page] || 1
      per_page = params[:per_page] || 10
      if params[:user_id]
        # feed_itemはpostインスタンスの集合
        feed_items = current_api_v1_user.feed.page(page).per(per_page)
        # feed_itemsにいいねしているかの真偽値を持たせる
        feed_items_with_likes = feed_items.map do |item|
          # いいねしているかの真偽値をlikedに代入
          liked = current_api_v1_user.already_liked?(item)
          # 2
          item.as_json.merge(liked: liked)
        end
        feed_total_count = current_api_v1_user.feed.count
        # 1 ここにユーザーの配列?
        # feed_itemsのfeed_user_idsである事に注意
        feed_user_ids = feed_items.map(&:user_id).uniq
        # feed_user_idsに紐づくuser情報を取得
        feed_users = User.where(id: feed_user_ids)
        # 各ユーザに対してgenerate_avatar_urlを実行し、as_jsonとmergeを使って、avatar_urlを含む新しいハッシュを生成
        feed_users_with_avatar = feed_users.map do |user|
          avatar_url = generate_avatar_url(user)
          user.as_json.merge(avatar_url: avatar_url)
        end
        # 返り値:feed（1.feedPostの集合, 2.feedPost総数, 3.feedのuserIdに紐づくfeeduserの集合）
        render json: {
          status: '200',
          # いいねしているかの真偽値を持たせたfeed_
          data: feed_items_with_likes,
          # feed_total_countはpaginationに必要
          feed_total_count: feed_total_count,
          # avatar情報付属したfeed_users
          feed_users: feed_users_with_avatar
        }, status: :ok
      else
        render json: { status: '404', message: 'ユーザーを取得出来ません' }, status: :not_found
      end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
user_ids = feed_items.map(&:user_id).uniq
= user_ids = feed_items.map { |item| item.user_id }.uniq
------------------------------------------------------------------------------------------------
uniq はRubyの配列（Array）に対して使われるメソッド
uniq メソッドは、配列から重複する要素を取り除いた新しい配列を返します。
元の配列は変更されずにそのまま残ります。
重複している要素が複数ある場合、最初に出現した要素が残ります。

例えば、以下のような配列があった場合：
numbers = [1, 2, 2, 3, 3, 4, 5, 5]
numbers.uniq を実行すると、
unique_numbers = numbers.uniq
# => [1, 2, 3, 4, 5]

numbers 配列自体は変更されないため、unique_numbers を使って重複のない配列を取得できます。
これは重複を除去した一意の値のリストを作成する際によく使用されるメソッドです。
================================================================================================
2
`item.as_json.merge(liked: liked)`
- `item.as_json`: `item`（`post` インスタンス）をハッシュ形式に変換します。このハッシュには `item` の属性が
キーとして、その属性値が値として含まれます。
- `liked: liked`: `liked` の値（真偽値）を `item` のハッシュに `liked` というキーで追加します。これにより、
`item` のハッシュに `liked` というキーで、`liked` 変数（`current_api_v1_user.already_liked?(item)` の
結果）の真偽値が格納されます。
- `item.as_json.merge(liked: liked)` は、`item` の属性を含むハッシュに `liked` の情報（真偽値）を追加した
新しいハッシュを生成します。この操作により、各 `item` の「いいね」情報を格納した `feed_items_with_likes` 配列
が作成されます。
- `merge` メソッドは、ハッシュ同士を結合するために使用されます。引数として与えられたハッシュのキーと値を、元のハッ
シュに追加して新しいハッシュを生成します。重複するキーがある場合は、引数として与えられたハッシュの値が優先されます。
=end
