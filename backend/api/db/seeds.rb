# [このファイルには、データベースのデフォルト値を設定するために必要なすべてのレコード作成が含まれているはずです。
#   その後、bin/rails db:seedコマンドでデータをロードすることができます（またはdb:setupでデータベースと一緒に
#   作成します）。]
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user1 = User.create!(
  name: 'momo',
  email: 'momo@momo.com',
  password: 'momomo',
  password_confirmation: 'momomo',
  admin: true,
  # 1
  profile: Faker::Lorem.sentence(word_count: 20),
)

user2 = User.create!(
  name: 'koko',
  email: 'koko@koko.com',
  password: 'kokoko',
  password_confirmation: 'kokoko',
  profile: Faker::Lorem.sentence(word_count: 20),
)

user3 = User.create!(
  name: 'soso',
  email: 'soso@soso.com',
  password: 'sososo',
  password_confirmation: 'sososo',
  profile: Faker::Lorem.sentence(word_count: 20),
)

users = [user1, user2, user3]

users.each do |user|
  3.times do
    content = Faker::Lorem.characters(number: 77)
    user.microposts.create!(content: content)
  end
end

# 追加のユーザーをまとめて生成する
77.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@railstutorial.org"
  password = "password"
  profile = Faker::Lorem.sentence(word_count: 20)
  user = User.create!(name:  name,
                email: email,
                password:              password,
                password_confirmation: password,
                profile: profile) # プロフィールを追加
  3.times do
    content = Faker::Lorem.characters(number: 77)
    user.microposts.create!(content: content)
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
=end