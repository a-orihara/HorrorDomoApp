# 1
class CreateRelationships < ActiveRecord::Migration[6.1]
  def change
    create_table :relationships do |t|
      # 2 idのカラムを作成。外部キーとして使用。
      t.integer :follower_id
      t.integer :followed_id

      t.timestamps
    end
    # 2
    add_index :relationships, :follower_id
    add_index :relationships, :followed_id
    add_index :relationships, [:follower_id, :followed_id], unique: true
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
$ rails generate model Relationship follower_id:integer followed_id:integer
で作成

================================================================================================
2
foreign_keyとは、参照先を参照するための外部キーの名前を指定するもの。
つまり、belongs_toで参照する相手（参照先:user）の外部キーを指定するために、belongs_toを行う側(relationship)
のmodelファイルに記述しなければならないもの
================================================================================================
3
add_index
指定したテーブルにインデックスを追加。インデックスとは、データベースの検索性能を向上させるためのデータ構造。
------------------------------------------------------------------------------------------------
add_index :relationships, :follower_id は、relationships テーブルにおいて follower_id 列に対して単一の
インデックスを作成する操作です。
この単一のインデックスは、follower_id 列に基づいた検索や並び替えなどのクエリを効率的に実行するために使用されます。
------------------------------------------------------------------------------------------------
:relationshipsと[:follower_id, :followed_id]の2つの引数
:relationshipsはインデックスを追加するテーブルを指定します。
[:follower_id, :followed_id]はインデックスを作成するフィールドを指定します。follower_id, :followed_idの両
方を1つの配列に含めている。こうすることで Active Record は、両方のキーを同時に扱う複合キーインデックス
(Multiple Key Index)作成します。
------------------------------------------------------------------------------------------------
follower_id と followed_id には、複合キーインデックスと単一のインデックスの2つが付与されます。つまり、両方の列
に対して個別のインデックスが作成されます。
follower_id と followed_id の組み合わせが必ずユニークであることを保証する仕組みです。これにより、あるユーザーが
同じユーザーを 2 回以上フォローすることを防ぎます。
このような重複(2 回以上フォロー すること)が起きないよう、インターフェイス側の実装でも注意を払います。しかし、ユーザ
ーが何らかの方法で(例えば curl などのコマンドラインツールを使って) Relationship のデータを操作するようなことも
起こり得ます。そのような場合でも、一意 なインデックスを追加していれば、エラーを発生させて重複を防ぐことができます。
------------------------------------------------------------------------------------------------
複合キーインデックスとは、複数のカラム（列）を組み合わせたインデックスのことです。
この場合、:follower_id と :followed_id の2つのカラムを組み合わせて複合キーインデックスを作成しています。
複合キーインデックスは、複数のカラムの値を組み合わせた検索条件に効果的なパフォーマンスを提供することができます。
例えば、:follower_id と :followed_id の組み合わせでの検索や並び替えが頻繁に行われる場合に、効率的な検索を可能
にします。
------------------------------------------------------------------------------------------------
このインデックスの設定により、以下のような使用が想定されています：
フォローしているユーザーを取得する際に、follower_id を検索条件として効率的に検索できます。
フォローされているユーザーを取得する際に、followed_id を検索条件として効率的に検索できます。
特定のユーザーが他のユーザーをフォローしているかどうかを判定する際に、follower_id と followed_id の組み合わせ
が一意であるかを確認することができます。
具体的な例としては、ユーザーAがユーザーBをフォローしている場合、follower_id にはユーザーAのIDが、followed_idに
はユーザーBのIDが格納されます。
このインデックスの設定により、ユーザーAがユーザーBをフォローしているかどうかを効率的に確認したり、ユーザーAがフォロ
ーしているユーザー一覧やユーザーBをフォローしているユーザー一覧を取得することができます。
------------------------------------------------------------------------------------------------
30のfollower_idに対して、必ずユニークなfollowed_idが存在することを保証するために、unique: trueを指定していま
す。
unique: true は、複合キーインデックスにおいて重複を許さない制約を設定するためのオプションです。
このオプションを指定することで、:follower_id と :followed_id の組み合わせが一意であることを保証します。
つまり、同じ :follower_id と :followed_id の組み合わせを持つレコードが複数存在しないようにします。
これにより、データの整合性を維持し、重複したレコードが作成されることを防ぎます。
------------------------------------------------------------------------------------------------

=end
