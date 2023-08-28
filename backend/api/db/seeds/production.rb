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
  profile: profiles.sample,
)

user2 = User.create!(
  name: 'koko',
  email: 'koko@koko.com',
  password: 'kokoko',
  password_confirmation: 'kokoko',
  profile: profiles.sample,
)

model_users = [user1, user2]

model_users.each do |user|
  20.times do
    content = contents.sample
    title = titles.sample
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

image_paths = %w[
  app/assets/images/man1.png
  app/assets/images/man2.png
  app/assets/images/man3.png
  app/assets/images/woman1.png
  app/assets/images/woman2.png
  app/assets/images/woman3.png
]

50.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@railstutorial.org"
  password = "password"
  profile = profiles.sample
  user = User.create!(name:  name,
                email: email,
                password:              password,
                password_confirmation: password,
                profile: profile)
  image_path = Rails.root.join(image_paths.sample)
  user.avatar.attach(io: File.open(image_path), filename: File.basename(image_path), content_type: 'image/png')
  20.times do
    content = contents.sample
    title = titles.sample
    created_at = Faker::Date.between(from: 1.years.ago, to: Date.today)
    user.posts.create!(content: content, title: title, created_at: created_at)
  end
end

allusers = User.all

allusers.each do |user|
  random_following = allusers.where.not(id: user.id).sample(rand(10..15))
  random_following.each do |followed|
    next if user.following?(followed)
    user.follow(followed)
  end
  other_user_posts = Post.where.not(user_id: user.id)
  20.times do
    post = other_user_posts.sample
    next if user.already_liked?(post)
    user.likes.create!(post_id: post.id)
  end
end