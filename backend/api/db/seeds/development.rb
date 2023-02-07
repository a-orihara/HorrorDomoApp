# 1
User.create!(name: "dev1",
             email: "dev1@dev1.com",
             password: "dev1dev1",
             password_confirmation: "dev1dev1")

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
create!は基本的に create メソッドと同じものですが、ユーザーが無効な場合に false を返すのではなく例外を発生させ
る点が異なります。こうしておくと見過ごしやすいエラーを回避できるので、デバッグが容易になります。
=end