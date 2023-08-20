# [このファイルには、データベースのデフォルト値を設定するために必要なすべてのレコード作成が含まれているはずです。
#   その後、bin/rails db:seedコマンドでデータをロードすることができます（またはdb:setupでデータベースと一緒に
#   作成します）。]
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'yaml'

profiles_path = Rails.root.join('db/seeds/profiles.yml')
titles_path = Rails.root.join('db/seeds/titles.yml')
contents_path = Rails.root.join('db/seeds/contents.yml')

profiles = YAML.load_file(profiles_path)['profiles']
titles = YAML.load_file(titles_path)['titles']
contents = YAML.load_file(contents_path)['contents']

user1 = User.create!(
  name: 'momo',
  email: 'momo@momo.com',
  password: 'momomo',
  password_confirmation: 'momomo',
  admin: true,
  # 1
  # profile: Faker::Lorem.sentence(word_count: 20),
  profile: profiles.sample,
)

user2 = User.create!(
  name: 'koko',
  email: 'koko@koko.com',
  password: 'kokoko',
  password_confirmation: 'kokoko',
  profile: profiles.sample,
)

user3 = User.create!(
  name: 'soso',
  email: 'soso@soso.com',
  password: 'sososo',
  password_confirmation: 'sososo',
  profile: profiles.sample,
)

users = [user1, user2]

titles = [
  "オーメン", "ハロウィン", "エルム街の悪夢", "バタリアン", "ゾンビ", "ジョーズ",
  "ミスト", "サスペリア", "エイリアン", "スクリーム1", "悪魔のいけにえ", "死霊のはらわた1",
  "死霊館", "it", "ロボコップ", "ジョーカー", "ポルターガイスト", "エクソシスト1", "もののけ姫",
  "マッドマックス", "シャイニング", "プレデター1", "リング"
]

users.each do |user|
  25.times do
    content = contents.sample
    title = titles.sample # タイトルの配列からランダムに選ぶ
    # 作成日時を過去1年間のランダムな日付で作成
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

# 2 サンプルユーザーの画像パスを配列で作成
image_paths = %w[
  app/assets/images/man1.png
  app/assets/images/man2.png
  app/assets/images/man3.png
  app/assets/images/woman1.png
  app/assets/images/woman2.png
  app/assets/images/woman3.png
]

# 追加のユーザーをまとめて生成する
77.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@railstutorial.org"
  password = "password"
  profile = profiles.sample,
  user = User.create!(name:  name,
                email: email,
                password:              password,
                password_confirmation: password,
                profile: profile)
  # 3 画像のパスの配列からランダムに1つ選択
  image_path = Rails.root.join(image_paths.sample)
  # 4 その画像をユーザーのavatarに添付
  user.avatar.attach(io: File.open(image_path), filename: File.basename(image_path), content_type: 'image/png')
  20.times do
    content = contents.sample
    title = titles.sample # タイトルの配列からランダムに選ぶ
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

# 全てのユーザー
allusers = User.all
following = allusers[2..30]
followers = allusers[4..31]
# user1がフォロー
following.each { |followed| user1.follow(followed) }
# user1をフォロー
followers.each { |follower| follower.follow(user1) }
following = allusers[30..51]
followers = allusers[4..31]
# user2がフォロー
following.each { |followed| user2.follow(followed) }
# user2をフォロー
followers.each { |follower| follower.follow(user2) }

# 全てのユーザーをループ
allusers.each do |user|
  # すべての投稿から自分の投稿を除外（自分の投稿を除外した他のユーザーの投稿を取得）
  other_user_posts = Post.where.not(user_id: user.id)

  # 20回のループの中で、ランダムに投稿を選び、already_liked?メソッドを使ってその投稿を既にいいねしているか確認
  20.times do
    # 10回のループの中で、ランダムに投稿を選ぶ
    post = other_user_posts.sample
    # already_liked?メソッドを使ってその投稿を既にいいねしているか確認、すでにいいねしている場合はスキップ
    next if user.already_liked?(post)
    user.likes.create!(post_id: post.id)
  end
end


