class Relationship < ApplicationRecord
  # 1
  belongs_to :follower, class_name: "User"
  # 2
  belongs_to :followed, class_name: "User"
  validates :follower_id, presence: true
  validates :followed_id, presence: true
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
belongs_to :follower, class_name: "User"
followerという名前（任意）のクラスに所属しているが、そのクラスの実体はUserクラスという意味。
------------------------------------------------------------------------------------------------
belongs_to :follower, class_name: "User"
class_name: "User"を書いているのは、belongs_to :followerにすると、railsはデフォルトでfollowerクラスを探し
に行くから。実際にはRelationshipは、外部キーfollower_idにより、userモデルにbelong_toしている。

postだとこういう書き方
belongs_to :user
これはpostはuserに属し、railsはデフォルトで、外部キーはuser_idであるとして探す。

ちなみにuser側は公のような記載に
has_many :active_relationships, class_name: "Relationship",
                                foreign_key: "follower_id",
has_many :active_relationships の関連性を示す際に、foreign_key: "follower_id" を指定することで、
active_relationships テーブル（クラス名：Relationship）の follower_id カラムが User モデルの外部キーとなる
ことを明示しています。
------------------------------------------------------------------------------------------------
belongs_to :follower, class_name: "User" によって生成されるメソッド
follower
`follower` の使用例は以下の通りです：
- `relationship.follower`：`relationship` オブジェクトのフォロワー（follower）を取得します。
- `relationship.follower.name`：`relationship` オブジェクトのフォロワーの名前を取得します。
- `relationship.follower.posts`：`relationship` オブジェクトのフォロワーが作成した投稿を取得します。

================================================================================================
2
belongs_to :followed, class_name: "User"
`followed`
`followed` の使用例は以下の通りです：
- `relationship.followed`：`relationship` オブジェクトがフォローしているユーザー（followed）を取得します。
- `relationship.followed.email`：`relationship` オブジェクトがフォローしているユーザーのメールアドレスを取
得します。
- `relationship.followed.posts`：`relationship` オブジェクトがフォローしているユーザーの投稿を取得します。
=end
