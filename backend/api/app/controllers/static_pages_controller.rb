# 1
class StaticPagesController < ActionController::Base
  # 2
  def home
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @
1
ファイル名はスネークケース:[static_pages_controller.rb]

-          --          --          --          --          --          --          -
apiモードでは、[ActionController::Base]を継承しないと動かない。
[class StaticPagesController < ApplicationController]ではダメ。

=          ==          ==          ==          ==          ==          ==          =
2
/static_pages/home という URL にアクセスすると、Rails は StaticPages コントロー ラを参照し、
home アクションに記述されているコードを実行します。その後、そのアクションに対応するビューを出力しま
す。homeアクションが空になっているので、home.html.erb というビューが表示されます。
=end
