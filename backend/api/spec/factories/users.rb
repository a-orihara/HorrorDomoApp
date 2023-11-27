# 1
FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { 'testtest' }
    password_confirmation { 'testtest' }
    # mail認証
    confirmed_at { Time.now }
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
FactoryBot.defineブロックを使って、FactoryBotに新しいファクトリを定義します。
factory :userで、Userモデルのファクトリを作成します。使用する場合は、FactoryBot.create(:user)と記述します。
------------------------------------------------------------------------------------------------
FactoryBotはファクトリ名（この場合:user）から自動的にモデルクラスを推測します。
このため、ファクトリ名がモデル名と一致している場合は、クラスを指定しなくても問題ありません。
ファクトリ名が一致していない場合、class名を指定する。
factory :momo, class: User
end
------------------------------------------------------------------------------------------------
nameフィールドには、Faker::Name.nameを使ってランダムな名前を生成します。
Fakerは、ダミーデータを生成するためのライブラリです。
Faker::Nameは、Faker gemの名前に関する機能を提供するクラスです。
nameメソッドは、ランダムな名前を生成するためのメソッドです。
::はrubyの階層構造を表す演算子です。
------------------------------------------------------------------------------------------------
emailフィールドには、Faker::Internet.unique.emailを使って一意のランダムなメールアドレスを生成します。
Faker::Internetは、Faker gemのインターネット関連の機能を提供するクラスです。
unique.emailメソッドは、重複しないランダムなメールアドレスを生成するためのメソッドです。
このメソッドは、Faker gemが提供する重複しない一意の値を生成する機能を使用します。
=end
