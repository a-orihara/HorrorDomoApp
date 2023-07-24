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
        user_ids = feed_items.map(&:user_id).uniq
        render json: { status: '200', data: feed_items, total_count: feed_total_count }, status: :ok
      else
        return render json: { status: '404', message: 'User not found' }, status: :not_found
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
=end
