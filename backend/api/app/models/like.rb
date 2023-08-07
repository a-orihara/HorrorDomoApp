class Like < ApplicationRecord
  # 1
  belongs_to :post
  belongs_to :user
  # 2
  validates :user_id, presence: true
  validates :post_id, presence: true
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
$ rails g model like post:references user:references コマンドで作成
------------------------------------------------------------------------------------------------
references型とは
references型は新しく作成するテーブルのカラムに、作成済みのテーブルを指定する場合に使う。
referencesはrails g modelで、モデルとマイグレーションファイルを生成する時のカラムの型を指定するときに使う。モデ
ル名(小文字):referencesの形で指定。

上記のコマンドを実行すると、
① reference型を指定したカラム名は テーブル名_id となる。つまりuser_id、post_id
② referencesを指定したことで、生成されたモデルファイルにbelongs_to :userが追加される。
------------------------------------------------------------------------------------------------
belongs_toとは
belongs_toとは他のテーブルとの関係性を示すもので、自分のテーブルが指定したテーブルの下に紐づいている（属している）
ことを示す。
モデルの中で belongs_to :モデル名(単数形)として指定される。
親となるテーブルには、下に複数のテーブルが紐づくことを示すために、has_many :モデル名(複数形)を記述。
referencesを使えば、belongs_toは自動で記述されるが、has_manyはつかないので、自分で親となるテーブルに記述する必
要がある。
------------------------------------------------------------------------------------------------
belongs_to :user
likesテーブルにuser_idという外部キーが作成されます。
このuser_idはusersテーブルの各レコード（ユーザー）を参照します。この記述により、likesモデルはuserモデルに対して、
"belongs to"（所属する）という関係を持つことを示しています。

-backend/api/app/models/user.rbのhas_many :likes, dependent: :destroyという記述は、直接的に外部キーを
作成しません。
この記述は、usersモデルとlikesモデルの関係を示すもので、「一つのユーザーは複数のいいねを持つことができる
（has many likes）」という意味になります。この際、dependent: :destroyというオプションは、userオブジェクトが
削除されたときに関連するlikesも一緒に削除するという意味を持ちます。likesテーブルに作成されるuser_idという外部キー
は、このhas_many :likesの記述と相互作用することで、関連を示します。
------------------------------------------------------------------------------------------------
`belongs_to :user`を`like.rb`に書き、対になる`has_many :likes`を`user.rb`に書かない場合でも、テーブルの関
連性そのものは失われません。つまり、`likes`テーブルの各レコードには依然として`user_id`という外部キーが存在し、そ
の外部キーを通じて`users`テーブルの特定のレコードを参照することが可能です。

ただし、`has_many :likes`の記述を省略すると、UserモデルからLikeモデルへのアソシエーションメソッドが使えなくなり
ます。例えば、特定のUserオブジェクト（`@user`）が持つLikeオブジェクトを取得する際に、`@user.likes`といった形で
簡単にアクセスすることができなくなります。

また、`dependent: :destroy`オプションがないと、Userオブジェクトが削除されたときに、そのUserに紐づいたLikeオブ
ジェクトはデータベースに残り続けます。これは、孤立したデータを引き起こし、それが将来的にエラーや不整合を生む可能性が
あります。

したがって、`has_many :likes`を省略するとは言え、その影響はデータの整合性やコードの便利さに影響を与えるため、通
常は両方のアソシエーションを設定します。
------------------------------------------------------------------------------------------------
1. `belongs_to :user`で作成されるメソッド
- `like.user` : そのLikeオブジェクトが参照しているUserオブジェクトを返す。
- `like.user=` : そのLikeオブジェクトが参照するUserオブジェクトを指定・変更する。
- `like.build_user(attributes)` : そのLikeオブジェクトに対応する新たなUserオブジェクトを生成する（まだ保存
はされない）。
- `like.create_user(attributes)` : そのLikeオブジェクトに対応する新たなUserオブジェクトを生成し、データベー
スに保存する。
- `like.create_user!(attributes)` : `create_user`の例外を投げるバージョン。保存に失敗した場合、
ActiveRecord::RecordInvalid例外が発生する。

2. `has_many :likes, dependent: :destroy`で作成されるメソッド
- `user.likes` : そのUserオブジェクトに関連付けられたLikeオブジェクトのコレクションを返す。
- `user.likes<<` : LikeオブジェクトをそのUserオブジェクトに関連付ける。
- `user.likes.delete` : 指定したLikeオブジェクトとそのUserオブジェクトとの関連付けを削除する。
- `user.likes.destroy` : 指定したLikeオブジェクトとそのUserオブジェクトとの関連付けを削除し、そのLikeオブジェ
クトをデータベースから削除する。
- `user.likes=likes` : 指定したLikeオブジェクトのコレクションとそのUserオブジェクトを関連付ける。既存の関連付
けは削除される。
- `user.likes.clear` : そのUserオブジェクトと全てのLikeオブジェクトとの関連付けを削除する。
- `user.likes.empty?` : そのUserオブジェクトに関連付けられたLikeオブジェクトが存在しない場合にtrueを返す。
- `user.likes.find` : そのUserオブジェクトに関連付けられたLikeオブジェクトからidを用いて検索する。
- `user.likes.where` : そのUserオブジェクトに関連付けられたLikeオブジェクトから条件を用いて検索する。
- `user.likes.build(attributes)` : そのUserオブジェクトに関連付けられる新たなLikeオブジェクトを生成する（ま
だ保存はされない）。
- `user.likes.create(attributes)` : そのUserオブジェクトに関連付けられる新たなLikeオブジェクトを生成し、デ
ータベースに保存する。
- `user.likes.create!(attributes)` : `create`の例外を投げるバージョン。保存に失敗した場合、
ActiveRecord::RecordInvalid例外が発生する。

================================================================================================
2
Likeにはuser_id、micropost_idが必須。1人が１つの投稿に対して、１つしかいいねをつけられない。
=end