=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
Faker::Lorem
Faker gemのLoremクラスです。Loremクラスは、ダミーデータを生成するためのメソッドを提供します。
------------------------------------------------------------------------------------------------
sentence
Faker::Loremクラスのメソッドです。ランダムな単語の文を生成するためのメソッドです。
sentence(word_count: 5)は、5つの単語からなるランダムな文を生成するという意味です。
------------------------------------------------------------------------------------------------
(word_count: 5)
word_countというキーを持つハッシュが引数として渡されています。word_countは生成する文の単語数を指定するためのオ
プションです。値として5が指定されているため、5つの単語からなる文が生成されます。

================================================================================================
2
/app/assets/images/man1.png、にするとパスが見つからないので注意。
エラーが出る理由は、スラッシュ(/)で始まるパスは絶対パスと解釈されるからです。
つまり、/app/assets/images/man1.png は、システムのルートディレクトリからのパスとなります。
一方、app/assets/images/man1.png は相対パスとして解釈され、Rails.root.join を使ってRailsプロジェクトのルー
トディレクトリからのパスとして扱われます。

Rails.root.join("app/assets/images/man1.png") は、backend/api/app/assets/images/man1.png を返しま
す。
Rails.root.join("/app/assets/images/man1.png") は、/app/assets/images/man1.png を返し、このパスには
ファイルが存在しないため Errno::ENOENT: No such file ... のエラーが発生します。
Rails.root.join に与えるパスは、Railsプロジェクトのルートディレクトリからの相対パスであるべきです。
------------------------------------------------------------------------------------------------
%w
Rubyのリテラル表記の一つで、スペースで区切られた複数の文字列を要素とする配列を簡潔に記述するための記法です。
%wの後にスペースを空けて文字列を列挙し、[]で囲むことで、それらの文字列が要素として格納された配列を作成します。要素は
スペースを区切りとして分かれるため、カンマやクォーテーションが必要ありません。
次のような配列を作成しています。
["app/assets/images/man1.png",
  "app/assets/images/man2.png",
  "app/assets/images/man3.png",
  "app/assets/images/woman1.png",
  "app/assets/images/woman2.png",
  "app/assets/images/woman3.png"
]
------------------------------------------------------------------------------------------------
%wを使わない場合は、配列リテラルを通常の方法で定義することになります。カンマで区切って各要素を列挙し、[]で囲むこと
で配列を作成します。
image_paths = [
  "app/assets/images/man1.png",
  "app/assets/images/man2.png",
  "app/assets/images/man3.png",
  "app/assets/images/woman1.png",
  "app/assets/images/woman2.png",
  "app/assets/images/woman3.png"
]

================================================================================================
3
image_path = Rails.root.join(image_paths.sample)
image_pathsという配列からランダムに1つの画像パスを選択し、そのパスを指す絶対パスを生成し、変数image_pathに代入。
------------------------------------------------------------------------------------------------
Rails.root
Ruby on Railsアプリケーションのルートディレクトリを表す特殊な変数です。Railsによって自動的に設定されます。
戻り値として、Railsアプリケーションのルートディレクトリを示すPathnameオブジェクトが返されます。
------------------------------------------------------------------------------------------------
sample
RubyのArrayクラスのメソッド。配列からランダムに1つの要素を選択します。
たとえば、[1, 2, 3].sampleを実行すると、1、2、3の中からランダムに1つの数字が選ばれます。
したがって、image_paths.sampleは、image_paths配列からランダムに1つのパスを選択します。
------------------------------------------------------------------------------------------------
join
Rubyのメソッド。`Pathname`クラスや`File`クラス、`Dir`クラスなど、ファイルパスやディレクトリパスを扱うクラスでよ
く使われます。このメソッドは、引数として与えられたパス要素を連結し、新たなパスを生成します。
例えば、Rails.rootが`"/backend/api"`で、joinの引数が`"app/assets/images/man1.png"`であった場合、
`Rails.root.join("app/assets/images/man1.png")`の戻り値は、
`"/backend/api/app/assets/images/man1.png"`という文字列になります。

=end