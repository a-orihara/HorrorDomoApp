FactoryBot.define do
  factory :micropost do
    content { "MyContent" }
    # 1
    user { nil }
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
user { nil } の user は micropost モデルの user アソシエーションを指しており、実際には user_id という外部
キーを表しています。
------------------------------------------------------------------------------------------------
他の書き方
外部キーを指定する方法には、単に関連するオブジェクトを生成する方法もあります。例えば、ユーザーがあらかじめ存在してい
てそのオブジェクトを使いたい場合には、以下のように書くことができます。

FactoryBot.define do
  factory :micropost do
    content { "MyContent" }
    user { FactoryBot.create(:user) }
  end
end

ここで user { FactoryBot.create(:user) } と書くことで、micropost を作成する際に新たに user も一緒に作成さ
れ、その user が micropost の user アソシエーションに設定されます。
=end
