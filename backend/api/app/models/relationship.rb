class Relationship < ApplicationRecord
  # 1 :followerメソッドの生成（（外部キー:followed_id）の設定）
  belongs_to :follower, class_name: "User"
  # 2
  belongs_to :followed, class_name: "User"
  validates :follower_id, presence: true
  validates :followed_id, presence: true
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
RelationshipをUseモデルと外部キーfollower_idで紐付けてという意味
------------------------------------------------------------------------------------------------
belongs_to :follower, class_name: "User"
followerという名前（任意）のクラスに所属しているが、Relationshipは中間モデルなので、そのクラスの実体はUserクラ
スを指しているという意味。
------------------------------------------------------------------------------------------------
postだとこういう書き方
belongs_to :user
これはpostはuserに属し、railsはデフォルトで、外部キーはuser_idであるとして探す。
------------------------------------------------------------------------------------------------
ちなみにuser側はこのような記載に
has_many :active_relationships, class_name: "Relationship",
                                foreign_key: "follower_id",
has_many :active_relationships の関連性を示す際に、foreign_key: "follower_id" を指定することで、
active_relationships テーブル（クラス名：Relationship）の follower_id カラムが User モデルの外部キーとなる
ことを明示しています。
------------------------------------------------------------------------------------------------
belongs_to :follower, class_name: "User" によって生成されるメソッド
follower
`follower` の使用例は以下の通りです。relationshipインスタンスに対して：
- `relationship.follower`：`relationship` オブジェクトのフォロワー（follower）を取得します。
- `relationship.follower.name`：`relationship` オブジェクトのフォロワーの名前を取得します。
- `relationship.follower.posts`：`relationship` オブジェクトのフォロワーが作成した投稿を取得します。
------------------------------------------------------------------------------------------------
外部キーは（follower_id）になる。
foreign_keyを使う場合は、基本的にはbelongs_toを設定した側（relationshipモデル）に記載するが、外部キーが標準の
命名規則（follower_id, followed_id）に従っているため、relationshipモデルでは不要。
------------------------------------------------------------------------------------------------
. **Userモデル間の多対多の関係性**
- `relationships`モデルを介してUserモデル同士が多対多の関係になっている。これは、一人のユーザーが複数のユーザー
をフォローでき、また複数のユーザーにフォローされる状況を表している。
- `Relationship`モデルは`follower_id`と`followed_id`の二つの外部キーを持つ。これらは`User`モデルへの参照で
ある。
- `User`モデルにおいて、`has_many :active_relationships`はユーザーがフォローしている他のユーザーを表し、
`foreign_key: "follower_id"`はこのユーザーがフォロワーであることを示す。これにより、一人のユーザーが複数のユー
ザーをフォローできる。

================================================================================================
2
belongs_to :followed, class_name: "User"
`followed` の使用例は以下の通りです：
- `relationship.followed`：`relationship` オブジェクトがフォローしているユーザー（followed）を取得します。
- `relationship.followed.email`：`relationship` オブジェクトがフォローしているユーザーのメールアドレスを取
得します。
- `relationship.followed.posts`：`relationship` オブジェクトがフォローしているユーザーの投稿を取得します。
=end
