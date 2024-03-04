# 1
# variable ブロック:Terraformの設定ファイルで変数を定義。変数名：domain、型はstring
variable "domain" {
  type        = string
  description = "The domain name for the application."
}

variable "rails_master_key" {
  type        = string
  description = "Master key for Rails encryption."
}

variable "rds_instance_name" {
  type        = string
  description = "The name of the RDS instance."
}

variable "mysql_db_username" {
  type        = string
  description = "Username for the MySQL database."
}

variable "mysql_db_password" {
  type        = string
  description = "Password for the MySQL database."
}

variable "ecr_image_tag" {
  type        = string
  description = "The tag of the Docker image to use in the ECS task."
  # デフォルト値はlatest
  default     = "latest"
}

variable "tmbd_api_key" {
  type        = string
  description = "api tmbd_api_key"
}

/*
# @          @@          @@          @@          @@          @@          @@          @@          @
1
- **variables.tf`**： Terraformの設定で使用する変数を定義するファイルです。変数のタイプ、デフォルト値（もしあ
れば）、各変数の説明を宣言できます。
- 一方、`terraform.tfvars`ファイルは `variables.tf` で宣言された変数に実際の値を割り当てるために使用される。
開発環境、ステージング環境、本番環境など、異なる環境間でTerraformのデプロイをカスタマイズするための重要なコンポー
ネントです。terraform.tfvars`が "環境変数 "を設定するというのは少し誤解を招きやすい表現です。より正確には、特定
のデプロイメントや環境に固有のTerraform変数の値を設定します。
- terraform.tfvars`を `.gitignore` ファイルに含めることは一般的かつ推奨されるプラクティスです。その理由は、
`terraform.tfvars` には機密情報や環境固有の値が含まれていることが多く、それを公開したりバージョン管理でチェック
したりすべきではないからです。
------------------------------------------------------------------------------------------------
- `variable` ブロックは、Terraform の設定に渡す変数を定義するために使う。各`variable` ブロックでは、変数の名
前と、想定される使い方や動作を記述するいくつかのオプションパラメータを指定することができる。
------------------------------------------------------------------------------------------------
デフォルト値のない変数を含む Terraform 設定に対して `terraform apply` を実行すると、Terraform はプランを実
行するためにその変数に対する入力を要求します。設定に記述されている変数 `ecr_image_tag` については、デフォルト値が
ないため、`terraform apply` の実行中にこの変数の値を入力するようユーザーに促します。
*/
