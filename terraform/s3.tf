# ================================================================================================
# S3 "aws_s3_bucket"
# ================================================================================================
# 1 "rails_active_strage_s3_bucket"
resource "aws_s3_bucket" "rails_active_strage_s3_bucket" {
  # S3 バケットの名前を指定
  bucket              = "portfolio-rails-active-strage-s3-bucket"
  # バケットのホステッドゾーンIDを指定
  hosted_zone_id      = "Z2M4EHUR26P7ZW"
  # オブジェクトロックが有効か無効かを指定
  object_lock_enabled = false
  # リクエストを支払うエンティティを指定。"BucketOwner":バケットの所有者がリクエストを支払います。
  request_payer       = "BucketOwner"
  tags                = {}
  tags_all            = {}
  # サーバーサイドの暗号化設定を指定
  server_side_encryption_configuration {
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
  # バケットのバージョニング設定を指定
  versioning {
    # バージョニングが有効か無効かを指定
    enabled    = false
    # バージョニングが有効で、オブジェクトの削除に多要素認証（MFA）が必要かどうかを指定
    mfa_delete = false
  }
}

# ================================================================================================
# S3 "aws_s3_bucket_request_payment_configuration""
# ================================================================================================

resource "aws_s3_bucket_request_payment_configuration" "aws_"{}
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_s3_bucket.<name> <作成済みのs3のname>
実際の例：
terraform import aws_s3_bucket.rails_active_strage_s3_bucket portfolio-rails-active-strage-s3-bucket
*/