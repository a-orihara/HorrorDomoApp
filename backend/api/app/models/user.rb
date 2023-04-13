# frozen_string_literal: true

# Rails 5.0 以降を使用している場合は、User < ActiveRecord::Baseから変更。
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User
  # 1 ↓validates(:name, { presence: true, length: { maximum: 30 } })の省略形
  validates :name,  presence: true, length: { maximum: 30 }
  # 2
  validates :email, length: { maximum: 255 }
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
devise_token_auth は、デフォルトでは name 属性に対して presence: true や uniqueness: true のようなバリ
デーションは設定されていません。
emailに対しては、presence: trueやuniqueness: trueのバリデーションが初めから付いている。また、デフォルトで
email 属性にはフォーマットのバリデーションも設定されており、正しいメールアドレス形式であることが求められます。
下記は不要
.VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/
.validates :email, length: { maximum: 255 },  format: { with: VALID_EMAIL_REGEX }
*formatの部分

------------------------------------------------------------------------------------------------
validatesはActive Recordのメソッドです。
1つ以上の引数を取ることができます。一般的にはバリデーション対象の属性名をシンボルで指定し、その後にオプションのハ
ッシュを渡します。このオプションのハッシュには、バリデーションの種類やオプション、エラーメッセージなどを指定するこ
とができます。

validates(:email, { length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX } })
.バリデーション対象の属性名/:email
.オプションのハッシュ/{ length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX } }

================================================================================================
2
format
フォーマットの制約を指定するオプションであり、この場合はemailが正規表現VALID_EMAIL_REGEXに一致することを指定し
ています。
指定できるのは正規表現（Regexpオブジェクト）のみです。
formatオプションの引数はハッシュであり、メソッドではありません。

with
正規表現のパターンを指定するオプションであり、この場合はemailが正しいフォーマットであることを確認するために使用さ
れます。

# 以前の内容。メールアドレスが小文字で統一されれば、大文字小文字を区別するマッチが問題なく動作できるから不要に。
# :case_sensitive:大文字小文字の違いを区別する。
uniqueness: { case_sensitive: false },
=大文字小文字の違いを区別しない。つまり小文字のメアドと同じ文字の大文字のメアドは、区別しないので、同じ文字と判断
され、登録されない。

=end
