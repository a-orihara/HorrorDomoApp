# This migration comes from active_storage (originally 20170806125915)
# 1
class CreateActiveStorageTables < ActiveRecord::Migration[5.2]
  def change
    # Use Active Record's configured type for primary and foreign keys
    # [主キーと外部キーにActive Recordの設定された型を使用する]
    primary_key_type, foreign_key_type = primary_and_foreign_key_types

    # 2
    create_table :active_storage_blobs, id: primary_key_type do |t|
      t.string   :key,          null: false
      t.string   :filename,     null: false
      t.string   :content_type
      t.text     :metadata
      t.string   :service_name, null: false
      t.bigint   :byte_size,    null: false
      t.string   :checksum,     null: false
      t.datetime :created_at,   null: false

      t.index [ :key ], unique: true
    end

    # 3
    create_table :active_storage_attachments, id: primary_key_type do |t|
      t.string     :name,     null: false
      t.references :record,   null: false, polymorphic: true, index: false, type: foreign_key_type
      t.references :blob,     null: false, type: foreign_key_type

      t.datetime :created_at, null: false

      t.index [ :record_type, :record_id, :name, :blob_id ], name: "index_active_storage_attachments_uniqueness", unique: true
      t.foreign_key :active_storage_blobs, column: :blob_id
    end

    create_table :active_storage_variant_records, id: primary_key_type do |t|
      t.belongs_to :blob, null: false, index: false, type: foreign_key_type
      t.string :variation_digest, null: false

      t.index %i[ blob_id variation_digest ], name: "index_active_storage_variant_records_uniqueness", unique: true
      t.foreign_key :active_storage_blobs, column: :blob_id
    end
  end

  private
    def primary_and_foreign_key_types
      config = Rails.configuration.generators
      setting = config.options[config.orm][:primary_key_type]
      primary_key_type = setting || :primary_key
      foreign_key_type = setting || :bigint
      [primary_key_type, foreign_key_type]
    end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
RailsのActive Storageは、アプリケーション内でファイルアップロードを簡単にするためのフレームワークです。
Active Storageを使うことで、簡単にファイルをアップロードし、クラウドストレージに保存することができます。また、
Active Storageは、画像リサイズやサムネイル生成などの機能も提供しています。

ActiveStorageの機能は主に2つのモデルで作られています。
ActiveStorage::AttachmentとActiveStorage::Blobです。

ActiveStorage::Attachmentは、userとavatorの中間テーブル。主となるモデルとActiveStorage::Blobとの中間テー
ブルに相当するモデルです。
ActiveStorage::Blobは、アバター画像の保存先です。アップロードファイルのメタ情報を管理す流モデルです。

================================================================================================
2
active_storage_blobsを作成するRailsのマイグレーションファイルの一部です。

create_tableメソッドでactive_storage_blobsという名前のテーブルを作成しています。
id: primary_key_typeは、デフォルトのプライマリキーを設定しています。primary_key_typeはRailsのバージョンによ
って異なりますが、通常はbigintになっています。
t.string、t.text、t.bigint、t.datetimeなどのカラムを作成しています。:null => falseは、そのカラムがnullで
あってはならないことを示しています。また、:unique => trueは、そのカラムが一意であることを示しています。
:defaultオプションを使用して、カラムにデフォルト値を設定することもできます。
最後の行で、keyカラムにインデックスを作成しています。このインデックスは一意であることを示しています。

================================================================================================
3
このマイグレーションは、active_storage_attachmentsテーブルを作成しています。このテーブルは、アセットをレコード
に関連付けるために使用されます。テーブルには、次のカラムが含まれています。

name: アセットの名前
record: アセットが関連付けられるレコード
blob: アセット自体のメタデータと、ストレージに保存されたアセットの情報を含むActive Storageのblobsテーブルの参照
created_at: レコードの作成日時
また、このマイグレーションでは、active_storage_attachmentsテーブルのインデックスを作成し、レコードの一意性を確
保するために複数のカラムを組み合わせています。さらに、blobsテーブルに対する外部キー制約を設定しています。
=end
