# 1
variable "ecr_image_tag" {
  description = "The tag of the Docker image to use in the ECS task"
  type        = string
  # デフォルト値はlatest
  default = "latest"
}

# @          @@          @@          @@          @@          @@          @@          @@          @
# 1
# - `variable` ブロックは、Terraform の設定に渡す変数を定義するために使う。各`variable` ブロックでは、変数の名
# 前と、想定される使い方や動作を記述するいくつかのオプションパラメータを指定することができる。
# ------------------------------------------------------------------------------------------------
# デフォルト値のない変数を含む Terraform 設定に対して `terraform apply` を実行すると、Terraform はプランを実
# 行するためにその変数に対する入力を要求します。設定に記述されている変数 `ecr_image_tag` については、デフォルト値が
# ないため、`terraform apply` の実行中にこの変数の値を入力するようユーザーに促します。