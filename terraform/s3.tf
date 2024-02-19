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
  # S3 バケットを所有する AWS アカウントがS3のコストを負担する
  payer = "BucketOwner"
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
    # バケットキーが有効か無効かを指定
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

# ------------------------------------------------------------------------------------------------
# "portfolio_tfstate_s3_bucket_versioning"
resource "aws_s3_bucket_versioning" "portfolio_tfstate_s3_bucket_versioning" {
  bucket = aws_s3_bucket.portfolio_tfstate_s3_bucket.bucket
  versioning_configuration {
    status = "Disabled"
  }
}

# ================================================================================================
# S3 "aws_s3_bucket_public_access_block"
# ================================================================================================
# 5
resource "aws_s3_bucket_public_access_block" "rails_active_strage_s3_bucket_public_access_block" {
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

# ------------------------------------------------------------------------------------------------
# "portfolio_tfstate_s3_bucket_public_access_block"
resource "aws_s3_bucket_public_access_block" "portfolio_tfstate_s3_bucket_public_access_block" {
  block_public_acls       = true
  block_public_policy     = true
  bucket                  = aws_s3_bucket.portfolio_tfstate_s3_bucket.bucket
  ignore_public_acls      = true
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
------------------------------------------------------------------------------------------------
- `aws_s3_bucket_request_payment_configuration` リソースを使用して、S3 バケットへのアクセスに関連するデー
タ転送とリクエストのコストを誰が支払うかを設定する。

================================================================================================
3
terraform import aws_s3_bucket_server_side_encryption_configuration.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_server_side_encryption_configuration.s3_bucket_server_side_encryption_configuration portfolio-rails-active-strage-s3-buckey
------------------------------------------------------------------------------------------------
"aws_s3_bucket"でserver_side_encryption_configurationが非推奨になり、こちらのリソースを定義するようになっ
た。
------------------------------------------------------------------------------------------------
- このリソースは、S3バケット内の静止データを自動的に暗号化するために使用します。この設定を適用すると、指定したS3バ
ケットにアップロードされたすべてのファイル（オブジェクト）は、指定した暗号化アルゴリズムを使って暗号化されてから保存
されます。最も一般的な暗号化アルゴリズムはAES-256とaws:kmsで、AES-256はS3によって管理され、aws:kmsは暗号化キー
をよりコントロールできる。`bucket_key_enabled`オプションは、オブジェクトの暗号化にバケツレベルのキーを使用するか
どうかを設定することで、暗号化をさらに安全にすることができる。
- 簡単に言うと、中に入れるもの（アップロードするもの）はすべて自動的にロック（暗号化）され、キーを持つ認証ユーザーの
みがロックを解除（復号化）して中身にアクセスできるようになります。

================================================================================================
4
terraform import aws_s3_bucket_versioning.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_versioning.s3_bucket_versioning portfolio-rails-active-strage-s3-bucket
------------------------------------------------------------------------------------------------
"aws_s3_bucket"でversioningが非推奨になり、こちらのリソースを定義するようになった。
------------------------------------------------------------------------------------------------
- このリソースは、指定したS3バケットのバージョニングを有効または無効にします。バージョニングとは、バケット内のすべて
のファイルに加えられたすべての変更の記録を保持する機能です。ファイルを上書きしたり削除したりしても、S3は古いバージョ
ンのファイルを保持しているので、必要に応じて復元することができます。
- バージョニングが有効な場合、全てのファイルはバージョン履歴持ち、どの時点でもどのバージョンにもアクセスしたり復元し
たりすることができる。

================================================================================================
5
terraform import aws_s3_bucket_public_access_block.<name> <作成したs3のバケット名>
実際の例：
terraform import aws_s3_bucket_public_access_block.s3_bucket_public_access_block portfolio-rails-active-strage-s3-bucket
------------------------------------------------------------------------------------------------
- `aws_s3_bucket`リソース内にこのパブリックアクセスブロック設定を含む様々な設定のためのインライン設定が導入されて
いること。しかし、前回のアップデートの時点では、TerraformはS3バケットのパブリックアクセス設定をバケットの作成や設
定とは別に管理するための別のリソースとして `aws_s3_bucket_public_access_block` を使用することをサポートしてい
る。
------------------------------------------------------------------------------------------------
- . **aws_s3_bucket_public_access_blockリソースの簡単な説明:**.
- S3バケットに「立ち入り禁止」の看板を設置するようなものです。バケットに保存されたファイル(オブジェクト)に一般ユー
ザー(または未承認ユーザー)がアクセスしたり変更したりできないように、厳格なアクセスルールを強制することができます。こ
のリソースで制御できる主な設定は以下の通りです：
- block_public_acls`： block_public_acls`: ユーザが Bucket に新しいパブリックアクセスコントロールリスト
(ACL) を設定するのを阻止します。
- ignore_public_acls`: 公開 ACL を無視する： Bucket に既に設定されているパブリック ACL を無視し、事実上
Bucket を非公開にします。
- block_public_policy`: Bucket に既に設定されている公開 ACL を無視する： バケツへのアクセスを許可するような新
しいパブリックバケツポリシーの作成を禁止する。
- restrict_public_buckets`： パブリックバケットポリシーによるパブリックアクセスを禁止する。これは、偶発的な一般
公開に対する追加の保護です。
- このリソースを使うことで、バケツへのアクセスを明示的な権限を持つ人だけに効果的に制限し、保存データのセキュリティを
強化することができます。特に、設定ミスによって機密データが誤って世界中に公開されないようにするのに有効です。
*/