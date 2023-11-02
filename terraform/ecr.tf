# ================================================================================================
# ECR "aws_ecr_repository"
# ================================================================================================
# 1
resource "aws_ecr_repository" "nextjs_img_prod" {
  # 1.1
  image_tag_mutability = "MUTABLE"
  # ECRリポジトリの名前
  name     = "nextjs-img-prod"
  tags     = {}
  tags_all = {}
  # 1.2
  encryption_configuration {
    encryption_type = "AES256"
  }
  # 1.3
  image_scanning_configuration {
    scan_on_push = false
  }
  # 1.4
  timeouts {}
}

resource "aws_ecr_repository" "nginx_img_prod" {
  image_tag_mutability = "MUTABLE"
  name                 = "nginx-img-prod"
  tags                 = {}
  tags_all             = {}
  encryption_configuration {
    encryption_type = "AES256"
  }
  image_scanning_configuration {
    scan_on_push = false
  }
  timeouts {}
}

resource "aws_ecr_repository" "rails_img_prod" {
  image_tag_mutability = "MUTABLE"
  name                 = "rails-img-prod"
  tags                 = {}
  tags_all             = {}
  encryption_configuration {
    encryption_type = "AES256"
  }
  image_scanning_configuration {
    scan_on_push = false
  }
  timeouts {}
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_ecr_repository.<name> <ecrのリポジトリ名>
実際の例：
terraform import aws_ecr_repository.nextjs-img-prod nextjs-img-prod

================================================================================================
1.1
- `image_tag_mutability`: この設定は、ECR（Amazon Elastic Container Registry）リポジトリ内のイメージの
タグが変更可能かどうかを制御します。"MUTABLE" を指定すると、タグが変更可能で、同じタグに新しいイメージをプッシュで
きます。"IMMUTABLE" を指定すると、タグが変更不可で、一度タグが設定されたら変更できません。提供されたコードでは
"MUTABLE" が指定されており、タグが変更可能です。

================================================================================================
1.2
- `encryption_configuration`: この設定は、リポジトリ内のイメージデータを暗号化するためのものです。
`encryption_type` に "AES256" を指定することで、データをAES-256暗号化アルゴリズムを使用して暗号化できます。

================================================================================================
1.3
- `image_scanning_configuration`: この設定は、イメージプッシュ時のスキャンの有効化または無効化を制御します。
`scan_on_push` を `false` に設定すると、イメージのプッシュ時にスキャンが無効になります。

================================================================================================
1.4
- `timeouts`: この設定は、リソース操作のタイムアウトを指定するためのものです。提供されたコードでは空のブロックが
あり、デフォルトのタイムアウト設定が使用されます。

================================================================================================
1.1

================================================================================================
1.1
*/