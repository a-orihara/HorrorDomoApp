require 'yaml'

profiles_path = Rails.root.join('db/seeds/profiles.yml')
titles_path = Rails.root.join('db/seeds/titles.yml')
contents_path = Rails.root.join('db/seeds/contents.yml')

profiles = YAML.load_file(profiles_path)['profiles']
titles = YAML.load_file(titles_path)['titles']
contents = YAML.load_file(contents_path)['contents']

user1 = User.create!(
  name: 'hiro',
  email: 'hiro@hiro.com',
  password: 'hirohiro',
  password_confirmation: 'hirohiro',
  admin: true,
  profile: profiles.sample,
  # 1.1
  confirmed_at: Time.current
)

user2 = User.create!(
  name: 'momo',
  email: 'momo@momo.com',
  password: 'momomomo',
  password_confirmation: 'momomomo',
  profile: profiles.sample,
  confirmed_at: Time.current
)

model_users = [user1, user2]

model_users.each do |user|
  # 投稿を20個作成
  20.times do
    # 投稿文作成
    content = contents.sample
    title = titles.sample
    # 作成日時を過去1年間のランダムな日付で作成
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    # 投稿を作成
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

# サンプルユーザーの画像パスを配列で作成
image_paths = %w[
  app/assets/images/man1.png
  app/assets/images/man2.png
  app/assets/images/man3.png
  app/assets/images/woman1.png
  app/assets/images/woman2.png
  app/assets/images/woman3.png
]

# 追加のユーザーをまとめて生成する
50.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@railstutorial.org"
  password = "password"
  profile = profiles.sample
  user = User.create!(name:  name,
                email: email,
                password:              password,
                password_confirmation: password,
                profile: profile,
                confirmed_at: Time.current)
  # avatar画像選択
  image_path = Rails.root.join(image_paths.sample)
  # avatar画像を登録
  user.avatar.attach(io: File.open(image_path), filename: File.basename(image_path), content_type: 'image/png')
  # 投稿を20個作成
  20.times do
    content = contents.sample
    title = titles.sample
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

# 全てのユーザーを格納
allusers = User.all

allusers.each do |user|
  # フォローする可能性のある他のユーザーを（10から15）ランダムに選択する。
  random_following = allusers.where.not(id: user.id).sample(rand(15..20))
  # 選択した他ユーザーの配列をループ
  random_following.each do |followed|
    # userが既に他ユーザーをフォローしているチェック。もしそうなら残りのブロックをスキップ
    next if user.following?(followed)
    user.follow(followed)
  end
  # DBから他ユーザーが作成した投稿を取得し、`other_user_posts` に格納
  other_user_posts = Post.where.not(user_id: user.id)
  75.times do
    post = other_user_posts.sample
    next if user.already_liked?(post)
    user.likes.create!(post_id: post.id)
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
. **Time.now vs Time.current**：
- Time.now`： これはシステムのローカルタイムゾーンに基づいた現在時刻を返します。システムのタイムゾーンがRailsア
プリケーションと同じゾーンに設定されていない場合、不整合が発生する可能性があります。
- Time.current`： これはRailsアプリケーションで設定されているタイムゾーンを尊重するRailsメソッドです。アプリケ
ーションの設定で `config.time_zone = 'Tokyo'` を設定すると、`Time.current` は常に東京のタイムゾーンの時刻を
返します。
------------------------------------------------------------------------------------------------
. **Railsのタイムゾーン設定**：
- config/application.rb`で`config.time_zone = 'Tokyo'`を設定すると、Railsに対して、時間に関連するすべて
の操作に東京のタイムゾーンを使うように指示することになります。これにより、データベースに保存されるすべてのタイムスタ
ンプがこのタイムゾーンと一致するようになります。
------------------------------------------------------------------------------------------------
. **なぜうまくいったのか**：
- 最初に`confirmed_at： Time.now`を使用していた場合、タイムスタンプは異なるタイムゾーン（システムのローカルタイ
ムゾーン）で設定されていた可能性が高く、時差によってはユーザーが確認されたと認識されない可能性がありました。
- そこで、`confirmed_at： Time.current`に変更し、Railsのタイムゾーンを東京に設定すると、確認に使用されるタイ
ムスタンプはアプリケーションの設定タイムゾーンと一致するようになりました。この一貫性により、seed直後のユーザが確認
されたと正しく認識されるようになりました。
------------------------------------------------------------------------------------------------
. **ベストプラクティス
- Railsアプリケーションでは、特にタイムゾーンを扱う場合、一般に`Time.now`よりも`Time.current`を使うのがよい習
慣です。
- Railsアプリケーションで特定のタイムゾーンを設定することは、特にアプリケーションのユーザが異なるタイムゾーンにい
る場合や、サーバのタイムゾーンがターゲットとするユーザと異なる場合に、不整合を避けるために非常に重要です。
=end