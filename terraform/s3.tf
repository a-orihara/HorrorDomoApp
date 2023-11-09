# ================================================================================================
# S3 "aws_s3_bucket"
# ================================================================================================
# 1 "rails_active_strage_s3_bucket"
resource "aws_s3_bucket" "rails_active_strage_s3_bucket" {
  # S3 バケットの名前を指定
  bucket = "portfolio-rails-active-strage-s3-bucket"
  # オブジェクトロックが有効か無効かを指定
  object_lock_enabled = false
  tags                = {}
  tags_all            = {}
  # versioning {
  #   enabled = false
  #   # バージョニングが有効で、オブジェクトの削除に多要素認証（MFA）が必要かどうかを指定
  #   mfa_delete = false
  # }
}

# ------------------------------------------------------------------------------------------------
# "horror_domo_app_tfstate_s3"
resource "aws_s3_bucket" "portfolio_tfstate_s3_bucket" {
  bucket              = "portfolio-tfstate-s3-bucket"
  object_lock_enabled = false
  tags                = {}
  tags_all            = {}
}


# ================================================================================================
# S3 "aws_s3_bucket_request_payment_configuration""
# ================================================================================================
# 2 リクエストを支払うエンティティを指定。"BucketOwner":バケットの所有者がリクエストを支払います。
resource "aws_s3_bucket_request_payment_configuration" "rails_active_strage_s3_bucket_payment" {
  bucket = aws_s3_bucket.rails_active_strage_s3_bucket.bucket
  payer  = "BucketOwner"
}
# ------------------------------------------------------------------------------------------------
# "horror_domo_app_tfstate_s3_bucket_payment"
resource "aws_s3_bucket_request_payment_configuration" "portfolio_tfstate_s3_bucket_payment" {
  bucket = "portfolio-tfstate-s3-bucket"
  payer  = "BucketOwner"
}

# ================================================================================================
# S3 "aws_s3_bucket_server_side_encryption_configuration"
# ================================================================================================
# 3 "rails_active_strage_s3_bucket_sse" サーバーサイドの暗号化設定を指定。
resource "aws_s3_bucket_server_side_encryption_configuration" "rails_active_strage_s3_bucket_sse" {
  bucket = aws_s3_bucket.rails_active_strage_s3_bucket.bucket
  # 暗号化設定のルールを指定
  rule {
    # バケットキーが有効か無効かを指
    bucket_key_enabled = true
    # デフォルトのサーバーサイド暗号化設定を適用。オブジェクトがアップロードされるときに自動的に適用される。
    apply_server_side_encryption_by_default {
      # サーバーサイド暗号化のアルゴリズムを指定
      sse_algorithm = "AES256"
    }
  }
}
# ------------------------------------------------------------------------------------------------
# "portfolio_tfstate_s3_bucket_sse"
resource "aws_s3_bucket_server_side_encryption_configuration" "portfolio_tfstate_s3_bucket_sse" {
  bucket = aws_s3_bucket.portfolio_tfstate_s3_bucket.bucket
  rule {
    bucket_key_enabled = true
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ================================================================================================
# S3 "aws_s3_bucket_versioning"
# ================================================================================================
# 4
resource "aws_s3_bucket_versioning" "rails_active_strage_s3_bucket_versioning" {
  bucket = aws_s3_bucket.rails_active_strage_s3_bucket.bucket
  # バケットのバージョニング設定を指定
  versioning_configuration {
    # バージョニングが有効か無効かを指定
    status = "Disabled"
  }
}


# resource "aws_s3_bucket_versioning" "s3_bucket_versioning" {}

# ================================================================================================
# S3 "aws_s3_bucket_public_access_block"
# ================================================================================================
# 5
resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access_block" {
  # true:バケットレベルのACL（アクセス制御リスト）によるパブリックアクセスをブロック
  block_public_acls = true
  # true:バケットポリシーによるパブリックアクセスをブロック
  block_public_policy = true
  bucket              = aws_s3_bucket.rails_active_strage_s3_bucket.bucket
  #  true:バケット内のオブジェクトに関連するパブリックACL（アクセス制御リスト）を無視
  ignore_public_acls = true
  # true:アカウント内のすべてのS3バケットに対してパブリックアクセスを制限
  restrict_public_buckets = true
}

# resource "aws_s3_bucket_policy" "test" {}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_s3_bucket.<name> <作成済みのs3のname>
実際の例：
terraform import aws_s3_bucket.rails_active_strage_s3_bucket portfolio-rails-active-strage-s3-bucket

================================================================================================
2
terraform import aws_s3_bucket_request_payment_configuration.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_request_payment_configuration.s3_bucket_request_payment_configuration portfolio-rails-active-strage-s3-bucket
------------------------------------------------------------------------------------------------
"aws_s3_bucket"で、
request_payer       = "BucketOwner"の設定が非推奨になり、代わりに、
"aws_s3_bucket_request_payment_configuration"にて設定するようになった。

================================================================================================
3
terraform import aws_s3_bucket_server_side_encryption_configuration.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_server_side_encryption_configuration.s3_bucket_server_side_encryption_configuration portfolio-rails-active-strage-s3-buckey
------------------------------------------------------------------------------------------------
"aws_s3_bucket"でserver_side_encryption_configurationが非推奨になり、こちらのリソースを定義するようになっ
た。

================================================================================================
4
terraform import aws_s3_bucket_versioning.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_versioning.s3_bucket_versioning portfolio-rails-active-strage-s3-bucket
------------------------------------------------------------------------------------------------
"aws_s3_bucket"でversioningが非推奨になり、こちらのリソースを定義するようになった。

================================================================================================
5
terraform import aws_s3_bucket_public_access_block.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_public_access_block.s3_bucket_public_access_block portfolio-rails-active-strage-s3-bucket

*/