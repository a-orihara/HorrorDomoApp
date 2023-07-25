class Api::V1::HomePagesController < ApplicationController
  before_action :authenticate_api_v1_user!

  # current_api_v1_userは使える？
  def home
      page = params[:page] || 1
      per_page = params[:per_page] || 10
      if params[:user_id]
        user = User.find_by(id: params[:user_id])
        # feed_itemはmicropostインスタンスの集合
        feed_items = current_api_v1_user.feed.page(page).per(per_page)
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
        # 返り値:feed,feed総数,feedのuserIdの集合,feedのuserIdに紐づくuserの集合
        render json: {
          status: '200',
          data: feed_items,
          feed_total_count: feed_total_count,
          feed_user_ids: feed_user_ids,
          feed_users: feed_users_with_avatar
        }, status: :ok
      else
        render json: { status: '404', message: 'User not found' }, status: :not_found
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
------------------------------------------------------------------------------------------------
=end
